import { NextRequest } from 'next/server';
import { auth } from '@/auth';
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

      // Send initial presence state from Redis cache
      redis.get(`rider:presence:${id}`).then(presence => {
        if (presence) {
           send({ type: 'init', ...JSON.parse(presence) });
        }
      }).catch(console.error);

      // Create a dedicated subscriber connection
      const subscriber = redis.duplicate();
      const channel = `rider:location:${id}`;

      subscriber.subscribe(channel).catch(err => {
        console.error('[SSE Rider Loc Redis Subscribe Error]', err);
      });

      subscriber.on('message', (_ch: string, message: string) => {
        if (isClosed) return;
        try {
          const event = JSON.parse(message);
          send({
            type: 'location_update',
            ...event
          });
        } catch (e) {
          console.error('[SSE rider loc parse error]', e);
        }
      });

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
