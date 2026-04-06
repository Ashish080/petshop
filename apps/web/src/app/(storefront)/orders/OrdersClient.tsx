'use client';

import { useState, useCallback, memo, useMemo } from 'react';
import Link from 'next/link';
import {
  Package, CheckCircle, Clock, Truck, MapPin, Phone,
  Star, ChevronRight, ChevronDown, ShoppingBag, MessageSquare,
  AlertCircle, RotateCcw, User, Wifi, WifiOff, X,
  CircleDot, ArrowRight, CreditCard, Receipt, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useOrderStream, type ConnectionState } from '@/hooks/useOrderStream';

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const STATUS_STEPS = [
  { key: 'pending',          label: 'Order Placed',    short: 'Placed',    icon: Receipt,     color: '#94a3b8' },
  { key: 'confirmed',        label: 'Confirmed',       short: 'Confirmed', icon: CheckCircle, color: '#0ea5e9' },
  { key: 'accepted',         label: 'Rider Assigned',  short: 'Assigned',  icon: User,        color: '#6366f1' },
  { key: 'picked',           label: 'Picked Up',       short: 'Picked',    icon: Package,     color: '#a855f7' },
  { key: 'out-for-delivery', label: 'On the Way',      short: 'En Route',  icon: Truck,       color: '#f97316' },
  { key: 'delivered',        label: 'Delivered',        short: 'Delivered', icon: CheckCircle, color: '#10b981' },
] as const;

const STATUS_IDX: Record<string, number> = {};
STATUS_STEPS.forEach((s, i) => { STATUS_IDX[s.key] = i; });
STATUS_IDX['placed'] = 0;

const ETA_MINUTES: Record<string, number> = {
  pending: 45, confirmed: 40, accepted: 35, picked: 25,
  'out-for-delivery': 10, delivered: 0,
};

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function StatusPill({ status }: { status: string }) {
  const step = STATUS_STEPS.find(s => s.key === status);
  const color = step?.color ?? '#94a3b8';
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {step?.label ?? status}
    </span>
  );
}

function ConnBadge({ state }: { state: ConnectionState }) {
  if (state === 'connected')    return <span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-bold"><Wifi size={10} />Live</span>;
  if (state === 'reconnecting') return <span className="inline-flex items-center gap-1 text-amber-500 text-[10px] font-bold animate-pulse"><WifiOff size={10} />Reconnecting…</span>;
  if (state === 'connecting')   return <span className="inline-flex items-center gap-1 text-slate-400 text-[10px] font-bold animate-pulse"><Wifi size={10} />Connecting…</span>;
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// A. ACTIVE ORDER — Live Tracking Card (Sticky Top)
// ═══════════════════════════════════════════════════════════════════════════════

function ActiveOrderCard({
  order,
  onStatusChange,
}: {
  order: any;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [liveStatus, setLiveStatus] = useState<string>(order.orderStatus);
  const [expanded, setExpanded]     = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(!!order.feedback);
  const [rating, setRating]         = useState(0);
  const [comment, setComment]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isTerminal = liveStatus === 'delivered' || liveStatus === 'cancelled';
  const currentIdx = STATUS_IDX[liveStatus] ?? 0;
  const eta        = ETA_MINUTES[liveStatus] ?? 0;

  // ── SSE real-time subscription ──
  const connState = useOrderStream({
    orderId: order._id,
    enabled: !isTerminal,
    onUpdate: ({ orderStatus }) => {
      if (!orderStatus || orderStatus === liveStatus) return;
      setLiveStatus(orderStatus);
      onStatusChange(order._id, orderStatus);

      // Contextual toasts
      const msgs: Record<string, string> = {
        confirmed:          '✅ Your order has been confirmed!',
        accepted:           '🏍️ A rider has been assigned!',
        picked:             '📦 Your order has been picked up!',
        'out-for-delivery': '🚀 Your order is on the way!',
        delivered:          '🎉 Your order has been delivered!',
      };
      if (msgs[orderStatus]) toast.success(msgs[orderStatus], { duration: 4000 });
    },
  });

  // ── Feedback submit ──
  const submitFeedback = async () => {
    if (!rating) return toast.error('Please select a rating');
    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${order._id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success('Thank you for your feedback!');
      setShowFeedback(false);
      setFeedbackSubmitted(true);
    } catch (e: any) {
      toast.error(e.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[28px] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">

      {/* ─── Header bar ─── */}
      <div className={`px-5 py-3.5 flex items-center justify-between ${
        isTerminal
          ? (liveStatus === 'delivered' ? 'bg-emerald-600' : 'bg-rose-500')
          : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500'
      }`}>
        <div className="flex items-center gap-2.5">
          {!isTerminal && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span>}
          <span className="text-white/90 font-bold text-[11px] uppercase tracking-widest">
            {isTerminal ? (liveStatus === 'delivered' ? 'Delivered' : 'Cancelled') : 'Live Tracking'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ConnBadge state={connState} />
          <span className="text-white/60 font-mono text-[11px]">#{order.orderNumber?.slice(-8)}</span>
        </div>
      </div>

      <div className="p-5 space-y-5">

        {/* ─── ETA banner ─── */}
        {!isTerminal && eta > 0 && (
          <div className="flex items-center justify-between bg-indigo-50 rounded-2xl px-4 py-3 border border-indigo-100">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-indigo-500" />
              <span className="text-sm font-bold text-indigo-700">Estimated arrival</span>
            </div>
            <span className="text-lg font-black text-indigo-600">~{eta} min</span>
          </div>
        )}

        {/* ─── B. Visual Progress Stepper ─── */}
        {liveStatus !== 'cancelled' ? (
          <div className="pt-1">
            {/* Horizontal progress bar */}
            <div className="relative mb-3">
              <div className="absolute inset-x-3 top-[11px] h-[3px] bg-slate-100 rounded-full" />
              <div
                className="absolute left-3 top-[11px] h-[3px] rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `calc(${(currentIdx / (STATUS_STEPS.length - 1)) * 100}% - 12px)`,
                  background: `linear-gradient(90deg, ${STATUS_STEPS[0].color}, ${STATUS_STEPS[Math.min(currentIdx, STATUS_STEPS.length - 1)].color})`,
                }}
              />
              <div className="relative flex justify-between">
                {STATUS_STEPS.map((step, i) => {
                  const done   = i <= currentIdx;
                  const active = i === currentIdx;
                  const Icon   = step.icon;
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-1.5 z-10 min-w-0">
                      <div
                        className={`w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all duration-500 ${
                          done ? 'shadow-md' : 'border-2 border-slate-200 bg-white'
                        } ${active ? 'ring-[3px] ring-offset-1' : ''}`}
                        style={done ? {
                          backgroundColor: step.color,
                          ...(active ? { ringColor: `${step.color}40` } : {}),
                        } : {}}
                      >
                        {done && <Icon size={11} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-wide text-center leading-tight max-w-[44px] ${
                        done ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        {step.short}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current status label */}
            <div className="flex items-center justify-between mt-2">
              <StatusPill status={liveStatus} />
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                {expanded ? 'Less' : 'Details'}
                <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-rose-50 rounded-2xl px-4 py-3 border border-rose-200">
            <AlertCircle size={16} className="text-rose-500" />
            <span className="text-sm font-bold text-rose-700">This order was cancelled</span>
          </div>
        )}

        {/* ─── Rider Info ─── */}
        {order.rider && ['accepted', 'picked', 'out-for-delivery'].includes(liveStatus) && (
          <div className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                <User size={16} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{order.rider.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Rider</p>
              </div>
            </div>
            {order.rider.phone && (
              <a
                href={`tel:${order.rider.phone}`}
                className="w-9 h-9 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors"
              >
                <Phone size={15} />
              </a>
            )}
          </div>
        )}

        {/* ─── C. Expandable Details ─── */}
        {expanded && (
          <div className="space-y-4 pt-2 border-t border-slate-100 animate-in slide-in-from-top-2">

            {/* Items */}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Items</p>
              <div className="space-y-2">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Package size={16} className="text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-slate-900 shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-sm border border-slate-100">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-slate-500"><span>Shipping</span><span>{order.shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${order.shipping}`}</span></div>
              {order.tax > 0 && <div className="flex justify-between text-slate-500"><span>Tax</span><span>₹{order.tax}</span></div>}
              <div className="flex justify-between font-black text-slate-900 pt-1.5 border-t border-slate-200"><span>Total</span><span>₹{order.total?.toLocaleString('en-IN')}</span></div>
            </div>

            {/* Delivery address */}
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Delivery Address</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="flex items-center gap-2.5">
              <CreditCard size={14} className="text-slate-400 shrink-0" />
              <p className="text-sm text-slate-500">
                Payment: <span className="font-bold text-slate-700 uppercase">{order.paymentMethod ?? 'COD'}</span>
                {' · '}
                <span className={order.paymentStatus === 'paid' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                  {order.paymentStatus ?? 'Pending'}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* ─── D. Feedback (only after delivered) ─── */}
        {liveStatus === 'delivered' && !feedbackSubmitted && (
          <div className="pt-3 border-t border-slate-100">
            {!showFeedback ? (
              <button
                onClick={() => setShowFeedback(true)}
                className="w-full py-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-amber-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:from-amber-100 hover:to-orange-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Star size={15} /> Rate Your Experience
              </button>
            ) : (
              <div className="space-y-3.5">
                <p className="font-bold text-slate-900 text-sm">How was your delivery?</p>

                {/* Stars */}
                <div className="flex gap-1.5 justify-center">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setRating(n)}
                      className="group"
                    >
                      <Star
                        size={28}
                        className={`transition-all duration-200 ${
                          n <= rating
                            ? 'text-amber-400 fill-amber-400 scale-110'
                            : 'text-slate-200 hover:text-amber-300 hover:scale-110'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Tell us about your experience (optional)"
                  rows={2}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 resize-none placeholder:text-slate-300 transition-all"
                />
                <div className="flex gap-2">
                  <button
                    onClick={submitFeedback}
                    disabled={submitting || !rating}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-40 hover:bg-indigo-700 transition-colors active:scale-[0.98]"
                  >
                    {submitting ? 'Submitting…' : 'Submit Review'}
                  </button>
                  <button
                    onClick={() => { setShowFeedback(false); setRating(0); setComment(''); }}
                    className="px-4 py-3 bg-slate-100 text-slate-500 rounded-xl text-xs font-black hover:bg-slate-200 transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Already reviewed badge */}
        {liveStatus === 'delivered' && feedbackSubmitted && (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-2xl px-4 py-2.5 border border-emerald-100 text-xs font-bold">
            <CheckCircle size={14} /> You've reviewed this order
          </div>
        )}

        {/* Order summary footer */}
        {!expanded && (
          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="font-black text-slate-900 text-sm">
                {order.items?.[0]?.name}
                {order.items?.length > 1 && <span className="text-slate-400 font-bold"> +{order.items.length - 1}</span>}
              </p>
              <p className="text-xs text-slate-400 font-bold mt-0.5">₹{order.total?.toLocaleString('en-IN')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// E. ORDER HISTORY — Compact list item
// ═══════════════════════════════════════════════════════════════════════════════

const HistoryItem = memo(function HistoryItem({ order, onSelect }: { order: any; onSelect: (o: any) => void }) {
  return (
    <button
      onClick={() => onSelect(order)}
      className="w-full text-left bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-4 flex items-center gap-3.5 active:scale-[0.99] group"
    >
      <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shrink-0 overflow-hidden">
        {order.items?.[0]?.image ? (
          <img src={order.items[0].image} alt="" className="w-full h-full object-cover rounded-xl" />
        ) : (
          <Package size={18} className="text-slate-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-900 text-sm truncate">
          {order.items?.[0]?.name}
          {order.items?.length > 1 && <span className="text-slate-400"> +{order.items.length - 1}</span>}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-bold text-slate-400">
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
          <span className="text-slate-200">·</span>
          <StatusPill status={order.orderStatus} />
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-black text-slate-900">₹{order.total?.toLocaleString('en-IN')}</p>
      </div>
      <ChevronRight size={16} className="text-slate-200 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0" />
    </button>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// ORDER DETAIL SHEET (overlay panel for past orders)
// ═══════════════════════════════════════════════════════════════════════════════

function OrderDetailSheet({ order, onClose }: { order: any; onClose: () => void }) {
  const currentIdx = STATUS_IDX[order.orderStatus] ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white rounded-t-[28px] sm:rounded-[28px] w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 px-5 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Details</p>
            <p className="font-black text-slate-900">#{order.orderNumber?.slice(-8)}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Status + date */}
          <div className="flex items-center justify-between">
            <StatusPill status={order.orderStatus} />
            <span className="text-xs text-slate-400 font-bold">
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Vertical Timeline */}
          <div className="relative pl-7">
            <div className="absolute left-[9px] top-1 bottom-1 w-[2px] bg-slate-100" />
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentIdx;
              const Icon = step.icon;
              return (
                <div key={step.key} className="relative flex items-start gap-3 pb-4 last:pb-0">
                  <div
                    className={`absolute -left-7 w-5 h-5 rounded-full flex items-center justify-center z-10 ${
                      done ? 'shadow-sm' : 'border-2 border-slate-200 bg-white'
                    }`}
                    style={done ? { backgroundColor: step.color } : {}}
                  >
                    {done && <Icon size={10} className="text-white" strokeWidth={3} />}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${done ? 'text-slate-900' : 'text-slate-300'}`}>{step.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Items */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Items</p>
            <div className="space-y-2">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" /> : <Package size={14} className="text-slate-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-slate-50 rounded-xl p-3.5 flex items-center justify-between border border-slate-100">
            <span className="font-bold text-slate-600 text-sm">Total Paid</span>
            <span className="text-xl font-black text-slate-900">₹{order.total?.toLocaleString('en-IN')}</span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2.5">
            <MapPin size={14} className="text-indigo-400 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-600 leading-relaxed">
              {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
            </p>
          </div>

          {/* Feedback already given */}
          {order.feedback && (
            <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-100">
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < order.feedback.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />
                ))}
              </div>
              {order.feedback.comment && <p className="text-sm text-slate-600 mt-1">{order.feedback.comment}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// F. EMPTY STATE
// ═══════════════════════════════════════════════════════════════════════════════

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-[32px] flex items-center justify-center mb-6 border border-indigo-100 shadow-lg shadow-indigo-500/10">
        <ShoppingBag size={36} className="text-indigo-400" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">No Orders Yet</h2>
      <p className="text-slate-400 text-sm max-w-[260px] leading-relaxed mb-8">
        Your orders will appear here once you start shopping. Let's find something great!
      </p>
      <Link
        href="/products"
        className="inline-flex items-center gap-2.5 bg-indigo-600 text-white px-7 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-indigo-500/25 hover:bg-indigo-700 active:scale-[0.97] transition-all"
      >
        <Sparkles size={16} /> Browse Products
      </Link>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════

export default function UserOrdersDashboard({
  initialOrders,
  userName,
}: {
  initialOrders: any[];
  userName: string;
}) {
  const [orders, setOrders]             = useState(initialOrders);
  const [refreshing, setRefreshing]     = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [historyLimit, setHistoryLimit] = useState(5); // lazy load

  // Split orders into active vs history
  const activeOrders = useMemo(() =>
    orders.filter(o => !['delivered', 'cancelled'].includes(o.orderStatus)),
    [orders]
  );
  const pastOrders = useMemo(() =>
    orders.filter(o => ['delivered', 'cancelled'].includes(o.orderStatus)),
    [orders]
  );

  // Pick ONE active order (the most recent non-terminal one)
  const primaryActive = activeOrders[0] ?? null;

  const handleStatusChange = useCallback((id: string, status: string) => {
    setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));
  }, []);

  const refreshOrders = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch { /* ignore */ } finally {
      setRefreshing(false);
    }
  };

  if (orders.length === 0) return <EmptyState />;

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-bold text-slate-400 mb-0.5">Welcome back,</p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{userName?.split(' ')[0] || 'Friend'}</h1>
        </div>
        <button
          onClick={refreshOrders}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors px-3 py-2 rounded-xl hover:bg-indigo-50 active:scale-95"
        >
          <RotateCcw size={13} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── A. Active Order (Primary, Sticky-ish) ── */}
      {primaryActive && (
        <section>
          <ActiveOrderCard
            order={primaryActive}
            onStatusChange={handleStatusChange}
          />
        </section>
      )}

      {/* Other active orders (if more than one) */}
      {activeOrders.length > 1 && (
        <section>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Other Active Orders</p>
          <div className="space-y-2.5">
            {activeOrders.slice(1).map(o => (
              <HistoryItem key={o._id} order={o} onSelect={setSelectedOrder} />
            ))}
          </div>
        </section>
      )}

      {/* ── E. Past Orders ── */}
      {pastOrders.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-slate-400" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Past Orders</p>
            </div>
            <p className="text-[11px] font-bold text-slate-300">{pastOrders.length} orders</p>
          </div>
          <div className="space-y-2.5">
            {pastOrders.slice(0, historyLimit).map(o => (
              <HistoryItem key={o._id} order={o} onSelect={setSelectedOrder} />
            ))}
          </div>
          {pastOrders.length > historyLimit && (
            <button
              onClick={() => setHistoryLimit(prev => prev + 10)}
              className="w-full mt-3 py-3 bg-slate-50 border border-slate-200 text-slate-500 rounded-2xl text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              Show More <ChevronDown size={14} />
            </button>
          )}
        </section>
      )}

      {/* ── Order Detail Sheet (overlay) ── */}
      {selectedOrder && (
        <OrderDetailSheet
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
