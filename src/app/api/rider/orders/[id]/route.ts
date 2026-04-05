import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import { auth } from '@/auth';

// PATCH /api/rider/orders/[id] - Update order status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const session = await auth();
    const { id } = await params;

    if (!session || (session.user.role !== 'rider' && session.user.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { status } = await request.json();

    const allowedStatuses = ['placed', 'accepted', 'picked', 'out-for-delivery', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    const order = await Order.findOneAndUpdate(
      { _id: id, riderId: session.user.id },
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found or not assigned to you' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Rider Status Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
