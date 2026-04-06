import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { auth } from '@/auth';

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
/**
 * NOTE: Standalone MongoDB does not support multi-document transactions.
 * We use a "reserve-then-compensate" pattern:
 *   1. Atomic $inc stock deduction per product (each is atomic individually).
 *   2. Create the order.
 *   3. On ANY error after stock deduction, restore stock with $inc +qty.
 * This is safe because $inc is atomic. The only risk window is a server crash
 * between deduction and compensation — acceptable for dev/staging.
 * For production, switch to MongoDB Atlas or a replica set to enable true ACID transactions.
 */
export async function POST(request: NextRequest) {
  await connectDB();
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const { items, shippingAddress, paymentMethod, notes } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ success: false, error: 'Order must contain at least one item' }, { status: 400 });
  }

  if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.state) {
    return NextResponse.json({ success: false, error: 'Complete shipping address is required' }, { status: 400 });
  }

  // Track deductions for compensation on failure
  const deducted: { productId: string; variantName?: string; qty: number }[] = [];
  let totalPrice = 0;
  const validatedItems: any[] = [];

  try {
    // ── Step 1: Validate items and deduct stock (atomic per product) ──────────
    for (const item of items) {
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1) {
        throw new Error(`Invalid quantity for item: ${item.name}`);
      }

      const product = await findProductForOrderLine({ product: item.product, name: item.name });
      if (!product) {
        throw new Error(`Product "${item.name || item.product}" not found or inactive`);
      }

      let unitPrice = product.price;

      if (item.variantName) {
        // Variant stock deduction — atomic
        const result = await Product.findOneAndUpdate(
          {
            _id: product._id,
            'variants.name': item.variantName,
            'variants.stock': { $gte: qty },
          },
          { $inc: { 'variants.$.stock': -qty } },
          { new: true }
        );
        if (!result) {
          throw new Error(`Insufficient stock for ${product.name} (${item.variantName})`);
        }
        const variant = product.variants.find((v: any) => v.name === item.variantName);
        if (variant) unitPrice = variant.price;
      } else {
        // Base stock deduction — atomic, guards against going below 0
        const result = await Product.findOneAndUpdate(
          { _id: product._id, stock: { $gte: qty } },
          { $inc: { stock: -qty } },
          { new: true }
        );
        if (!result) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }
      }

      // Track what was deducted for potential rollback
      deducted.push({ productId: String(product._id), variantName: item.variantName, qty });

      totalPrice += unitPrice * qty;
      validatedItems.push({
        productId: String(product._id),
        name: product.name,
        price: unitPrice,
        quantity: qty,
        image: product.images?.[0] || '',
        ...(item.variantName
          ? { variant: { variantName: item.variantName, selectedOption: item.variantName } }
          : {}),
      });
    }

    // ── Step 2: Calculate totals ──────────────────────────────────────────────
    const freeDeliveryThreshold = parseInt(
      process.env.NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD || '499'
    );
    const shipping = totalPrice >= freeDeliveryThreshold ? 0 : 50;
    const grandTotal = totalPrice + shipping;

    const email = session.user.email.toLowerCase().trim();

    // ── Step 3: Create Order ──────────────────────────────────────────────────
    const order = await Order.create({
      user: {
        email,
        name: shippingAddress.name || session.user.name || undefined,
        phone: shippingAddress.phone || undefined,
      },
      items: validatedItems,
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.pincode || shippingAddress.zipCode || '',
        country: shippingAddress.country || 'India',
      },
      subtotal: totalPrice,
      tax: 0,
      shipping,
      total: grandTotal,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      notes: notes?.trim(),
    });

    return NextResponse.json(
      { success: true, data: order, message: 'Order placed successfully' },
      { status: 201 }
    );

  } catch (error: any) {
    // ── Compensate: restore deducted stock on failure ─────────────────────────
    if (deducted.length > 0) {
      await Promise.allSettled(
        deducted.map(({ productId, variantName, qty }) => {
          if (variantName) {
            return Product.updateOne(
              { _id: productId, 'variants.name': variantName },
              { $inc: { 'variants.$.stock': qty } }
            );
          }
          return Product.updateOne({ _id: productId }, { $inc: { stock: qty } });
        })
      );
    }

    console.error('[ORDER_POST_ERROR]', error.message);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 400 }
    );
  }
}

// ─── GET /api/orders ─────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email.toLowerCase().trim();
    const orders = await Order.find({ 'user.email': email })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('[GET_ORDERS_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
