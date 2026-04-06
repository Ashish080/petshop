import mongoose from 'mongoose';
import { ServiceError } from './base.service';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import redis from '../lib/redis';
import { sendEmail, generateOrderEmailTemplate } from '../lib/email';
import { cached, invalidate } from '../lib/cache';
import { z } from 'zod';

const OrderItemSchema = z.object({
  product: z.string().optional(),
  name: z.string().optional(),
  quantity: z.number().int().positive().or(z.string().regex(/^\d+$/).transform(Number)),
  variantName: z.string().optional(),
}).refine(data => data.product || data.name, {
  message: "Either product ID or name must be provided",
  path: ["product"]
});

const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1, "Order must contain at least one item"),
  shippingAddress: z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().optional()
  }),
  paymentMethod: z.enum(['cod', 'wallet', 'razorpay', 'upi']).optional().default('cod'),
  notes: z.string().optional()
});

// ─── Helpers ────────────────────────────────────────────────────────────────
function isMongoObjectIdString(id: string) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function findProductForOrderLine(item: { product?: string; name?: string }) {
  const idOrRef = String(item.product ?? '').trim();
  const name = item.name?.trim();

  if (idOrRef && isMongoObjectIdString(idOrRef)) {
    const byId = await Product.findOne({ _id: idOrRef, isActive: true });
    if (byId) return byId;
  }

  if (idOrRef) {
    const byCatalog = await Product.findOne({ catalogId: idOrRef, isActive: true });
    if (byCatalog) return byCatalog;
  }

  if (name) {
    const exact = await Product.findOne({ name, isActive: true });
    if (exact) return exact;
    const ci = await Product.findOne({
      name: { $regex: new RegExp(`^${escapeRegex(name)}$`, 'i') },
      isActive: true,
    });
    if (ci) return ci;
  }

  return null;
}

export class OrderService {
  static async createOrder(data: unknown, sessionUser: { email: string; name?: string | null }) {
    const parsed = CreateOrderSchema.safeParse(data);
    if (!parsed.success) {
      throw new ServiceError(`Invalid order data: ${parsed.error.issues.map(e => e.message).join(', ')}`, 'VALIDATION_ERROR', 400);
    }
    const { items, shippingAddress, paymentMethod, notes } = parsed.data;

    const email = sessionUser.email.toLowerCase().trim();
    const session = await mongoose.startSession();
    let isTransactionActive = false;
    let orderObj: any;
    
    try {
      try {
        await session.startTransaction();
        isTransactionActive = true;
      } catch(e) {
        // Fallback for standalone mongo (local dev)
        console.warn('[DB_WARNING] Transactions not supported on this node. proceeding without atomicity.');
      }
      
      let totalPrice = 0;
      const validatedItems: any[] = [];

      // 1. Validate Products and Deduct Stock
      for (const item of items) {
        const qty = Number(item.quantity);
        const product = await findProductForOrderLine({ product: item.product, name: item.name });
        if (!product) throw new ServiceError(`Product "${item.name}" not found`, 'PRODUCT_NOT_FOUND', 404);

        let unitPrice = product.price;

        if (item.variantName) {
          const result = await Product.findOneAndUpdate(
            { _id: product._id, 'variants.name': item.variantName, 'variants.stock': { $gte: qty } },
            { $inc: { 'variants.$.stock': -qty } },
            { session: isTransactionActive ? session : undefined, new: true, returnDocument: 'after' }
          );
          if (!result) throw new ServiceError(`Insufficient stock for ${product.name} (${item.variantName})`, 'INSUFFICIENT_STOCK', 400);
          const variant = product.variants.find((v: any) => v.name === item.variantName);
          if (variant) unitPrice = variant.price;
        } else {
          const result = await Product.findOneAndUpdate(
            { _id: product._id, stock: { $gte: qty } },
            { $inc: { stock: -qty } },
            { session: isTransactionActive ? session : undefined, new: true, returnDocument: 'after' }
          );
          if (!result) throw new ServiceError(`Insufficient stock for ${product.name}`, 'INSUFFICIENT_STOCK', 400);
        }

        totalPrice += unitPrice * qty;
        validatedItems.push({
          productId: product._id,
          name: product.name,
          price: unitPrice,
          quantity: qty,
          image: product.images?.[0] || '',
          variant: item.variantName ? { variantName: item.variantName } : undefined
        });
      }

      const grandTotal = totalPrice + (totalPrice >= 499 ? 0 : 50);

      // 2. Create Order
      const [createdOrder] = await Order.create([{
        user: {
          email,
          name: sessionUser.name || shippingAddress.name,
          phone: shippingAddress.phone
        },
        items: validatedItems,
        shippingAddress: {
          name: shippingAddress.name,
          phone: shippingAddress.phone,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.pincode || '',
          country: 'India',
        },
        subtotal: totalPrice,
        total: grandTotal,
        paymentMethod: paymentMethod || 'cod',
        paymentStatus: paymentMethod === 'wallet' ? 'paid' : 'pending',
        orderStatus: 'pending',
        notes: notes?.trim()
      }], { session: isTransactionActive ? session : undefined });

      orderObj = createdOrder;

      // 3. Process Wallet Payment
      if (paymentMethod === 'wallet') {
        const WalletModel = (await import('../models/Wallet')).default;
        const wallet = await WalletModel.findOneAndUpdate(
          { userEmail: email, balance: { $gte: grandTotal } },
          { 
            $inc: { balance: -grandTotal }, 
            $push: { transactions: { type: 'debit', amount: grandTotal, description: `Order ${orderObj.orderNumber}`, orderId: orderObj._id, createdAt: new Date() } } 
          },
          { session: isTransactionActive ? session : undefined, new: true, returnDocument: 'after' }
        );
        
        if (!wallet) {
          throw new ServiceError('Insufficient Wallet Balance', 'INSUFFICIENT_BALANCE', 400);
        }
      }

      // 4. Referral Reward Process
      const userRaw = await User.findOne({ email });
      const user = isTransactionActive ? await User.findOne({ email }).session(session) : userRaw;

      if (user?.referredBy) {
        const count = isTransactionActive ? 
           await Order.countDocuments({'user.email': email}).session(session) : 
           await Order.countDocuments({'user.email': email});

        if (count === 1) {
          const WalletModel = (await import('../models/Wallet')).default;
          await WalletModel.findOneAndUpdate(
            { userEmail: user.referredBy },
            { $inc: { balance: 100 }, $push: { transactions: { type: 'credit', amount: 100, description: `Referral: ${user.name}`, createdAt: new Date() } } },
            { upsert: true, session: isTransactionActive ? session : undefined }
          );
        }
      }

      if (session.inTransaction()) {
        await session.commitTransaction();
      }
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      session.endSession();
    }

    // async side effects (don't block response)
    try {
      await redis.del(`orders:user:${email}`);
      await redis.publish('admin:live-feed', JSON.stringify({
        type: 'new_order',
        data: orderObj,
        timestamp: Date.now()
      }));

      sendEmail({
        to: email,
        subject: `Order Confirmed: #${orderObj.orderNumber}`,
        html: generateOrderEmailTemplate(JSON.parse(JSON.stringify(orderObj)))
      }).catch(() => {});
    } catch(e) { /* ignore cache/email errors in response */ }

    return orderObj;
  }

  static async getUserOrders(email: string) {
    const cacheKey = email.toLowerCase().trim();
    return cached(`user:${cacheKey}`, async () => {
      return Order.find({ 'user.email': cacheKey }).sort({ createdAt: -1 }).lean();
    }, { ttl: 120, prefix: 'orders' });
  }
}
