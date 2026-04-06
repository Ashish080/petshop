import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import PushSubscription from '@/models/PushSubscription';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const subscription = await request.json();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Upsert subscription to avoid duplicates
    await PushSubscription.findOneAndUpdate(
      { userEmail: session.user.email, 'subscription.endpoint': subscription.endpoint },
      { $set: { subscription } },
      { upsert: true, returnDocument: 'after' }
    );

    return NextResponse.json({ success: true, message: 'Subscribed to notifications' });
  } catch (error) {
    console.error('Push Subscription Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
