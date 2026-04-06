import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { auth } from '@/auth';
import User from '@/models/User';
import { AdminService } from '@/services/admin.service';

/**
 * GET /api/admin/kyc
 * Fetch riders list for KYC verification (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const query: any = { role: 'rider' };
    if (status !== 'all') {
      query.kycStatus = status;
    }

    const [riders, total] = await Promise.all([
      User.find(query)
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-password')
        .lean(),
      User.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: {
        riders: riders.map((r: any) => ({ ...r, _id: r._id.toString(), id: r._id.toString() })),
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
          limit
        }
      }
    });
  } catch (error) {
    console.error('[ADMIN_KYC_GET_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/kyc
 * Verify or reject a rider KYC (Admin only)
 */
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { riderId, status, reason } = body;

    if (!riderId || !status) {
       return NextResponse.json({ success: false, error: 'Rider ID and Status are required' }, { status: 400 });
    }

    const user = await AdminService.verifyRiderKYC(
       session.user.id, 
       session.user.email || 'unknown', 
       riderId, 
       status, 
       reason
    );

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error('[ADMIN_KYC_PATCH_ERROR]', error);
    return NextResponse.json({ 
       success: false, 
       error: error.message || 'Internal Server Error' 
    }, { status: error.statusCode || 500 });
  }
}
