import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import { auth } from '@/auth';

// GET /api/rider/orders - Get orders for the current rider or available orders
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || (session.user.role !== 'rider' && session.user.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query: any = {};
    
    if (status === 'available') {
      query.orderStatus = { $in: ['placed', 'confirmed', 'pending'] };
      query.riderId = session.user.id; // Corrected: Assigned to THIS rider but not yet active
    } else {
      query.riderId = session.user.id;
      if (status) query.orderStatus = status;
      else query.orderStatus = { $nin: ['pending', 'placed', 'confirmed', 'cancelled'] }; // Currently active or done
    }

    const orders = await Order.find(query).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Rider Orders Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/rider/orders - Bulk update (e.g., acceptance)
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const session = await auth();

    if (!session || (session.user.role !== 'rider' && session.user.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { orderId, action } = await request.json();

    if (action === 'accept') {
      const order = await Order.findOneAndUpdate(
        { _id: orderId, orderStatus: { $in: ['placed', 'confirmed', 'pending'] }, riderId: session.user.id },
        { 
          orderStatus: 'accepted'
        },
        { new: true }
      );

      if (!order) {
        return NextResponse.json({ success: false, error: 'Order not available' }, { status: 400 });
      }

      return NextResponse.json({ success: true, data: order });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Rider Patch Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
