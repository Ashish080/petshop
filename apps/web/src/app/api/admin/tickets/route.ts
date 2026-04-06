import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import SupportTicket from '@/models/SupportTicket';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const tickets = await SupportTicket.find({
      status: { $ne: 'resolved' }
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    console.error('Admin Tickets Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const { id, status } = await request.json();

    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const updated = await SupportTicket.findByIdAndUpdate(
      id,
      { $set: { status } },
      { returnDocument: 'after' }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Admin Ticket Update Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
