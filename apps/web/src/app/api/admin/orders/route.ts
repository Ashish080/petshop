import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import { auth } from '@/auth';

// PATCH /api/admin/orders - Secure Update and Assignment Logic
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

    const { orderId, orderStatus, paymentStatus, riderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    // SECURITY FIX: Prevent any user ID as riderId - must verify rider existence and role
    if (riderId) {
      const riderUser = await User.findById(riderId);
      if (!riderUser || riderUser.role !== 'rider') {
        return NextResponse.json({ success: false, error: 'Invalid Rider ID provided' }, { status: 400 });
      }
      updateData.riderId = riderId;
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    );

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    });
  } catch (error) {
    console.error('[ADMIN_ORDER_PATCH_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// GET /api/admin/orders - Optimized Querying
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const query: any = status ? { orderStatus: status } : {};

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      data: orders.map(o => ({ ...o, id: o._id.toString() }))
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}
