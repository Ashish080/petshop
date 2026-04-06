import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { auth } from '@/auth';
import { RiderService } from '@/services/rider.service';

/**
 * POST /api/rider/kyc
 * Submit KYC details for verification
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || (session.user.role !== 'rider' && session.user.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const user = await RiderService.submitKYC(session.user.id, body);

    return NextResponse.json({ 
       success: true, 
       message: 'KYC details submitted successfully and pending review.',
       data: { kycStatus: user.kycStatus } 
    });
  } catch (error: any) {
    console.error('[RIDER_KYC_POST_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    }, { status: error.statusCode || 500 });
  }
}
