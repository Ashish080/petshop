import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { auth } from '@/auth';
import { RiderService } from '@/services/rider.service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await auth();
    const { id: orderId } = await params;

    if (!session || (session.user.role !== 'rider' && session.user.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }

    const { status, action } = body;
    const targetStatus = action === 'accept' ? 'accepted' : status;

    if (!targetStatus) {
      return NextResponse.json({ success: false, error: 'Status is required' }, { status: 400 });
    }

    const order = await RiderService.updateOrderStatus(session.user.id, orderId, targetStatus);

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error('[RIDER_STATUS_PATCH_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    }, { status: error.statusCode || 500 });
  }
}
