import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Activity from '@/models/Activity';
import Product from '@/models/Product';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Fetch last 10 unique product views for this user
    const recentActivities = await Activity.find({
      userEmail: session.user.email,
      type: 'view',
      productId: { $exists: true }
    })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();

    const uniqueProductIds = [...new Set(recentActivities.map(a => a.productId).filter(Boolean))].slice(0, 8);

    if (uniqueProductIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const products = await Product.find({
      _id: { $in: uniqueProductIds },
      isActive: true
    } as any).lean();

    // Re-sort to match the order of uniqueProductIds (recency)
    const sortedProducts = uniqueProductIds
      .map(id => products.find(p => p._id.toString() === id))
      .filter(Boolean);

    return NextResponse.json({ 
      success: true, 
      data: sortedProducts.map(p => ({
        ...p,
        _id: p?._id.toString(),
        id: p?._id.toString(),
      }))
    });
  } catch (error) {
    console.error('Recently Viewed Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
