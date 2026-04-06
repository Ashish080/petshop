import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Order from '@/models/Order';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email }).lean();
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Refresh lifetime spend calculation
    const orders = await Order.find({ 
      'user.email': session.user.email,
      orderStatus: { $nin: ['cancelled', 'pending'] }
    }).select('total').lean();

    const lifetimeSpend = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    let tier: 'silver' | 'gold' | 'platinum' = 'silver';
    if (lifetimeSpend > 50000) tier = 'platinum';
    else if (lifetimeSpend > 10000) tier = 'gold';

    // Update if changed
    if (user.lifetimeSpend !== lifetimeSpend || user.membershipTier !== tier) {
      await User.updateOne(
        { _id: user._id },
        { $set: { lifetimeSpend, membershipTier: tier } }
      );
    }

    const perks = {
      silver: { discount: 0, label: 'Silver Pet Parent', next: 'Gold', target: 10000 },
      gold: { discount: 5, label: 'Gold Pet Parent', next: 'Platinum', target: 50000 },
      platinum: { discount: 10, label: 'Platinum Elite Parent', next: 'Maximum Tier', target: 0 },
    };

    return NextResponse.json({ 
      success: true, 
      data: {
        tier,
        lifetimeSpend,
        perks: perks[tier],
        progress: tier === 'platinum' ? 100 : (lifetimeSpend / perks[tier].target) * 100
      } 
    });
  } catch (error) {
    console.error('Membership Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
