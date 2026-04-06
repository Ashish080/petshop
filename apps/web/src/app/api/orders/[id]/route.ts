import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import { auth } from '@/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await auth();
    const { id } = await params;

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const order = await Order.findById(id).lean();

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const isOwner = session.user.email === order.user.email;
    const isAdmin = session.user.role === 'admin';
    const isRider = session.user.role === 'rider' && order.riderId?.toString() === session.user.id;
    const isAvailableToRider = session.user.role === 'rider' && !order.riderId && ['placed', 'confirmed'].includes(order.orderStatus);

    if (!isOwner && !isAdmin && !isRider && !isAvailableToRider) {
       return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Order Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await auth();
    const { id } = await params;
    const { status } = await request.json();

    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Security: Only owner can cancel their own order
    if (session.user.email !== order.user.email && session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    if (status === 'cancelled') {
      // Logic: 120 seconds window
      const timeDiffSeconds = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
      const CANCELLATION_WINDOW = 120;

      if (timeDiffSeconds > CANCELLATION_WINDOW && session.user.role !== 'admin') {
        return NextResponse.json({ 
          success: false, 
          error: 'Cancellation window (2 mins) has expired. Please contact support.' 
        }, { status: 400 });
      }

      if (!['pending', 'placed', 'confirmed'].includes(order.orderStatus)) {
        return NextResponse.json({ 
          success: false, 
          error: `Cannot cancel order in ${order.orderStatus} state.` 
        }, { status: 400 });
      }

      order.orderStatus = 'cancelled';
      order.paymentStatus = order.paymentMethod === 'cod' ? 'pending' : 'refunded';
      await order.save();

      return NextResponse.json({ success: true, message: 'Order cancelled successfully' });
    }

    return NextResponse.json({ success: false, error: 'Invalid operation' }, { status: 400 });
  } catch (error) {
    console.error('Order Patch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
