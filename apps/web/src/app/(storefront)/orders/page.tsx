import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongoose';
import Order from '@/models/Order';
import User from '@/models/User';
import UserOrdersDashboard from './OrdersClient';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/auth/login?callbackUrl=/orders');

  await connectDB();

  const orders = await Order.find({ 'user.email': session.user.email.toLowerCase() })
    .sort({ createdAt: -1 })
    .lean();

  // Collect all unique riderIds to batch-fetch rider info
  const riderIds = [...new Set(
    orders.map(o => o.riderId?.toString()).filter(Boolean)
  )];
  const ridersRaw = riderIds.length > 0
    ? await User.find({ _id: { $in: riderIds }, role: 'rider' }).select('name phone email').lean()
    : [];
  const riderMap: Record<string, { name: string; phone?: string; email: string }> = {};
  ridersRaw.forEach(r => {
    riderMap[r._id.toString()] = { name: r.name, phone: r.phone, email: r.email };
  });

  // Serialize for client
  const serialized = orders.map(o => {
    const rid = o.riderId?.toString() ?? null;
    return {
      _id: o._id.toString(),
      orderNumber: o.orderNumber,
      orderStatus: o.orderStatus,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      subtotal: o.subtotal,
      shipping: o.shipping,
      tax: o.tax,
      total: o.total,
      riderId: rid,
      rider: rid ? riderMap[rid] ?? null : null,
      feedback: o.feedback ?? null,
      notes: o.notes ?? null,
      user: {
        email: o.user?.email,
        name: o.user?.name,
        phone: o.user?.phone,
      },
      shippingAddress: o.shippingAddress,
      items: o.items.map((i: any) => ({
        productId: i.productId?.toString(),
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image ?? '',
      })),
      createdAt: new Date(o.createdAt).toISOString(),
      updatedAt: new Date(o.updatedAt).toISOString(),
    };
  });

  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        <UserOrdersDashboard
          initialOrders={serialized}
          userName={session.user.name ?? ''}
        />
      </div>
    </div>
  );
}
