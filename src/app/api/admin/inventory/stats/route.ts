import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const [totalSKUs, lowStockItems, totalValue, petsAvailable] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ 
        isActive: true, 
        $expr: { $lte: ['$stock', '$lowStockThreshold'] },
        stock: { $gt: 0 }
      }),
      Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, totalValue: { $sum: { $multiply: ['$stock', '$buyPrice'] } } } }
      ]),
      Product.countDocuments({ isActive: true, category: 'Pets', stock: { $gt: 0 } })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalSKUs,
        lowStockItems,
        totalValue: totalValue[0]?.totalValue || 0,
        petsAvailable
      }
    });
  } catch (error) {
    console.error('Inventory Stats Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
