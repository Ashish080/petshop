import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { auth } from '@/auth';
import { sendEmail, generateOrderEmailTemplate } from '@/lib/email';

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

// ─── POST /api/orders ────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });

    const { items, shippingAddress, paymentMethod, notes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Order must contain at least one item' }, { status: 400 });
    }

    const deducted: any[] = [];
    let totalPrice = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      const qty = Number(item.quantity);
      const product = await findProductForOrderLine({ product: item.product, name: item.name });
      if (!product) throw new Error(`Product "${item.name}" not found`);

      let unitPrice = product.price;

      if (item.variantName) {
        const result = await Product.findOneAndUpdate(
          { _id: product._id, 'variants.name': item.variantName, 'variants.stock': { $gte: qty } },
          { $inc: { 'variants.$.stock': -qty } },
          { returnDocument: 'after' }
        );
        if (!result) throw new Error(`Insufficient stock for ${product.name} (${item.variantName})`);
        const variant = product.variants.find((v: any) => v.name === item.variantName);
        if (variant) unitPrice = variant.price;
      } else {
        const result = await Product.findOneAndUpdate(
          { _id: product._id, stock: { $gte: qty } },
          { $inc: { stock: -qty } },
          { returnDocument: 'after' }
        );
        if (!result) throw new Error(`Insufficient stock for ${product.name}`);
      }

      deducted.push({ productId: product._id, variantName: item.variantName, qty });
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
    const email = session.user.email.toLowerCase().trim();

    // ── Create Order ──
    const orderObj: any = await Order.create({
      user: {
        email,
        name: session.user.name || shippingAddress.name,
        phone: shippingAddress.phone
      },
      orderNumber: `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
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
    });

    if (paymentMethod === 'wallet') {
      const Wallet = (await import('@/models/Wallet')).default;
      const wallet = await Wallet.findOneAndUpdate(
        { userEmail: email, balance: { $gte: grandTotal } },
        { 
          $inc: { balance: -grandTotal }, 
          $push: { transactions: { type: 'debit', amount: grandTotal, description: `Order ${orderObj.orderNumber}`, orderId: orderObj._id } } 
        }
      );
      if (!wallet) throw new Error('Insufficient Balance');
    }

    // ── Referral Reward ──
    const user = await User.findOne({ email });
    if (user?.referredBy) {
      const count = await Order.countDocuments({ 'user.email': email });
      if (count === 1) {
        const Wallet = (await import('@/models/Wallet')).default;
        await Wallet.findOneAndUpdate(
          { userEmail: user.referredBy },
          { $inc: { balance: 100 }, $push: { transactions: { type: 'credit', amount: 100, description: `Referral: ${user.name}` } } },
          { upsert: true }
        );
      }
    }

    sendEmail({
      to: email,
      subject: `Order Confirmed: #${orderObj.orderNumber}`,
      html: generateOrderEmailTemplate(JSON.parse(JSON.stringify(orderObj)))
    }).catch(() => {});

    return NextResponse.json({ success: true, data: orderObj }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const orders = await Order.find({ 'user.email': session.user.email.toLowerCase() }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: orders });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}
