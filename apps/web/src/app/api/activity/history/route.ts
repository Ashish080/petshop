import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Activity from '@/models/Activity';
import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'search';

    if (!session?.user?.email) {
      return NextResponse.json({ success: true, data: [] });
    }

    const activities = await Activity.find({
      userEmail: session.user.email,
      type: type
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

    // Unique non-empty search terms
    const uniqueTerms = [...new Set(activities.map(a => a.productName).filter(Boolean))];

    return NextResponse.json({ success: true, data: uniqueTerms });
  } catch (error) {
    console.error('History Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
