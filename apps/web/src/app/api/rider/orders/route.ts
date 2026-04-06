import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { auth } from '@/auth';
import { RiderService } from '@/services/rider.service';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || (session.user.role !== 'rider' && session.user.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const orders = await RiderService.getOrders(session.user.id, status);
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Rider Orders Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || (session.user.role !== 'rider' && session.user.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { orderId, action } = await request.json();

    if (action === 'accept') {
      const order = await RiderService.updateOrderStatus(session.user.id, orderId, 'accepted');
      return NextResponse.json({ success: true, data: order });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Rider Patch Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    }, { status: error.statusCode || 500 });
  }
}
