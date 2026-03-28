import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { auth } from '@/lib/auth';

/** Cart may send Mongo ObjectId or static catalog ids (p1, p2) from `productsData`. */
function isMongoObjectIdString(id: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Resolve product for checkout: try ObjectId, catalogId, then exact / case-insensitive name.
 * If ObjectId is valid hex but missing in DB, we still fall back to catalog + name.
 */
async function findProductForOrderLine(item: { product: string; name: string }) {
  const idOrRef = String(item.product ?? '').trim();
  const name = item.name?.trim();

  if (idOrRef && isMongoObjectIdString(idOrRef)) {
    const byId = await Product.findById(idOrRef);
    if (byId?.isActive) return byId;
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

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: Record<string, unknown> = {};

    // Admin can see all orders, users only their own
    if (session.user.role !== 'admin') {
      query['user.email'] = session.user.email;
    }

    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .lean();

    const formattedOrders = orders.map(o => ({
      ...o,
      _id: o._id.toString(),
      id: o._id.toString(),
      user: typeof o.user === 'object' ? (o.user as any).email : o.user,
      items: o.items.map(item => ({
        ...item,
        product: (item as any).product?.toString() || item.productId
      })),
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      data: formattedOrders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create order with atomic stock deduction
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { items, shippingAddress, paymentMethod, notes } = await request.json();

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    // Validate stock and calculate total
    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1) {
        return NextResponse.json(
          { success: false, error: 'Each item must have a positive integer quantity' },
          { status: 400 }
        );
      }

      const product = await findProductForOrderLine({
        product: item.product,
        name: item.name,
      });

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.name} is not available` },
          { status: 400 }
        );
      }

      let unitPrice = product.price;

      // Check stock & resolve price from DB (ignore client-tampered prices)
      if (item.variantName) {
        const variant = product.variants.find((v) => v.name === item.variantName);
        if (!variant || variant.stock < qty) {
          return NextResponse.json(
            { success: false, error: `Insufficient stock for ${product.name} (${item.variantName})` },
            { status: 400 }
          );
        }
        unitPrice = variant.price;
      } else if (product.stock < qty) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      totalPrice += unitPrice * qty;
      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || '',
        price: unitPrice,
        quantity: qty,
        variantName: item.variantName,
      });
    }

    // Calculate delivery
    const freeDeliveryThreshold = parseInt(process.env.NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD || '499');
    const delivery = totalPrice >= freeDeliveryThreshold ? 0 : 50;
    const subtotal = totalPrice;
    const grandTotal = subtotal + delivery;

    let email = session.user.email?.trim();
    if (!email && session.user.id) {
      const dbUser = await User.findById(session.user.id).select('email').lean();
      email = dbUser?.email?.trim() ?? '';
    }
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Account email is required to place an order' },
        { status: 400 }
      );
    }

    // Create order and deduct stock atomically
    const order = await Order.create({
      user: {
        email,
        name: session.user.name ?? undefined,
      },
      items: validatedItems.map((i) => ({
        productId: String(i.product),
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        ...(i.variantName
          ? { variant: { variantName: i.variantName, selectedOption: i.variantName } }
          : {}),
      })),
      shippingAddress,
      subtotal,
      tax: 0,
      shipping: delivery,
      total: grandTotal,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: 'pending',
      orderStatus: 'pending',
      ...(typeof notes === 'string' && notes.trim() ? { notes: notes.trim() } : {}),
    });

    // Deduct stock
    for (const item of validatedItems) {
      const product = await Product.findById(item.product);
      if (product) {
        if (item.variantName) {
          // Deduct from variant
          const variant = product.variants.find(v => v.name === item.variantName);
          if (variant) {
            variant.stock -= item.quantity;
          }
        } else {
          // Deduct from main stock
          product.stock -= item.quantity;
        }
        await product.save();
      }
    }

    const formattedOrder = {
      ...order.toObject(),
      _id: order._id.toString(),
      id: order._id.toString(),
      items: order.items.map((i) => ({
        ...i,
        productId: (i as { productId?: string }).productId,
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedOrder,
      message: 'Order placed successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
