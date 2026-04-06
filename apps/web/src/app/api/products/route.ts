import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { auth } from '@/auth';
import { ProductService } from '@/services/product.service';
import { ServiceError } from '@/services/base.service';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || 'none';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');

    const result = await ProductService.getProducts({ category, search, page, limit });

    // Assuming if the returned total differs from what we could do it is cache result
    const responsePayload = {
      success: true,
      data: result.products,
      pagination: { 
        page: result.page, 
        limit: result.limit, 
        total: result.total, 
        pages: result.pages 
      },
      metrics: {
         source: "service-layer",
         docCount: result.products.length
      }
    };

    const res = NextResponse.json(responsePayload);
    // X-Cache header can't easily be determined when abstracted behind cached() but we can leave generic
    return res;
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const product = await ProductService.createProduct(data);

    return NextResponse.json({
      success: true,
      data: product
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error instanceof ServiceError) {
      return NextResponse.json({ success: false, error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
