import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { auth } from '@/auth';
import { AdminService } from '@/services/admin.service';

// GET /api/admin/stats - Get dashboard statistics (Admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const stats = await AdminService.getStats();

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
