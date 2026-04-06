import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import SupportTicket from '@/models/SupportTicket';
import Order from '@/models/Order';
import { auth } from '@/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await auth();
    const { id } = await params;
    const { issueType, description } = await request.json();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const order = await Order.findOne({ _id: id, 'user.email': session.user.email });
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const ticket = await SupportTicket.create({
      orderId: id,
      userEmail: session.user.email,
      issueType,
      description,
      status: 'open'
    });

    // Optionally update order metadata to show a ticket is open
    await Order.updateOne({ _id: id }, { $set: { hasActiveTicket: true } });

    return NextResponse.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Support Report Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
