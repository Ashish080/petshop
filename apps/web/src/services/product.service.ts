import { ServiceError } from './base.service';
import Product from '../models/Product';
import redis from '../lib/redis';
import { cached, invalidate } from '../lib/cache';

export class ProductService {
  static async getProducts(options: { category?: string; search?: string; page?: number; limit?: number }) {
    const category = options.category || 'all';
    const search = options.search || 'none';
    const page = options.page || 1;
    const limit = options.limit || 24;

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

    const cacheKey = `catalog:${category}:${search.slice(0, 20)}:${page}:${limit}`;

    // cached from lib/cache uses redis!
    return cached(cacheKey, async () => {
      const [products, total] = await Promise.all([
        Product.find(query)
          .select('-buyPrice')
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(skip)
          .lean(),
        Product.countDocuments(query)
      ]);

      const formattedProducts = products.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
        id: p._id.toString(),
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        isLowStock: p.stock > 0 && p.stock <= p.lowStockThreshold
      }));

      return {
        products: formattedProducts,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      };
    }, { ttl: 300, prefix: 'products' });
  }

  static async createProduct(data: any) {
    if (!data.name || !data.price || !data.category) {
      throw new ServiceError('Name, price and category are required', 'VALIDATION_FAILED', 400);
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

    // Bust catalog cache
    await invalidate('products:*');
    
    // Fallback direct cleanup matching old logic (using invalidate to avoid KEYS)
    await invalidate('platform:products:*', '');

    return {
      ...product.toObject(),
      _id: product._id.toString(),
      id: product._id.toString(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      isLowStock: product.stock > 0 && product.stock <= product.lowStockThreshold
    };
  }

  static async checkAvailability(productId: string, quantity: number = 1) {
    const product = await Product.findById(productId).select('stock isActive').lean();
    if (!product) throw new ServiceError('Product decommissioned from fleet', 'NOT_FOUND', 404);
    if (!product.isActive) throw new ServiceError('Product currently offline', 'OFFLINE', 400);
    
    return {
      available: product.stock >= quantity,
      currentStock: product.stock,
      requested: quantity
    };
  }

  static async bulkCheckStock(items: { productId: string; quantity: number }[]) {
     const ids = items.map(i => i.productId);
     const products = await Product.find({ _id: { $in: ids } }).select('stock name').lean();
     
     const report: any[] = [];
     let allAvailable = true;

     for (const item of items) {
        const found = products.find(p => p._id.toString() === item.productId);
        const isAvail = found ? found.stock >= item.quantity : false;
        if (!isAvail) allAvailable = false;
        
        report.push({
           productId: item.productId,
           name: found?.name || 'Unknown Asset',
           available: isAvail,
           requested: item.quantity,
           currentStock: found?.stock || 0
        });
     }

     return { allAvailable, report };
  }
}
