import { auth } from '@/auth';
import { cookies } from 'next/headers';
import RiderDashboardClient from './RiderDashboardClient';

async function getRiderOrders(riderId: string) {
  const cookieStore = await cookies();
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/rider/orders`, {
      cache: 'no-store',
      headers: { Cookie: cookieStore.toString() }
    });
    if (!res.ok) return [];
    const result = await res.json();
    return result.data || [];
  } catch {
    return [];
  }
}

async function getAvailableOrders() {
  const cookieStore = await cookies();
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/rider/orders?status=available`, {
      cache: 'no-store',
      headers: { Cookie: cookieStore.toString() }
    });
    if (!res.ok) return [];
    const result = await res.json();
    return result.data || [];
  } catch {
    return [];
  }
}

export default async function RiderDashboard() {
  const session = await auth();
  const [allOrders, availableOrders] = await Promise.all([
    getRiderOrders(session!.user.id!),
    getAvailableOrders(),
  ]);

  return <RiderDashboardClient user={session!.user} allOrders={allOrders} availableOrders={availableOrders} />;
}
