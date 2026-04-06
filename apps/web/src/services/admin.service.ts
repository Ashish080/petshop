import { ServiceError } from './base.service';
import Order from '../models/Order';
import User from '../models/User';
import { emitOrderStatusChange } from '../lib/orderEvents';
import { isValidTransition, OrderStatus } from '../config/order-states';
import Product from '../models/Product';
import Wallet from '../models/Wallet';
import AuditLog from '../models/AuditLog';
import { z } from 'zod';

const UpdateOrderSchema = z.object({
  orderId: z.string().length(24),
  orderStatus: z.enum([
    'pending', 'confirmed', 'accepted', 'picked', 'out-for-delivery', 'delivered', 'cancelled'
  ]).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  riderId: z.string().length(24).optional()
});

const WalletAdjustmentSchema = z.object({
  email: z.string().email(),
  amount: z.number().refine(n => n !== 0, "Amount must not be zero"),
  reason: z.string().min(3).max(100),
});

const AdjustStockSchema = z.object({
  productId: z.string().length(24),
  delta: z.number().int().refine(d => d !== 0, "Adjustment must be non-zero"),
});

export class AdminService {
  static async getOrders(options: { status?: string, page?: number, limit?: number }) {
    const page = options.page || 1;
    const limit = options.limit || 50; // Add pagination with default 50
    const skip = (page - 1) * limit;

    const query: any = options.status ? { orderStatus: options.status } : {};

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query)
    ]);

    return {
      orders: orders.map(o => ({ ...o, _id: o._id.toString(), id: o._id.toString() })),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  }

  static async updateOrder(data: unknown) {
    const parsed = UpdateOrderSchema.safeParse(data);
    if (!parsed.success) {
      throw new ServiceError(`Invalid input: ${parsed.error.issues.map((e: z.ZodIssue) => e.message).join(', ')}`, 'VALIDATION_ERROR', 400);
    }

    const { orderId, orderStatus, paymentStatus, riderId } = parsed.data;

    const currentOrder = await Order.findById(orderId);
    if (!currentOrder) {
      throw new ServiceError('Order not found', 'NOT_FOUND', 404);
    }

    const updateData: any = {};

    // 1. State Machine Validation
    if (orderStatus && orderStatus !== currentOrder.orderStatus) {
      const transition = isValidTransition(currentOrder.orderStatus as OrderStatus, orderStatus as OrderStatus, 'admin');
      if (!transition.valid) {
        throw new ServiceError(transition.reason || 'Invalid order status transition', 'INVALID_TRANSITION', 400);
      }
      updateData.orderStatus = orderStatus;
    }

    // 2. Payment Status Update
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    // 3. Rider Assignment Validation
    if (riderId) {
      const riderUser = await User.findById(riderId);
      if (!riderUser || riderUser.role !== 'rider') {
        throw new ServiceError('Invalid Rider ID provided or user is not a rider', 'INVALID_RIDER', 400);
      }
      updateData.riderId = riderId;
    }

    // Need rider assignment to transition to 'confirmed' if it requires rider?
    // According to config, confirmed requires rider assignment. So either we provide riderId now or order already has it.
    if (updateData.orderStatus === 'confirmed') {
      const hasRider = updateData.riderId || currentOrder.riderId;
      if (!hasRider) {
         throw new ServiceError('Rider must be assigned to confirm order', 'MISSING_RIDER', 400);
      }
    }

    // Avoid empty updates
    if (Object.keys(updateData).length === 0) {
      return currentOrder.toObject();
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true, lean: true }
    );

    if (!order) {
       throw new ServiceError('Order update failed', 'UPDATE_FAILED', 500);
    }

    // Publish Redis Event for Real-Time Update
    if (updateData.orderStatus) {
       emitOrderStatusChange({
         orderId,
         orderStatus: updateData.orderStatus,
         riderId: order.riderId?.toString(),
         updatedAt: new Date().toISOString()
       }).catch(() => {}); // fire and forget
    }

    return order;
  }

  static async verifyRiderKYC(adminId: string, adminEmail: string, riderId: string, status: 'verified' | 'rejected', reason?: string) {
    if (!['verified', 'rejected'].includes(status)) {
       throw new ServiceError('Invalid verification status', 'VALIDATION_ERROR', 400);
    }

    const updates: any = { 
       kycStatus: status
    };

    if (status === 'verified') {
        updates['kycDetails.verifiedAt'] = new Date();
    } else {
        updates['kycDetails.rejectedReason'] = reason;
    }

    const user = await User.findByIdAndUpdate(
       riderId,
       { $set: updates },
       { new: true, lean: true }
    );

    if (!user) throw new ServiceError('Rider not found', 'NOT_FOUND', 404);

    // Audit Log
    await AuditLog.create({
       adminEmail,
       action: 'SYSTEM_CONFIG',
       targetId: riderId,
       targetType: 'user',
       changes: { 
          before: { kycStatus: 'pending' }, 
          after: { kycStatus: status, reason } 
       },
       reason: `Rider KYC ${status}: ${reason || 'No reason provided'}`
    });

    return user;
  }

  static async getStats() {
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      lowStockProducts,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'user' }),
      Product.find({ isActive: true }).select('stock lowStockThreshold').lean(),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    const lowStockCount = (lowStockProducts as any[]).filter(
      p => p.stock > 0 && p.stock <= p.lowStockThreshold
    ).length;

    const formattedRecentOrders = recentOrders.map((o) => {
      const u = o.user as { email?: string; name?: string; phone?: string } | undefined;
      return {
        ...o,
        _id: o._id.toString(),
        id: o._id.toString(),
        user: u && typeof u === 'object' ? u : { email: String(o.user) },
        totalPrice: o.total,
        items: o.items.map((item: any) => ({
          ...item,
          product: item.productId,
        })),
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
      };
    });

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalProducts,
      totalCustomers,
      lowStockProducts: lowStockCount,
      recentOrders: formattedRecentOrders
    };
  }

  static async adjustWallet(data: unknown, adminEmail: string) {
    const parsed = WalletAdjustmentSchema.safeParse(data);
    if (!parsed.success) {
      throw new ServiceError(parsed.error.issues[0].message, 'VALIDATION_ERROR', 400);
    }

    const { email, amount, reason } = parsed.data;

    // Get current balance for audit log
    const prevWallet = await Wallet.findOne({ userEmail: email }).lean();
    const prevBalance = prevWallet?.balance || 0;

    const wallet = await Wallet.findOneAndUpdate(
       { userEmail: email },
       { 
          $inc: { balance: amount },
          $push: { 
             transactions: { 
                type: amount > 0 ? 'credit' : 'debit', 
                amount: Math.abs(amount), 
                description: `Admin Support Adjustment: ${reason}`,
                createdAt: new Date()
             } 
          }
       },
       { upsert: true, returnDocument: 'after', lean: true }
    );

    if (!wallet) throw new ServiceError('Wallet update failed', 'UPDATE_FAILED', 500);

    // Audit Log
    await AuditLog.create({
       adminEmail,
       action: 'WALLET_ADJUSTMENT',
       targetId: email,
       targetType: 'user',
       changes: { before: { balance: prevBalance }, after: { balance: wallet.balance } },
       reason
    });

    return wallet;
  }

  static async adjustStock(data: unknown, adminEmail: string) {
    const parsed = AdjustStockSchema.safeParse(data);
    if (!parsed.success) {
      throw new ServiceError(parsed.error.issues[0].message, 'VALIDATION_ERROR', 400);
    }

    const { productId, delta } = parsed.data;

    const prevProduct = await Product.findById(productId).select('stock').lean();
    if (!prevProduct) throw new ServiceError('Product not found', 'NOT_FOUND', 404);

    const product = await Product.findByIdAndUpdate(
      productId, 
      { $inc: { stock: delta } }, 
      { returnDocument: 'after', runValidators: true, lean: true }
    );

    if (!product) throw new ServiceError('Product update failed', 'UPDATE_FAILED', 500);

    // Audit Log
    await AuditLog.create({
       adminEmail,
       action: 'STOCK_ADJUSTMENT',
       targetId: productId,
       targetType: 'product',
       changes: { before: { stock: prevProduct.stock }, after: { stock: product.stock } },
       reason: `Manual inventory adjustment by admin: ${delta > 0 ? '+' : ''}${delta}`
    });

    return { ...product, id: product._id.toString() };
  }
}
