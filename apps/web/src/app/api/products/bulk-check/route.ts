import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { ProductService } from '@/services/product.service';

/**
 * POST /api/products/bulk-check
 * Verify stock for multiple items (public/user)
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ success: false, error: 'Items array required' }, { status: 400 });
    }

    const result = await ProductService.bulkCheckStock(items);
    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('[PRODUCT_BUL_CHECK_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}
