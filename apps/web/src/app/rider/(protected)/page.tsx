import Link from 'next/link';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import {
  Truck, CheckCircle, Clock, MapPin, ChevronRight,
  Package, Zap, AlertCircle, TrendingUp
} from 'lucide-react';

const STATUS_META: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending:           { label: 'Pending',        bg: 'bg-slate-100',    text: 'text-slate-600', dot: 'bg-slate-400' },
  placed:            { label: 'Assigned',        bg: 'bg-amber-100',   text: 'text-amber-700', dot: 'bg-amber-500' },
  confirmed:         { label: 'Assigned',        bg: 'bg-amber-100',   text: 'text-amber-700', dot: 'bg-amber-500' },
  accepted:          { label: 'Accepted',        bg: 'bg-indigo-100',  text: 'text-indigo-700', dot: 'bg-indigo-500' },
  picked:            { label: 'Picked Up',       bg: 'bg-orange-100',  text: 'text-orange-700', dot: 'bg-orange-500' },
  'out-for-delivery':{ label: 'En Route',        bg: 'bg-sky-100',     text: 'text-sky-700',   dot: 'bg-sky-500' },
  delivered:         { label: 'Delivered',       bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  cancelled:         { label: 'Cancelled',       bg: 'bg-rose-100',    text: 'text-rose-700',  dot: 'bg-rose-400' },
};

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

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] || STATUS_META.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${meta.bg} ${meta.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function OrderCard({ order, variant }: { order: any; variant: 'assigned' | 'active' }) {
  const isAssigned = variant === 'assigned';
  return (
    <Link href={`/rider/orders/${order._id}`} className="block group">
      <div className={`bg-white rounded-3xl border-2 transition-all duration-200 group-active:scale-[0.98] overflow-hidden ${
        isAssigned
          ? 'border-amber-200 hover:border-amber-400 shadow-lg shadow-amber-500/5'
          : 'border-slate-100 hover:border-indigo-300 shadow-lg shadow-slate-200/30'
      }`}>
        {isAssigned && (
          <div className="bg-amber-500 px-4 py-2 flex items-center gap-2">
            <Zap size={12} className="text-white" strokeWidth={3} />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Action Required — Tap to Accept</span>
          </div>
        )}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                #{order.orderNumber?.slice(-8) || order._id?.slice(-8)}
              </p>
              <h3 className="font-black text-slate-900 text-base leading-tight">
                {order.user?.name || order.user?.email?.split('@')[0] || 'Customer'}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-lg font-black text-slate-900">₹{order.total}</span>
              <StatusBadge status={order.orderStatus} />
            </div>
          </div>

          {/* Items */}
          <div className="flex items-center gap-2 mb-3">
            <Package size={13} className="text-slate-400 shrink-0" />
            <p className="text-xs font-bold text-slate-500 truncate">
              {order.items?.[0]?.name}{order.items?.length > 1 ? ` +${order.items.length - 1} more` : ''}
            </p>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2">
            <MapPin size={13} className="text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-slate-500 truncate">
              {order.shippingAddress?.street}, {order.shippingAddress?.city}
            </p>
          </div>
        </div>

        <div className={`px-5 py-3 flex items-center justify-between border-t ${
          isAssigned ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'
        }`}>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {isAssigned ? 'Accept to start delivery' : 'Tap to update status'}
          </span>
          <ChevronRight size={16} className={`${isAssigned ? 'text-amber-500' : 'text-slate-400'} group-hover:translate-x-1 transition-transform`} />
        </div>
      </div>
    </Link>
  );
}

export default async function RiderDashboard() {
  const session = await auth();
  const [allOrders, availableOrders] = await Promise.all([
    getRiderOrders(session!.user.id!),
    getAvailableOrders(),
  ]);

  const toAccept = availableOrders; // assigned but not yet accepted
  const activeOrders = allOrders.filter((o: any) =>
    ['accepted', 'picked', 'out-for-delivery'].includes(o.orderStatus)
  );
  const completedToday = allOrders.filter((o: any) => {
    if (o.orderStatus !== 'delivered') return false;
    const updated = new Date(o.updatedAt);
    const today = new Date();
    return updated.toDateString() === today.toDateString();
  });

  const todayEarnings = completedToday.reduce((sum: number, o: any) => sum + (o.total || 0) * 0.05, 0); // 5% commission

  return (
    <div className="space-y-8 py-2">

      {/* Greeting */}
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
        </p>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Hey, {session?.user?.name?.split(' ')[0] || 'Rider'} 👋
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-indigo-600 rounded-2xl p-4 text-white text-center shadow-xl shadow-indigo-500/20">
          <p className="text-2xl font-black">{toAccept.length}</p>
          <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest mt-1">To Accept</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center border border-slate-100 shadow-lg shadow-slate-200/20">
          <p className="text-2xl font-black text-slate-900">{activeOrders.length}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">In Progress</p>
        </div>
        <div className="bg-white rounded-2xl p-4 text-center border border-slate-100 shadow-lg shadow-slate-200/20">
          <p className="text-2xl font-black text-emerald-600">{completedToday.length}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Done Today</p>
        </div>
      </div>

      {/* Earnings Banner */}
      {completedToday.length > 0 && (
        <div className="bg-emerald-600 rounded-2xl p-5 flex items-center justify-between text-white shadow-xl shadow-emerald-500/20">
          <div className="flex items-center gap-3">
            <TrendingUp size={22} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Today's Earnings</p>
              <p className="text-2xl font-black">₹{todayEarnings.toFixed(0)}</p>
            </div>
          </div>
          <p className="text-[9px] text-emerald-200 font-bold uppercase tracking-widest">{completedToday.length} deliveries</p>
        </div>
      )}

      {/* Orders to Accept */}
      {toAccept.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">Awaiting Acceptance</h2>
            <span className="ml-auto bg-amber-100 text-amber-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
              {toAccept.length} New
            </span>
          </div>
          <div className="space-y-3">
            {toAccept.map((order: any) => (
              <OrderCard key={order._id} order={order} variant="assigned" />
            ))}
          </div>
        </section>
      )}

      {/* Active Orders */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Truck size={16} className="text-indigo-600" />
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">Your Pipeline</h2>
          <span className="ml-auto text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {activeOrders.length} Active
          </span>
        </div>

        {activeOrders.length > 0 ? (
          <div className="space-y-3">
            {activeOrders.map((order: any) => (
              <OrderCard key={order._id} order={order} variant="active" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Clock size={28} className="text-slate-300" />
            </div>
            <h3 className="font-black text-slate-900 mb-1">All Clear</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No active deliveries right now.</p>
          </div>
        )}
      </section>

      {/* Completed Today */}
      {completedToday.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-emerald-600" />
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">Completed Today</h2>
          </div>
          <div className="space-y-3">
            {completedToday.map((order: any) => (
              <div key={order._id} className="bg-white rounded-2xl border border-emerald-100 p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    #{order.orderNumber?.slice(-8)}
                  </p>
                  <p className="font-black text-slate-900 text-sm">{order.user?.name || 'Customer'}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={order.orderStatus} />
                  <p className="font-black text-slate-900 text-sm mt-1">₹{order.total}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
