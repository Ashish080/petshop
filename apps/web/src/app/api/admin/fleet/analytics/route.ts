import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // 1. Fetch all riders
    const riders = await User.find({ role: 'rider' }).select('name email avatar').lean();

    // 2. Aggregate stats for each rider
    const performanceData = await Promise.all(riders.map(async (rider) => {
       const stats = await Order.aggregate([
          { $match: { 'rider.id': rider._id.toString() } },
          { 
             $group: { 
                _id: null,
                totalDelivered: { $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] } },
                totalCancelled: { $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] } },
                avgValue: { $avg: '$total' }
             } 
          }
       ]);

       const res = stats[0] || { totalDelivered: 0, totalCancelled: 0, avgValue: 0 };
       
       return {
          id: rider._id,
          name: rider.name,
          email: rider.email,
          totalDelivered: res.totalDelivered,
          totalCancelled: res.totalCancelled,
          successRate: res.totalDelivered + res.totalCancelled > 0 
             ? Math.round((res.totalDelivered / (res.totalDelivered + res.totalCancelled)) * 100)
             : 100,
          avgEarnings: Math.round(res.totalDelivered * 40) // Simulated ₹40 per delivery commission
       };
    }));

    return NextResponse.json({ success: true, data: performanceData });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
