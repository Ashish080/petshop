import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import Wallet from '@/models/Wallet';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // 1. Fetch all users and their wallets
    const users = await User.find({ role: 'user' }).select('name email avatar').lean();
    const wallets = await Wallet.find({}).lean();

    // 2. Pair them up
    const data = users.map(user => {
       const wallet = wallets.find(w => w.userEmail === user.email);
       return {
          ...user,
          balance: wallet?.balance || 0,
          walletId: wallet?._id
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

    const { email, amount, type, reason } = await request.json();

    const wallet = await Wallet.findOneAndUpdate(
       { userEmail: email },
       { 
          $inc: { balance: amount },
          $push: { 
             transactions: { 
                type: amount > 0 ? 'credit' : 'debit', 
                amount: Math.abs(amount), 
                description: `Admin Support Adjustment: ${reason || 'Customer satisfaction reward'}`,
                createdAt: new Date()
             } 
          }
       },
       { upsert: true, returnDocument: 'after' }
    );

    return NextResponse.json({ success: true, data: wallet });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
