import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import { auth } from '@/auth';
import { OrderService } from '@/services/order.service';
import { ServiceError } from '@/services/base.service';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });

    const order = await OrderService.createOrder(body, session.user);

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    if (error instanceof ServiceError) {
      return NextResponse.json({ success: false, error: error.message, code: error.code }, { status: error.statusCode });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    
    const orders = await OrderService.getUserOrders(session.user.email);
    
    return NextResponse.json({ success: true, data: orders });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 });
  }
}
