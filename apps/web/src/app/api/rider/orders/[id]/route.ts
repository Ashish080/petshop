import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import { auth } from '@/auth';
import { emitOrderStatusChange } from '@/lib/orderEvents';

const ORDER_SEQUENCE: Record<string, number> = {
  pending: 0, placed: 1, confirmed: 2, accepted: 3,
  picked: 4, 'out-for-delivery': 5, delivered: 6, cancelled: 99,
};

// PATCH /api/rider/orders/[id] — Atomic status transition + instant event push
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await auth();
    const { id } = await params;

    if (!session || (session.user.role !== 'rider' && session.user.role !== 'admin')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }

    const { status, action } = body;
    const targetStatus = action === 'accept' ? 'accepted' : status;

    if (!targetStatus || !(targetStatus in ORDER_SEQUENCE)) {
      return NextResponse.json({ success: false, error: `Invalid status: ${targetStatus}` }, { status: 400 });
    }

    const targetIdx = ORDER_SEQUENCE[targetStatus];

    // Build atomic guard — only allow forward transitions
    const guardConditions: Record<string, any> = {
      _id: id,
      orderStatus: {
        $in: Object.keys(ORDER_SEQUENCE).filter(
          s => ORDER_SEQUENCE[s] < targetIdx && s !== 'cancelled'
        ),
      },
    };

    // Riders can only update their own assigned orders
    if (session.user.role === 'rider') {
      guardConditions.riderId = session.user.id;
    }

    // ✅ Atomic: no race condition possible — single DB round-trip
    const order = await Order.findOneAndUpdate(
      guardConditions,
      { $set: { orderStatus: targetStatus } },
      { returnDocument: 'after', lean: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Transition not allowed or order not assigned to you' },
        { status: 409 }
      );
    }

    // ✅ INSTANT EVENT PUSH — fires AFTER DB is committed
    // This notifies all SSE connections watching this order in < 5ms
    // No polling needed on the SSE side
    emitOrderStatusChange({
      orderId: id,
      orderStatus: targetStatus,
      riderId: order.riderId?.toString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('[RIDER_STATUS_PATCH_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
