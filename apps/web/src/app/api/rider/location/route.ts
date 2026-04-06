import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { RiderService } from '@/services/rider.service';
import { z } from 'zod';

const LocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'rider') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = LocationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid coordinates provided' },
        { status: 400 }
      );
    }

    const { lat, lng } = parsed.data;

    await RiderService.heartbeat(session.user.id as string, { lat, lng });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[RIDER_LOCATION_POST_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
