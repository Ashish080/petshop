import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import { auth } from '@/lib/auth';

// GET /api/products - List products with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const query: Record<string, unknown> = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
      Product.countDocuments(query)
    ]);

    const formattedProducts = products.map(p => ({
      ...p,
      _id: p._id.toString(),
      id: p._id.toString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      isLowStock: p.stock > 0 && p.stock <= p.lowStockThreshold
    }));

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create product (Admin only)
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

    // Validation
    if (!data.name || !data.price || !data.category) {
      return NextResponse.json(
        { success: false, error: 'Name, price and category are required' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      ...data,
      description: data.description || '',
      images: data.images || [],
      stock: data.stock || 0,
      lowStockThreshold: data.lowStockThreshold || 10,
      rating: 0,
      reviewCount: 0,
      isActive: true,
      tags: data.tags || []
    });

    const formattedProduct = {
      ...product.toObject(),
      _id: product._id.toString(),
      id: product._id.toString(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      isLowStock: product.stock > 0 && product.stock <= product.lowStockThreshold
    };

    return NextResponse.json({
      success: true,
      data: formattedProduct
    }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
