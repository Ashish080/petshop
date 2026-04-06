import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Order from '@/models/Order';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // 1. Fetch all riders
    const riders = await User.find({ role: 'rider' }).select('-password').lean();

    // 2. Fetch active order counts for each rider
    const ridersWithOrders = await Promise.all(riders.map(async (rider) => {
       const activeOrdersCount = await Order.countDocuments({ 
          'rider.id': rider._id.toString(),
          orderStatus: { $in: ['processing', 'shipped', 'out-for-delivery'] }
       });
       return { ...rider, activeOrdersCount };
    }));

    return NextResponse.json({ success: true, data: ridersWithOrders });
  } catch (error) {
    console.error('Fleet Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { id, status } = await request.json();

    const updatedRider = await User.findByIdAndUpdate(id, { $set: { status } }, { returnDocument: 'after' });

    return NextResponse.json({ success: true, data: updatedRider });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
