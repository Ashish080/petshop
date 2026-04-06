import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Subscription from '@/models/Subscription';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const subscriptions = await Subscription.find({
      userEmail: session.user.email,
      status: { $ne: 'cancelled' }
    }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: subscriptions });
  } catch (error) {
    console.error('Subscription Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const body = await request.json();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, productName, productImage, price, frequency } = body;

    const nextBilling = new Date();
    if (frequency === 'weekly') nextBilling.setDate(nextBilling.getDate() + 7);
    else if (frequency === 'bi-weekly') nextBilling.setDate(nextBilling.getDate() + 14);
    else nextBilling.setMonth(nextBilling.getMonth() + 1);

    const subscription = await Subscription.create({
      userEmail: session.user.email,
      productId,
      productName,
      productImage,
      priceAtSubscription: price,
      frequency,
      nextBillingDate: nextBilling,
      status: 'active'
    });

    return NextResponse.json({ success: true, data: subscription });
  } catch (error) {
    console.error('Subscription POST Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const { id, status } = await request.json();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const updated = await Subscription.findOneAndUpdate(
      { _id: id, userEmail: session.user.email },
      { $set: { status } },
      { returnDocument: 'after' }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Subscription PATCH Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
