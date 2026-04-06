import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { auth } from '@/auth';
import { AdminService } from '@/services/admin.service';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const result = await AdminService.adjustStock(body, session.user.email || 'unknown');

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Stock adjustment error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal Server Error',
      code: error.code
    }, { status: error.statusCode || 500 });
  }
}
