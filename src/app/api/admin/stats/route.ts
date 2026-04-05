import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';
import { auth } from '@/lib/auth';

// GET /api/admin/stats - Get dashboard statistics (Admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Get all stats in parallel
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      lowStockCountResult,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'user' }),
      // Calculate low stock products using aggregation
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $match: {
            $expr: {
              $and: [
                { $gt: ['$stock', 0] },
                { $lte: ['$stock', '$lowStockThreshold'] }
              ]
            }
          }
        },
        { $count: 'count' }
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    const lowStockCount = lowStockCountResult[0]?.count || 0;

    // Format recent orders
    const formattedRecentOrders = (recentOrders as any[]).map((o) => {
      const u = o.user as { email?: string; name?: string; phone?: string } | undefined;
      return {
        ...o,
        _id: o._id.toString(),
        id: o._id.toString(),
        user: u && typeof u === 'object' ? u : { email: String(o.user) },
        totalPrice: o.total,
        items: o.items.map((item: any) => ({
          ...item,
          product: (item as { productId?: string }).productId,
        })),
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
      };
    });

    const revenue = totalRevenue[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: revenue,
        totalProducts,
        totalCustomers,
        lowStockProducts: lowStockCount,
        recentOrders: formattedRecentOrders
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
