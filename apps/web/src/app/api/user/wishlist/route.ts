import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Wishlist from '@/models/Wishlist';
import Product from '@/models/Product';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const wishlistItems = await Wishlist.find({
      userEmail: session.user.email
    }).sort({ createdAt: -1 }).lean();

    const productIds = wishlistItems.map(item => item.productId);

    if (productIds.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const products = await Product.find({
      _id: { $in: productIds }
    } as any).lean();

    // Map back to maintain createdAt sort
    const sortedProducts = productIds
      .map(id => products.find(p => p._id.toString() === id))
      .filter(Boolean);

    return NextResponse.json({ success: true, data: sortedProducts });
  } catch (error) {
    console.error('Wishlist Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const { productId } = await request.json();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!productId) {
      return NextResponse.json({ success: false, error: 'Product ID required' }, { status: 400 });
    }

    // Toggle logic: If exists, remove it. If not, add it.
    const existing = await Wishlist.findOne({
      userEmail: session.user.email,
      productId: productId
    } as any);

    if (existing) {
      await Wishlist.deleteOne({ _id: existing._id });
      return NextResponse.json({ success: true, message: 'Removed from wishlist', action: 'removed' });
    } else {
      await Wishlist.create({
        userEmail: session.user.email,
        productId: productId
      });
      return NextResponse.json({ success: true, message: 'Added to wishlist', action: 'added' });
    }
  } catch (error) {
    console.error('Wishlist POST Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
