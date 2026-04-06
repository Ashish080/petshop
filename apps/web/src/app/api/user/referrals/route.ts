import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Wallet from '@/models/Wallet';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email.toLowerCase() }).select('referralCode referredBy');
    const wallet = await Wallet.findOne({ userEmail: session.user.email.toLowerCase() });

    return NextResponse.json({ 
      success: true, 
      data: {
        referralCode: user?.referralCode,
        referredBy: user?.referredBy,
        walletBalance: wallet?.balance || 0,
        transactions: wallet?.transactions || []
      } 
    });
  } catch (error) {
    console.error('Referral Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
