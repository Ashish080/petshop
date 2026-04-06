import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import redis from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const [session, { id }] = await Promise.all([auth(), params]);

  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  await connectDB();

  const order = await Order.findById(id).select('user riderId orderStatus').lean();
  if (!order) {
    return new Response('Order not found', { status: 404 });
  }

  const isOwner   = order.user?.email === session.user.email;
  const isAdmin   = session.user.role === 'admin';
  const isRider   = session.user.role === 'rider';
  if (!isOwner && !isAdmin && !isRider) {
    return new Response('Forbidden', { status: 403 });
  }

  const encoder = new TextEncoder();
  let isClosed = false;

  const TERMINAL_STATUSES = new Set(['delivered', 'cancelled']);

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: object) => {
        if (isClosed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          isClosed = true;
        }
      };

      send({
        type: 'init',
        orderStatus: order.orderStatus,
        riderId: order.riderId?.toString(),
        updatedAt: new Date().toISOString(),
      });

      if (TERMINAL_STATUSES.has(order.orderStatus)) {
        try { controller.close(); } catch { /* ignore */ }
        return;
      }

      // Create a dedicated subscriber connection using duplicate
      const subscriber = redis.duplicate();
      const channel = `order:${id}`;

      subscriber.subscribe(channel).catch(err => {
        console.error('[SSE Redis Subscribe Error]', err);
      });

      subscriber.on('message', (_ch: string, message: string) => {
        if (isClosed) return;
        try {
          const event = JSON.parse(message);
          send({
            type: 'update',
            orderStatus: event.orderStatus,
            riderId: event.riderId,
            updatedAt: event.updatedAt,
          });

          if (TERMINAL_STATUSES.has(event.orderStatus)) {
            setTimeout(() => {
              isClosed = true;
              subscriber.unsubscribe(channel);
              subscriber.disconnect();
              try { controller.close(); } catch { /* ignore */ }
            }, 500);
          }
        } catch (e) {
          console.error('[SSE parse error]', e);
        }
      });

      request.signal.addEventListener('abort', () => {
        isClosed = true;
        subscriber.unsubscribe(channel);
        subscriber.disconnect();
      });
    },

    cancel() {
      isClosed = true;
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection':    'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
