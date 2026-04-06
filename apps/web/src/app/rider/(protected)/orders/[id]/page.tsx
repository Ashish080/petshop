'use client';

import { useState, use, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin, Phone, MessageSquare, ChevronLeft, Truck,
  CheckCircle, Clock, Package, ArrowRight, Zap, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

// ✅ FIXED: STATUS_SEQUENCE aligned with Order schema enum
const STATUS_SEQUENCE = ['confirmed', 'accepted', 'picked', 'out-for-delivery', 'delivered'] as const;
type OrderStatus = typeof STATUS_SEQUENCE[number] | 'pending' | 'placed' | 'cancelled';

const STATUS_META: Record<string, {
  label: string; color: string; bg: string; icon: any; actionLabel?: string
}> = {
  pending:            { label: 'Pending',         color: 'text-slate-600',   bg: 'bg-slate-100',   icon: Clock },
  placed:             { label: 'Assigned',         color: 'text-amber-700',  bg: 'bg-amber-100',   icon: Zap,        actionLabel: 'Accept This Order' },
  confirmed:          { label: 'Assigned',         color: 'text-amber-700',  bg: 'bg-amber-100',   icon: Zap,        actionLabel: 'Accept This Order' },
  accepted:           { label: 'Accepted',         color: 'text-indigo-700', bg: 'bg-indigo-100',  icon: CheckCircle, actionLabel: 'Mark as Picked Up' },
  picked:             { label: 'Picked Up',        color: 'text-orange-700', bg: 'bg-orange-100',  icon: Package,    actionLabel: 'Start Delivery' },
  'out-for-delivery': { label: 'En Route',         color: 'text-sky-700',    bg: 'bg-sky-100',     icon: Truck,      actionLabel: 'Mark as Delivered' },
  delivered:          { label: 'Delivered ✓',     color: 'text-emerald-700',bg: 'bg-emerald-100', icon: CheckCircle },
  cancelled:          { label: 'Cancelled',        color: 'text-rose-700',   bg: 'bg-rose-100',    icon: AlertTriangle },
};

const NEXT_STATUS: Record<string, string> = {
  placed:             'accepted',
  confirmed:          'accepted',
  accepted:           'picked',
  picked:             'out-for-delivery',
  'out-for-delivery': 'delivered',
};

export default function RiderOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'Order not found');
      setOrder(result.data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // ✅ FIXED: Unified status update via ID-based route, supports action:'accept'
  const updateStatus = async (nextStatus: string) => {
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/rider/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Update failed');
      toast.success(`Status updated to ${nextStatus.replace('-', ' ')}`);
      await fetchOrder();
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || 'Could not update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-14 h-14 border-[5px] border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Order...</p>
    </div>
  );

  if (error || !order) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100">
        <AlertTriangle size={28} className="text-rose-500" />
      </div>
      <h2 className="font-black text-slate-900 text-xl">{error || 'Order Not Found'}</h2>
      <button onClick={() => router.back()} className="text-indigo-600 font-black text-sm">Go Back</button>
    </div>
  );

  const currentStatus: string = order.orderStatus;
  const nextStatus = NEXT_STATUS[currentStatus];
  const currentMeta = STATUS_META[currentStatus] || STATUS_META.pending;
  const StatusIcon = currentMeta.icon;
  const isTerminal = currentStatus === 'delivered' || currentStatus === 'cancelled';

  // Pipeline progress
  const pipelineSteps = [
    { status: 'confirmed', label: 'Assigned' },
    { status: 'accepted', label: 'Accepted' },
    { status: 'picked', label: 'Picked Up' },
    { status: 'out-for-delivery', label: 'En Route' },
    { status: 'delivered', label: 'Delivered' },
  ];
  const currentStepIdx = pipelineSteps.findIndex(s => s.status === currentStatus);

  return (
    <div className="space-y-5 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 sticky top-[65px] z-40 py-2 bg-[#F8F9FC]">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-2.5 flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            #{order.orderNumber?.slice(-8) || id.slice(-8)}
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black ${currentMeta.bg} ${currentMeta.color}`}>
            <StatusIcon size={10} strokeWidth={3} />
            {currentMeta.label}
          </span>
        </div>
      </div>

      {/* Customer Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/30 overflow-hidden">
        <div className="p-5">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Customer</p>
          <h2 className="text-2xl font-black text-slate-900 mb-1">
            {order.user?.name || order.user?.email?.split('@')[0] || 'Anonymous'}
          </h2>
          <p className="text-xs font-bold text-slate-400">{order.user?.email}</p>
          <p className="text-sm font-black text-indigo-600 mt-1">₹{order.total} • {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="grid grid-cols-2 gap-px bg-slate-100">
          <a
            href={`tel:${order.user?.phone}`}
            className="bg-white flex items-center justify-center gap-2 py-4 text-emerald-700 font-black text-[11px] uppercase tracking-widest hover:bg-emerald-50 transition-colors"
          >
            <Phone size={16} strokeWidth={3} /> Call
          </a>
          <a
            href={`https://wa.me/${order.user?.phone?.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white flex items-center justify-center gap-2 py-4 text-sky-700 font-black text-[11px] uppercase tracking-widest hover:bg-sky-50 transition-colors"
          >
            <MessageSquare size={16} strokeWidth={3} /> WhatsApp
          </a>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-slate-900 rounded-3xl p-5 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500 to-transparent" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-indigo-400" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Address</p>
          </div>
          <h3 className="text-lg font-black leading-snug">
            {order.shippingAddress?.street}
          </h3>
          <p className="text-slate-400 font-bold text-sm mt-1">
            {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.zipCode}
          </p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(
              `${order.shippingAddress?.street}, ${order.shippingAddress?.city}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-indigo-400 font-black text-[11px] uppercase tracking-widest hover:text-indigo-300 transition-colors"
          >
            Open in Maps <ArrowRight size={14} strokeWidth={3} />
          </a>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/30 p-5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Order Items</p>
        <div className="space-y-3">
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-11 h-11 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <Package size={18} className="text-slate-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-900 text-sm truncate">{item.name}</p>
                <p className="text-[10px] font-bold text-slate-400">Qty: {item.quantity}</p>
              </div>
              <p className="font-black text-slate-900 text-sm shrink-0">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
          <span className="text-xl font-black text-slate-900">₹{order.total}</span>
        </div>
      </div>

      {/* Delivery Pipeline */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/30 p-5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5">Delivery Pipeline</p>
        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-slate-100" />

          <div className="space-y-5">
            {pipelineSteps.map((step, i) => {
              const isDone = currentStepIdx >= i;
              const isActive = currentStepIdx === i;
              return (
                <div key={step.status} className="relative flex items-center gap-4">
                  <div className={`absolute -left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-500 ${
                    isDone ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-500/30' : 'bg-white border-slate-200'
                  }`}>
                    {isDone && <CheckCircle size={11} className="text-white" />}
                    {isActive && !isDone && <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping" />}
                  </div>
                  <div>
                    <p className={`text-sm font-black transition-colors ${isDone ? 'text-slate-900' : 'text-slate-300'}`}>
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Button — Fixed at Bottom */}
      <div className="fixed bottom-20 left-0 right-0 px-4 max-w-lg mx-auto z-40">
        {!isTerminal && nextStatus ? (
          <button
            onClick={() => updateStatus(nextStatus)}
            disabled={updating}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-500/40 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {updating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Truck size={20} strokeWidth={3} />
                {STATUS_META[currentStatus]?.actionLabel || `Mark as ${nextStatus.replace('-', ' ')}`}
              </>
            )}
          </button>
        ) : currentStatus === 'delivered' ? (
          <div className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/30">
            <CheckCircle size={20} strokeWidth={3} />
            Delivery Complete!
          </div>
        ) : currentStatus === 'cancelled' ? (
          <div className="w-full py-5 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3">
            <AlertTriangle size={20} strokeWidth={3} />
            Order Cancelled
          </div>
        ) : null}
      </div>
    </div>
  );
}
