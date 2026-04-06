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
