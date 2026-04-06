import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import { auth } from '@/auth';

export async function GET() {
  try {
    await connectDB();
    const session = await auth();

    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Return users (excluding admins but including users/riders for overview, or just roles 'user')
    // Let's return just 'user' role for this specific view
    const users = await User.find({ role: 'user' }).select('name email phone role _id').lean();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
