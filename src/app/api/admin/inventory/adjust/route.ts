import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Product from '@/models/Product';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { productId, delta } = await request.json();

    if (!productId || typeof delta !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const product = await Product.findByIdAndUpdate(
      productId, 
      { $inc: { stock: delta } }, 
      { new: true, runValidators: true }
    );

    if (!product) {
       return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Stock adjustment error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
