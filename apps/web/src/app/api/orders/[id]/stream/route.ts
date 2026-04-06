import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import { subscribeToOrder, type OrderStatusEvent } from '@/lib/orderEvents';

/**
 * GET /api/orders/[id]/stream
 * ─────────────────────────────────────────────────────────────
 * Event-driven SSE — NO DB POLLING.
 *
 * HOW IT WORKS:
 *   1. Client connects → auth check → send current order state once
 *   2. Subscribe to orderEventBus for this orderId
 *   3. When Rider updates status → emitOrderStatusChange() fires
 *   4. Handler runs in < 5ms → SSE frame pushed to client
 *   5. Heartbeat every 25s to keep connection alive through proxies
 *   6. Auto-close on terminal state (delivered/cancelled)
 *   7. Auto-cleanup on client disconnect (cancel() called by ReadableStream)
 *
 * DB QUERIES (compared to old approach):
 *   OLD: 1 query per user per 4s = constant load
 *   NEW: 1 query on connect + 0 queries after = near-zero load
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const [session, { id }] = await Promise.all([auth(), params]);

  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 });
  }

  await connectDB();

  // Initial auth + ownership check (one DB query total)
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
  let heartbeatTimer: ReturnType<typeof setInterval>;
  let unsubscribe: (() => void) | null = null;
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

      const closeStream = () => {
        if (isClosed) return;
        isClosed = true;
        clearInterval(heartbeatTimer);
        unsubscribe?.();
        try { controller.close(); } catch { /* already closed */ }
      };

      // ── 1. Send current state immediately on connect ──────────────────────
      send({
        type: 'init',
        orderStatus: order.orderStatus,
        riderId: order.riderId?.toString(),
        updatedAt: new Date().toISOString(),
      });

      // If already terminal, close right away — no need to subscribe
      if (TERMINAL_STATUSES.has(order.orderStatus)) {
        closeStream();
        return;
      }

      // ── 2. Subscribe to event bus (zero-polling push) ─────────────────────
      unsubscribe = subscribeToOrder(id, (event: OrderStatusEvent) => {
        send({
          type: 'update',
          orderStatus: event.orderStatus,
          riderId: event.riderId,
          updatedAt: event.updatedAt,
        });

        if (TERMINAL_STATUSES.has(event.orderStatus)) {
          // Brief delay so the client receives the final status before close
          setTimeout(closeStream, 500);
        }
      });

      // ── 3. Heartbeat — keeps connection alive through nginx/CDN/proxies ───
      // Sends a comment line (SSE spec) — browser ignores it, proxy keeps socket open
      heartbeatTimer = setInterval(() => {
        if (isClosed) {
          clearInterval(heartbeatTimer);
          return;
        }
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch {
          isClosed = true;
          clearInterval(heartbeatTimer);
          unsubscribe?.();
        }
      }, 25_000); // 25s is under the typical 30s proxy timeout
    },

    cancel() {
      // Client disconnected (tab closed, navigation away, etc.)
      isClosed = true;
      clearInterval(heartbeatTimer);
      unsubscribe?.();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection':    'keep-alive',
      'X-Accel-Buffering': 'no',         // Nginx: disable proxy buffering
    },
  });
}
