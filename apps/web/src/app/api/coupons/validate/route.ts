import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Coupon from '@/models/Coupon';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const { code, cartTotal } = await request.json();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      isActive: true,
      expiryDate: { $gt: new Date() }
    });

    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Invalid or expired coupon code' }, { status: 400 });
    }

    if (coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ success: false, error: 'This coupon has reached its usage limit' }, { status: 400 });
    }

    if (cartTotal < (coupon.minOrderValue || 0)) {
       return NextResponse.json({ 
          success: false, 
          error: `Order subtotal must be at least ₹${coupon.minOrderValue} for this coupon.` 
       }, { status: 400 });
    }

    // Success! Return the discount data.
    return NextResponse.json({ 
      success: true, 
      data: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount: coupon.discountAmount
      }
    });

  } catch (error) {
    console.error('Coupon Validation Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
