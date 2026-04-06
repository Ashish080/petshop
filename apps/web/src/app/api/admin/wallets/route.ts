import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Wallet from '@/models/Wallet';
import { auth } from '@/auth';
import { AdminService } from '@/services/admin.service';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // 1. Fetch all users and their wallets
    const users = await User.find({ role: 'user' }).select('name email avatar image').lean();
    const wallets = await Wallet.find({}).select('userEmail balance').lean();

    // 2. Pair them up
    interface LeanUser { name: string; email: string; avatar?: string; image?: string; _id: any; }
    interface LeanWallet { userEmail: string; balance: number; _id: any; }

    const data = (users as LeanUser[]).map(user => {
       const wallet = (wallets as LeanWallet[]).find(w => w.userEmail === user.email);
       return {
          ...user,
          balance: wallet?.balance || 0,
          walletId: wallet?._id?.toString()
       };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const wallet = await AdminService.adjustWallet(body, session.user.email || 'unknown');

    return NextResponse.json({ success: true, data: wallet });
  } catch (error: any) {
    console.error('[ADMIN_WALLET_POST_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal Server Error',
      code: error.code
    }, { status: error.statusCode || 500 });
  }
}
