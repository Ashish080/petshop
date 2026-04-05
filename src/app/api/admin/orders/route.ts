import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import { auth } from '@/auth';

// GET /api/admin/orders - Get all orders (Admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const query: Record<string, unknown> = {};
    if (status) {
      query.orderStatus = status;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
      Order.countDocuments(query)
    ]);

    const formattedOrders = orders.map((o) => {
      const u = o.user as { email?: string; name?: string; phone?: string } | undefined;
      return {
        ...o,
        _id: o._id.toString(),
        id: o._id.toString(),
        user: u && typeof u === 'object' ? u : { email: String(o.user) },
        totalPrice: o.total,
        items: o.items.map((item) => ({
          ...item,
          product: (item as { productId?: string }).productId,
          variantName:
            (item as { variant?: { variantName?: string } }).variant?.variantName,
        })),
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/orders - Update order status (Admin only)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { orderId, orderStatus, paymentStatus } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, string> = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const plain = order.toObject();
    const itemsPlain = plain.items as unknown as Array<
      Record<string, unknown> & { productId?: string }
    >;
    const formattedOrder = {
      ...plain,
      _id: order._id.toString(),
      id: order._id.toString(),
      user: plain.user,
      totalPrice: order.total,
      items: itemsPlain.map((item) => ({
        ...item,
        product: item.productId,
      })),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedOrder,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
