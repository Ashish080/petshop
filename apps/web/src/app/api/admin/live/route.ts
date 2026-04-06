import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import redis from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    return new Response('Unauthorized', { status: 401 });
  }

  const encoder = new TextEncoder();
  let isClosed = false;

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

      // Create a dedicated subscriber connection
      const subscriber = redis.duplicate();
      const channel = 'admin:live-feed';

      subscriber.subscribe(channel).catch(err => {
        console.error('[Admin SSE Redis Subscribe Error]', err);
      });

      subscriber.on('message', (_ch: string, message: string) => {
        if (isClosed) return;
        try {
          const event = JSON.parse(message);
          send(event);
        } catch (e) {
          console.error('[Admin SSE parse error]', e);
        }
      });

      // Heatbeat to keep connection alive
      const heartbeatTimer = setInterval(() => {
        if (isClosed) {
          clearInterval(heartbeatTimer);
          return;
        }
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch {
          isClosed = true;
          clearInterval(heartbeatTimer);
          subscriber.unsubscribe(channel);
          subscriber.disconnect();
        }
      }, 25_000);

      request.signal.addEventListener('abort', () => {
        isClosed = true;
        clearInterval(heartbeatTimer);
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
