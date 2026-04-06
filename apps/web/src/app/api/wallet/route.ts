import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Wallet from '@/models/Wallet';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Upsert a default wallet if it doesn't exist
    let wallet = await Wallet.findOne({ userEmail: session.user.email });
    if (!wallet) {
      wallet = await Wallet.create({ userEmail: session.user.email, balance: 0, transactions: [] });
    }

    return NextResponse.json({ success: true, data: wallet });
  } catch (error) {
    console.error('Wallet Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
