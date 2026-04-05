import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Activity from '@/models/Activity';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [orderAnalytics, leadAnalytics, productSales, totalProducts] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, totalOrders: { $sum: 1 }, totalRevenue: { $sum: '$total' } } }
      ]),
      Activity.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, type: { $in: ['add-to-cart', 'checkout-start'] } } },
        { $group: { _id: null, totalLeads: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $unwind: '$items' },
        { $group: { _id: '$items.productId', name: { $first: '$items.name' }, unitsSold: { $sum: '$items.quantity' } } },
        { $sort: { unitsSold: -1 } }
      ]),
      Product.countDocuments({ isActive: true })
    ]);

    const stats = orderAnalytics[0] || { totalOrders: 0, totalRevenue: 0 };
    const leads = leadAnalytics[0] || { totalLeads: 0 };
    const highDemanted = productSales.slice(0, 5); 
    const lowDemanded = [...productSales].reverse().slice(0, 5);
    const conversionRate = leads.totalLeads > 0 
      ? ((stats.totalOrders / leads.totalLeads) * 100).toFixed(1) 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalOrders: stats.totalOrders,
          totalRevenue: stats.totalRevenue,
          totalLeads: leads.totalLeads,
          conversionRate: Number(conversionRate),
          catalogSize: totalProducts
        },
        demand: {
          topProducts: highDemanted,
          bottomProducts: lowDemanded
        }
      }
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
