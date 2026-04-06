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
  accepted: { label: 'INTERCEPTED', badge: 'info' },
  picked: { label: 'PAYLOAD SECURED', badge: 'warning' },
  'out-for-delivery': { label: 'TRANSIT PROTOCOL', badge: 'brand' },
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
    <div className="max-w-md mx-auto space-y-6 pb-32 pt-4">
      
      {/* 1. MISSION COMMAND HEADER */}
      <motion.section
        {...motionPresets.fadeDown}
        className="glass rounded-[40px] p-8 border border-white/5 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand/5 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />
        
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse shadow-[0_0_8px_rgba(255,107,0,0.5)]" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Sector: LKO-7</p>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase leading-none">
              Mission Protocol <span className="text-brand">Active</span>
            </h1>
          </div>
          <Badge variant={isOnline ? 'success' : 'danger'} dot className="bg-white/5 border-white/10 text-[9px] font-black tracking-widest italic">
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </Badge>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4 relative z-10">
          <MetricChip label="Missions" value={String(currentOrders.length)} icon={<Package size={16} />} />
          <MetricChip label="Signals" value={String(nearbyOrders.length)} icon={<Sparkles size={16} />} />
          <MetricChip label="Yield" value={formatCurrency(todayEarnings || 0)} icon={<Wallet size={16} />} />
        </div>

        {(pendingCount > 0 || isSyncing) && (
          <div className="mt-8 flex items-center justify-between rounded-[28px] border border-white/5 bg-white/[0.02] px-6 py-4 backdrop-blur-3xl animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 border border-brand/20 text-brand">
                <RefreshCcw size={18} className={isSyncing ? 'animate-spin' : ''} />
              </div>
              <div>
                <p className="font-black text-white italic uppercase tracking-tighter text-sm">
                  {isSyncing ? 'Syncing Protocol' : 'Actions Queued'}
                </p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-0.5">
                  {pendingCount > 0
                    ? `${pendingCount} units pending ingress`
                    : 'Tactical Sync Active'}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.section>

      {/* 2. OPERATIONAL TABS */}
      <div className="flex p-1.5 glass rounded-full border border-white/5 mx-2">
        {([
          { id: 'current', label: 'DEPLOYED' },
          { id: 'nearby', label: 'SIGNALS' },
          { id: 'leaderboard', label: 'RANKINGS' },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 rounded-full px-4 py-3.5 text-[10px] font-black uppercase tracking-widest italic transition-all ${
              activeTab === tab.id ? 'text-white' : 'text-white/30 hover:text-white/60'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="rider-tabs"
                className="absolute inset-0 rounded-full bg-brand shadow-xl shadow-brand/20"
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
                <div className="glass rounded-[40px] overflow-hidden border border-white/5 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-[60px] pointer-events-none" />
                  
                  <div className="border-b border-white/5 px-8 py-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic mb-3">Payload Destination</p>
                        <h2 className="text-xl font-black italic tracking-tighter text-white uppercase leading-tight">
                          {primaryOrder.shippingAddress?.street || 'SCANNING ADDRESS...'}
                        </h2>
                        <p className="mt-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          {primaryOrder.shippingAddress?.city || 'SECTOR UNKNOWN'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={statusMeta[primaryOrder.orderStatus]?.badge || 'default'} className="mb-4">
                          {statusMeta[primaryOrder.orderStatus]?.label || primaryOrder.orderStatus}
                        </Badge>
                        <p className="text-2xl font-black italic tracking-tighter text-brand">
                          {formatCurrency(primaryOrder.total || 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 px-8 py-8">
                    <div className="grid grid-cols-2 gap-4">
                      <OrderFact label="Protocol ID" value={primaryOrder.orderNumber || primaryOrder._id.slice(-6).toUpperCase()} />
                      <OrderFact label="Queue Status" value={`${queuedOrders.length} IN BUFFER`} />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={`/rider/orders/${primaryOrder._id}`}
                        className="flex-1 h-14 rounded-2xl glass border border-white/10 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest italic text-white hover:bg-white/5 transition-all"
                      >
                        Sector Map
                        <ExternalLink size={16} className="text-white/20" />
                      </Link>
                      <Button
                        size="xl"
                        variant="primary"
                        className="flex-1 bg-brand text-white shadow-xl shadow-brand/20"
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
                  <div className="space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 px-2 italic">Backlog Protocol</p>
                    {queuedOrders.map((order) => (
                      <div
                        key={order._id}
                        className="flex items-center justify-between rounded-[28px] border border-white/5 bg-white/[0.02] px-6 py-5 group hover:border-white/10 transition-all"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-black italic text-white uppercase tracking-tight">
                            {order.shippingAddress?.street || 'SCANNING...'}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                            <MapPin size={12} />
                            <span>{order.shippingAddress?.city || 'SECTOR PK'}</span>
                          </div>
                        </div>
                        <Badge variant={statusMeta[order.orderStatus]?.badge || 'default'} className="opacity-60 group-hover:opacity-100 transition-opacity">
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
                title="Sector Clear"
                description="Zero active missions detected in your proximity."
              />
            )}
          </motion.div>
        ) : (
          <motion.div key="nearby" {...motionPresets.fade} className="space-y-4">
            {nearbyOrders.length > 0 ? (
              nearbyOrders.map((order) => (
                <div
                  key={order._id}
                  className="glass rounded-[32px] px-6 py-6 border border-white/5 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 blur-3xl pointer-events-none group-hover:bg-brand/10 transition-colors" />
                  
                  <div className="flex items-start justify-between gap-4 relative z-10">
                    <div>
                      <Badge variant="accent" className="mb-4">SIGNAL DETECTED</Badge>
                      <h3 className="text-lg font-black italic tracking-tighter text-white uppercase leading-tight">
                        {order.shippingAddress?.city || 'NEW MISSION'}
                      </h3>
                      <div className="mt-2 flex items-center gap-2 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                        <Clock3 size={12} />
                        <span>ID: {order.orderNumber || order._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                    <p className="text-2xl font-black italic tracking-tighter text-brand">
                      {formatCurrency(order.total || 0)}
                    </p>
                  </div>

                  <div className="mt-8 flex gap-4 relative z-10">
                    <Link
                      href={`/rider/orders/${order._id}`}
                      className="flex-1 h-12 rounded-xl glass border border-white/5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest italic text-white/40 hover:text-white transition-all"
                    >
                      Preview
                      <ArrowRight size={15} />
                    </Link>
                    <Button
                      variant="primary"
                      className="flex-1 h-12 bg-brand text-white text-[10px]"
                      loading={loadingAction === order._id}
                      onClick={() => updateOrderStatus(order._id, 'accepted', 'nearby')}
                    >
                      Intercept
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={<Sparkles size={28} />}
                title="Low Signal"
                description="Scanning for new mission availability..."
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricChip({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.02] px-4 py-5 hover:bg-white/[0.04] transition-all">
      <div className="flex items-center gap-2 text-brand mb-4">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest italic">{label}</span>
      </div>
      <p className="text-xl font-black italic tracking-tighter text-white uppercase truncate">
        {value}
      </p>
    </div>
  );
}

function OrderFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-4">
      <p className="text-[9px] font-black uppercase tracking-widest text-white/20 italic mb-2">{label}</p>
      <p className="text-xs font-black italic text-white uppercase">{value}</p>
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[40px] border border-dashed border-white/10 bg-white/[0.01] px-8 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-brand mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-black italic tracking-tighter text-white uppercase">{title}</h3>
      <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-2">{description}</p>
    </div>
  );
}
