'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Clock3,
  ExternalLink,
  MapPin,
  Package,
  RefreshCcw,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { motionPresets } from '@/lib/motion';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import toast from 'react-hot-toast';
import { LeaderboardView } from '@/components/rider/LeaderboardView';

type RiderTab = 'current' | 'nearby' | 'leaderboard';

type RiderOrder = {
  _id: string;
  orderNumber?: string;
  orderStatus: string;
  total?: number;
  updatedAt: string;
  shippingAddress?: {
    street?: string;
    city?: string;
  };
};

type RiderDashboardProps = {
  allOrders: RiderOrder[];
  availableOrders: RiderOrder[];
};

const activeStatuses = ['accepted', 'picked', 'out-for-delivery'];

const statusMeta: Record<
  string,
  { label: string; badge: 'warning' | 'info' | 'success' | 'brand' }
> = {
  accepted: { label: 'Accepted', badge: 'info' },
  picked: { label: 'Picked', badge: 'warning' },
  'out-for-delivery': { label: 'On route', badge: 'brand' },
};

function getNextStatus(status: string) {
  if (status === 'accepted') return 'picked';
  if (status === 'picked') return 'out-for-delivery';
  if (status === 'out-for-delivery') return 'delivered';
  return null;
}

function getActionLabel(status: string) {
  if (status === 'accepted') return 'Mark picked up';
  if (status === 'picked') return 'Start route';
  if (status === 'out-for-delivery') return 'Confirm delivery';
  return 'Update status';
}

function formatCurrency(value: number) {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

export default function RiderDashboardClient({
  allOrders,
  availableOrders,
}: RiderDashboardProps) {
  const [activeTab, setActiveTab] = useState<RiderTab>('current');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [assignedOrders, setAssignedOrders] = useState<RiderOrder[]>(allOrders);
  const [nearbyOrders, setNearbyOrders] = useState<RiderOrder[]>(availableOrders);
  const { isOnline, isSyncing, pendingCount, syncRequest } = useOfflineSync();

  const currentOrders = assignedOrders.filter((order) =>
    activeStatuses.includes(order.orderStatus)
  );
  const primaryOrder = currentOrders[0] ?? null;
  const queuedOrders = currentOrders.slice(1);

  const completedToday = assignedOrders.filter((order) => {
    if (order.orderStatus !== 'delivered') return false;
    return (
      new Date(order.updatedAt).toDateString() === new Date().toDateString()
    );
  });

  const todayEarnings = completedToday.reduce(
    (sum: number, order) => sum + (order.total || 0) * 0.05,
    0
  );

  const updateOrderStatus = async (
    orderId: string,
    status: string,
    source: 'assigned' | 'nearby'
  ) => {
    setLoadingAction(orderId);

    const success = await syncRequest(`/api/rider/orders/${orderId}`, 'PATCH', {
      status,
    });

    if (!success) {
      setLoadingAction(null);
      toast.error('We could not update that order yet.');
      return;
    }

    if (source === 'nearby') {
      const claimedOrder = nearbyOrders.find((order) => order._id === orderId);

      if (claimedOrder) {
        setNearbyOrders((previous) =>
          previous.filter((order) => order._id !== orderId)
        );
        setAssignedOrders((previous) => [
          { ...claimedOrder, orderStatus: status, updatedAt: new Date().toISOString() },
          ...previous,
        ]);
      }

      toast.success('Order claimed.');
      setLoadingAction(null);
      return;
    }

    setAssignedOrders((previous) =>
      previous.map((order) =>
        order._id === orderId
          ? { ...order, orderStatus: status, updatedAt: new Date().toISOString() }
          : order
      )
    );

    toast.success(status === 'delivered' ? 'Delivery confirmed.' : 'Order status updated.');
    setLoadingAction(null);
  };

  return (
    <div className="max-w-md space-y-5 pb-28">
      <motion.section
        {...motionPresets.fadeDown}
        className="premium-panel overflow-hidden rounded-[32px] p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-kicker">Today</p>
            <h1 className="mt-2 text-h3 font-black tracking-tight text-text-primary">
              One-handed rider flow.
            </h1>
          </div>
          <Badge variant={isOnline ? 'success' : 'danger'} dot>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <MetricChip label="Active" value={String(currentOrders.length)} icon={<Package size={16} />} />
          <MetricChip label="Nearby" value={String(nearbyOrders.length)} icon={<Sparkles size={16} />} />
          <MetricChip label="Today" value={formatCurrency(todayEarnings || 0)} icon={<Wallet size={16} />} />
        </div>

        {(pendingCount > 0 || isSyncing) && (
          <div className="mt-4 flex items-center justify-between rounded-[22px] border border-border bg-bg-tertiary px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-muted text-brand">
                <RefreshCcw size={16} className={isSyncing ? 'animate-spin' : ''} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {isSyncing ? 'Syncing rider updates' : 'Actions queued safely'}
                </p>
                <p className="text-body-xs">
                  {pendingCount > 0
                    ? `${pendingCount} pending sync`
                    : 'Refreshing status'}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.section>

      <div className="flex rounded-full border border-border bg-bg-tertiary/80 p-1">
        {([
          { id: 'current', label: 'Current' },
          { id: 'nearby', label: 'Nearby' },
          { id: 'leaderboard', label: 'Leaderboard' },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 rounded-full px-3 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab.id ? 'text-text-inverse' : 'text-text-secondary'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="rider-tabs"
                className="absolute inset-0 rounded-full bg-text-primary shadow-xs"
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'leaderboard' ? (
          <motion.div key="leaderboard" {...motionPresets.fade}>
            <LeaderboardView />
          </motion.div>
        ) : activeTab === 'current' ? (
          <motion.div key="current" {...motionPresets.fade} className="space-y-4">
            {primaryOrder ? (
              <>
                <div className="premium-panel rounded-[32px] overflow-hidden">
                  <div className="border-b border-border/80 px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-kicker">Current stop</p>
                        <h2 className="mt-2 text-xl font-bold tracking-tight text-text-primary">
                          {primaryOrder.shippingAddress?.street || 'Address pending'}
                        </h2>
                        <p className="mt-1 text-body-sm">
                          {primaryOrder.shippingAddress?.city || 'City unavailable'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={statusMeta[primaryOrder.orderStatus]?.badge || 'default'}>
                          {statusMeta[primaryOrder.orderStatus]?.label || primaryOrder.orderStatus}
                        </Badge>
                        <p className="mt-3 text-2xl font-black tracking-tight text-text-primary">
                          {formatCurrency(primaryOrder.total || 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 px-5 py-5">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <OrderFact label="Order" value={primaryOrder.orderNumber || primaryOrder._id.slice(-6)} />
                      <OrderFact label="Queue" value={`${queuedOrders.length} after this`} />
                      <OrderFact label="Updated" value={new Date(primaryOrder.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} />
                    </div>

                    <div className="flex gap-3">
                      <Link
                        href={`/rider/orders/${primaryOrder._id}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-[20px] border border-border bg-bg-tertiary px-4 py-3.5 text-sm font-semibold text-text-primary transition-colors hover:bg-bg-primary"
                      >
                        Route details
                        <ExternalLink size={16} />
                      </Link>
                      <Button
                        size="lg"
                        variant="primary"
                        className="flex-1"
                        loading={loadingAction === primaryOrder._id}
                        onClick={() =>
                          updateOrderStatus(
                            primaryOrder._id,
                            getNextStatus(primaryOrder.orderStatus) || 'delivered',
                            'assigned'
                          )
                        }
                      >
                        {getActionLabel(primaryOrder.orderStatus)}
                      </Button>
                    </div>
                  </div>
                </div>

                {queuedOrders.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-kicker px-1">Up next in queue</p>
                    {queuedOrders.map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between rounded-[26px] border border-border bg-bg-elevated px-4 py-4 shadow-xs"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-text-primary">
                            {order.shippingAddress?.street || 'Address pending'}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-body-xs">
                            <MapPin size={12} />
                            <span>{order.shippingAddress?.city || 'City unavailable'}</span>
                          </div>
                        </div>
                        <Badge variant={statusMeta[order.orderStatus]?.badge || 'default'}>
                          {statusMeta[order.orderStatus]?.label || order.orderStatus}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                icon={<CheckCircle size={28} />}
                title="No active deliveries"
                description="You are clear for now."
              />
            )}
          </motion.div>
        ) : (
          <motion.div key="nearby" {...motionPresets.fade} className="space-y-4">
            {nearbyOrders.length > 0 ? (
              nearbyOrders.map((order) => (
                <div
                  key={order._id}
                  className="premium-panel rounded-[28px] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge variant="accent">Nearby pickup</Badge>
                      <h3 className="mt-3 text-lg font-bold tracking-tight text-text-primary">
                        {order.shippingAddress?.city || 'New order'}
                      </h3>
                      <div className="mt-2 flex items-center gap-2 text-body-xs">
                        <Clock3 size={12} />
                        <span>{order.orderNumber || order._id.slice(-6)}</span>
                      </div>
                    </div>
                    <p className="text-xl font-black tracking-tight text-text-primary">
                      {formatCurrency(order.total || 0)}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Link
                      href={`/rider/orders/${order._id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-[18px] border border-border bg-bg-tertiary px-4 py-3 text-sm font-semibold text-text-primary"
                    >
                      Preview
                      <ArrowRight size={15} />
                    </Link>
                    <Button
                      variant="primary"
                      className="flex-1"
                      loading={loadingAction === order._id}
                      onClick={() => updateOrderStatus(order._id, 'accepted', 'nearby')}
                    >
                      Claim order
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={<Sparkles size={28} />}
                title="No nearby orders"
                description="We are watching your area."
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricChip({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-border bg-bg-tertiary/80 px-3 py-3">
      <div className="flex items-center gap-2 text-brand">
        {icon}
        <span className="text-kicker">{label}</span>
      </div>
      <p className="mt-2 truncate text-base font-bold tracking-tight text-text-primary">
        {value}
      </p>
    </div>
  );
}

function OrderFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-border bg-bg-tertiary/80 px-3 py-3">
      <p className="text-kicker">{label}</p>
      <p className="mt-2 text-sm font-semibold text-text-primary">{value}</p>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[30px] border border-dashed border-border bg-bg-tertiary/80 px-8 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-bg-elevated text-brand shadow-xs">
        {icon}
      </div>
      <h3 className="mt-5 text-h5 text-text-primary">{title}</h3>
      <p className="mt-2 max-w-xs text-body-sm">{description}</p>
    </div>
  );
}
