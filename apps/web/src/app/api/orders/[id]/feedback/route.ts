import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import { auth } from '@/auth';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const session = await auth();
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { rating, comment } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, error: 'Invalid rating (1-5)' }, { status: 400 });
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Verify ownership
    if (order.user.email !== session.user.email) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // Verify delivery
    if (order.orderStatus !== 'delivered') {
      return NextResponse.json({ success: false, error: 'Order not delivered yet' }, { status: 400 });
    }

    order.feedback = {
      rating,
      comment,
      createdAt: new Date()
    };

    await order.save();

    return NextResponse.json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
