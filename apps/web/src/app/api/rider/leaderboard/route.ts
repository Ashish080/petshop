import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.id) {
       return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Set timeframe (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 2. Aggregate aggregated performance
    const performance = await Order.aggregate([
      { 
        $match: { 
          orderStatus: 'delivered',
          updatedAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: '$rider.id',
          count: { $sum: 1 },
          avgValue: { $avg: '$total' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // 3. Resolve Rider Details
    const riders = await Promise.all(performance.map(async (p, index) => {
       const user = await User.findById(p._id).select('name avatar email').lean();
       return {
          rank: index + 1,
          name: user?.name || 'Anonymous Rider',
          avatar: user?.avatar,
          deliveries: p.count,
          points: p.count * 10 + Math.floor(p.avgValue / 100), // Scoring algorithm
          isCurrentUser: p._id === session.user.id
       };
    }));

    return NextResponse.json({ success: true, data: riders });
  } catch (error) {
    console.error('Leaderboard API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}
