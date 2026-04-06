import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Activity from '@/models/Activity';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const body = await request.json();

    await Activity.create({
      ...body,
      userEmail: session?.user?.email
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
