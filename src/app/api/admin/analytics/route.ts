import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { auth } from '@/auth';

export async function GET() {
  try {
    await connectDB();
    const session = await auth();

    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Portfolio Insights
    const mostDemanded = await Product.find().sort({ demandCount: -1 }).limit(5).lean();
    const leastDemanded = await Product.find().sort({ demandCount: 1 }).limit(5).lean();
    
    // Bread Specific Analytics
    const breadDemand = await Product.find({ name: /bread/i }).sort({ demandCount: -1 }).lean();

    // Mission Stats
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRiders = await User.countDocuments({ role: 'rider' });
    
    const conversionRate = totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0;

    // Monthly Trends (Simple)
    const orders = await Order.find().select('total createdAt items').lean();
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        highlights: {
            totalRevenue,
            totalOrders,
            totalUsers,
            totalRiders,
            conversionRate: conversionRate.toFixed(2)
        },
        products: {
            mostDemanded,
            leastDemanded,
            breadDemand
        },
        trends: [] // Potential for Recharts
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
