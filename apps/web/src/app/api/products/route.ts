import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import { auth } from '@/auth';
import redis from '@/lib/redis';

// GET /api/products - List products with High-Speed Redis Caching
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || 'none';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24'); // Match default limit

    // 1. Attempt to fetch from Redis Ram Cache first
    const cacheKey = `platform:products:${category}:${search.slice(0,20)}:${page}:${limit}`;
    try {
       const cachedResponse = await redis.get(cacheKey);
       if (cachedResponse) {
          // Add a custom header to prove it hit the cache
          const res = NextResponse.json(JSON.parse(cachedResponse));
          res.headers.set('X-Cache', 'HIT');
          return res;
       }
    } catch (e) {
       console.warn('[REDIS_WARNING] Cache fetch failed, falling back to DB');
    }

    // 2. Cache Miss - Hit MongoDB
    await connectDB();
    
    const query: Record<string, unknown> = { isActive: true };

    if (category !== 'all') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search !== 'none') {
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

    const responsePayload = {
      success: true,
      data: formattedProducts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      metrics: {
         source: "mongodb",
         docCount: products.length
      }
    };

    // 3. Save to Redis Cache in background (don't await if you don't have to)
    try {
       await redis.set(cacheKey, JSON.stringify(responsePayload), 'EX', 3600); // 1 hr cache
    } catch (e) {
       console.warn('[REDIS_WARNING] Failed to write cache');
    }

    const res = NextResponse.json(responsePayload);
    res.headers.set('X-Cache', 'MISS');
    return res;
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create product and Invalidate Cache
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

    if (!data.name || !data.price || !data.category) {
      return NextResponse.json(
        { success: false, error: 'Name, price and category are required' },
        { status: 400 }
      );
    }

    const product = await Product.create({
      ...data,
      description: data.description?.trim() || 'No description provided.',
      images: data.images || [],
      stock: data.stock || 0,
      lowStockThreshold: data.lowStockThreshold || 10,
      rating: 0,
      reviewCount: 0,
      isActive: true,
      tags: data.tags || []
    });

    // INVALIDATE CACHE 
    // Whenever a new product is added, we must flush the catalog memory
    try {
       const keys = await redis.keys('platform:products:*');
       if (keys.length > 0) {
          await redis.del(...keys);
          console.log(`[REDIS] Invalidated ${keys.length} product cache keys!`);
       }
    } catch (e) {
       console.warn('[REDIS_WARNING] Failed to invalidate cache on POST');
    }

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
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
