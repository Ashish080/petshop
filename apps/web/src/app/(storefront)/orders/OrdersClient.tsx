'use client';

import { useState, useCallback, memo, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, CheckCircle, Clock, Truck, MapPin, Phone,
  Star, ChevronRight, ChevronDown, ShoppingBag,
  RotateCcw, User, Wifi, WifiOff, X,
  Receipt, Sparkles, Navigation, ShieldCheck,
  AlertCircle, HelpCircle, MessageSquare, Send, Bell,
  Copy, Share2, Wallet as WalletIcon, Gift,
  Cpu, Crosshair, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useOrderStream, type ConnectionState } from '@/hooks/useOrderStream';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import confetti from 'canvas-confetti';
import { motionPresets, duration, easing } from '@/lib/motion';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

const STATUS_STEPS = [
  { key: 'pending',          label: 'Preparing',    icon: Cpu,         color: 'var(--color-obsidian-light)' },
  { key: 'confirmed',        label: 'Confirmed',    icon: ShieldCheck, color: 'var(--color-info)' },
  { key: 'accepted',         label: 'Assigned',     icon: Crosshair,   color: 'var(--color-brand)' },
  { key: 'picked',           label: 'Intercepted',  icon: Package,     color: 'var(--color-brand)' },
  { key: 'out-for-delivery', label: 'Transit',      icon: Truck,       color: 'var(--color-warning)' },
  { key: 'delivered',        label: 'Secured',      icon: CheckCircle, color: 'var(--color-success)' },
] as const;

const STATUS_IDX: Record<string, number> = {};
STATUS_STEPS.forEach((s, i) => { STATUS_IDX[s.key] = i; });
STATUS_IDX['placed'] = 0;

const ETA_MINUTES: Record<string, number> = {
  pending: 45, confirmed: 40, accepted: 25, picked: 15,
  'out-for-delivery': 5, delivered: 0,
};

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function ConnBadge({ state }: { state: ConnectionState }) {
  if (state === 'connected') return <span className="inline-flex items-center gap-2 text-success text-[10px] font-black tracking-[0.2em] uppercase bg-success/10 border border-success/20 px-3 py-1.5 rounded-xl italic animate-fade-in"><Activity size={12} className="animate-pulse" /> Live Telemetry</span>;
  if (state === 'reconnecting') return <span className="inline-flex items-center gap-2 text-warning text-[10px] font-black uppercase tracking-[0.2em] bg-warning/10 border border-warning/20 px-3 py-1.5 rounded-xl italic transition-all"><WifiOff size={12} /> Syncing Node</span>;
  if (state === 'connecting') return <span className="inline-flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl italic">Initializing Pulse</span>;
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// A. TRACKING UI MAP COMPONENT - "Mission Radar"
// ═══════════════════════════════════════════════════════════════════════════════

function JourneyMap({ statusIdx }: { statusIdx: number }) {
  const progressPercent = Math.max(5, Math.min(100, (statusIdx / (STATUS_STEPS.length - 1)) * 100));

  return (
    <div className="relative w-full h-[240px] bg-obsidian overflow-hidden rounded-t-[40px] flex flex-col items-center justify-end pb-16 border-b border-white/5">
      
      {/* Tactical Radar Grid Overlay */}
      <div className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      {/* Base Elevation Shadow */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand/10 to-transparent pointer-events-none opacity-40" />

      {/* The Mission Path */}
      <div className="absolute bottom-20 w-[85%] h-[2px] bg-white/5 rounded-full overflow-hidden">
        {/* Dynamic Telemetry Line */}
        <motion.div 
          className="h-full bg-brand relative"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ type: "spring", stiffness: 45, damping: 15 }}
        >
            <div className="absolute top-[-4px] right-[-4px] w-2 h-2 bg-brand rounded-full shadow-[0_0_15px_rgba(255,107,0,1)]" />
        </motion.div>
      </div>

      {/* Strategic Milestones */}
      <div className="absolute bottom-14 w-[85%] flex justify-between z-10 items-end px-2 pointer-events-none">
         <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-2xl glass border border-white/10 flex items-center justify-center mb-3">
                <Navigation size={18} className="text-white/40" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">Asset Origin</span>
         </div>
         <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-2xl glass border border-white/10 flex items-center justify-center mb-3 transition-colors ${statusIdx === 5 ? 'border-success/40 bg-success/10' : ''}`}>
                <MapPin size={18} className={statusIdx === 5 ? 'text-success' : 'text-white/40'} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">Deployment Node</span>
         </div>
      </div>

      {/* The Strategic Asset / Rider Marker */}
      <motion.div 
         className="absolute bottom-20 z-30 ml-4"
         initial={{ left: '0%' }}
         animate={{ left: `${progressPercent}%` }}
         transition={{ type: "spring", stiffness: 50, damping: 20 }}
         style={{ translateX: '-50%' }}
      >
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="relative"
          >
             {statusIdx < 2 ? (
                <div className="p-3 bg-brand/20 border border-brand/40 rounded-xl backdrop-blur-md">
                    <Package size={24} className="text-brand" />
                </div>
             ) : statusIdx === 5 ? (
                <div className="p-3 bg-success/20 border border-success/40 rounded-xl backdrop-blur-md animate-bounce">
                    <CheckCircle size={24} className="text-success" />
                </div>
             ) : (
                <div className="relative group">
                    <div className="p-4 bg-brand rounded-2xl shadow-[0_15px_30px_rgba(255,107,0,0.4)] flex items-center justify-center">
                        <Truck size={24} className="text-white" />
                    </div>
                </div>
             )}
          </motion.div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// B. MISSION TRACKER CARD
// ═══════════════════════════════════════════════════════════════════════════════

function ActiveOrderCard({ order, onStatusChange }: { order: any; onStatusChange: (id: string, s: string) => void; }) {
  const [liveStatus, setLiveStatus] = useState<string>(order.orderStatus);
  const [expanded, setExpanded]     = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [reporting, setReporting]     = useState(false);
  
  const handleReport = async (issueType: string) => {
    setReporting(true);
    try {
      const res = await fetch(`/api/orders/${order._id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueType })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Support team notified! We will contact you shortly.', { duration: 5000 });
        setShowSupport(false);
      }
    } catch (err) {
      toast.error('Failed to report issue');
    } finally {
      setReporting(false);
    }
  };

  const currentIdx = Math.max(0, STATUS_IDX[liveStatus] ?? 0);
  const isTerminal = liveStatus === 'delivered' || liveStatus === 'cancelled';
  const eta        = ETA_MINUTES[liveStatus] ?? 0;

  useEffect(() => {
    // Simulated arrival sparkle when ETA is very close and status is out-for-delivery
    if (liveStatus === 'out-for-delivery') {
      const timer = setTimeout(() => {
         setShowSparkle(true);
         confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 }, colors: ['#FF6B00', '#00C48C'] });
         setTimeout(() => setShowSparkle(false), 8000);
      }, 5000); // 5 sec after entering out for delivery for demo
      return () => clearTimeout(timer);
    }
  }, [liveStatus]);

  const connState = useOrderStream({
    orderId: order._id,
    enabled: !isTerminal,
    onUpdate: ({ orderStatus }) => {
      if (!orderStatus || orderStatus === liveStatus) return;
      setLiveStatus(orderStatus);
      onStatusChange(order._id, orderStatus);
      if (orderStatus === 'delivered') confetti({ particleCount: 150, spread: 100 });
    },
  });

  return (
    <>
      <div className="bg-bg-elevated rounded-[--radius-2xl] shadow-xl border border-border overflow-hidden relative transition-all">
        <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
            {!isTerminal && (
              <button 
                onClick={() => setShowSupport(true)}
                className="w-10 h-10 rounded-full bg-danger/10 text-danger border border-danger/20 flex items-center justify-center hover:bg-danger/20 transition-all shadow-sm"
                title="Report Issue"
              >
                  <AlertCircle size={18} />
              </button>
            )}
            <ConnBadge state={connState} />
        </div>
        
        {/* Playful Animal Timeline Map */}
        {!isTerminal && <JourneyMap statusIdx={currentIdx} /> }

        {/* Dynamic ETA Banner */}
        <div className="p-6 pb-2">
            {!isTerminal ? (
              <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                      <span className="text-h2 font-black text-text-primary tracking-tight">~{eta} <span className="text-h4 text-text-tertiary font-bold">mins</span></span>
                      <span className="text-[11px] uppercase tracking-widest text-text-secondary font-bold mt-1">Arrival Estimate</span>
                  </div>
                  <div className="w-14 h-14 bg-bg-secondary rounded-full flex items-center justify-center p-1 relative shadow-inner border border-border">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="w-full h-full rounded-full border-4 border-r-transparent border-t-transparent border-brand opacity-40 absolute" />
                      <Clock size={22} className="text-text-primary relative z-10" />
                  </div>
              </div>
            ) : (
              <div className={`p-4 rounded-[--radius-xl] mb-4 flex items-center gap-3 ${liveStatus === 'delivered' ? 'bg-success/10 border-success/20 text-success' : 'bg-danger/10 border-danger/20 text-danger'} border shadow-sm`}>
                 <CheckCircle size={24} />
                 <span className="text-label-lg font-bold">Order successfully {liveStatus.replace('-', ' ')}</span>
              </div>
            )}

            {/* Stepper Dots Detailed */}
            {!isTerminal && (
              <div className="mt-6 mb-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-3">Live Progress</p>
                 <div className="relative">
                    <div className="absolute left-[15px] top-4 bottom-4 w-1 bg-border rounded-full" />
                    <div className="space-y-6 relative">
                       {STATUS_STEPS.map((step, i) => {
                          const isPast = i < currentIdx;
                          const isActive = i === currentIdx;
                          if (i > currentIdx + 1) return null; // Hide futuristic steps for clean UI
                          
                          return (
                             <div key={i} className={`flex items-center gap-4 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center z-10 bg-bg-primary ${isPast ? 'border-success' : isActive ? 'border-brand' : 'border-border'}`}>
                                    {isPast && <div className="w-2.5 h-2.5 rounded-full bg-success" />}
                                    {isActive && <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2.5 h-2.5 rounded-full bg-brand" />}
                                </div>
                                <span className={`text-label-lg font-bold ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>{step.label}</span>
                             </div>
                          )
                       })}
                    </div>
                 </div>
              </div>
            )}

            {/* Rider Persona Card */}
            {order.rider && !isTerminal && currentIdx >= 2 && (
              <motion.div {...motionPresets.fadeUp} className="mt-8 flex items-center justify-between p-4 bg-brand/5 border border-brand/20 rounded-[--radius-xl]">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-full overflow-hidden border-2 border-brand/20 shadow-sm flex items-center justify-center text-brand font-black text-xl">
                       {order.rider.name.charAt(0)}
                    </div>
                    <div>
                       <p className="font-black text-text-primary text-label-lg">{order.rider.name}</p>
                       <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1 max-w-[200px] leading-tight">
                         Delivering Happiness 🐾
                       </p>
                    </div>
                 </div>
                 {order.rider.phone && (
                   <a href={`tel:${order.rider.phone}`} className="h-12 w-12 flex items-center justify-center rounded-full bg-brand text-white shadow-[0_10px_20px_rgba(255,107,0,0.3)] hover:scale-105 active:scale-95 transition-transform">
                      <Phone size={18} className="fill-white" />
                   </a>
                 )}
              </motion.div>
            )}

            <div className="flex gap-4 mt-6">
               <button onClick={() => setExpanded(!expanded)} className="flex-1 py-4 flex items-center justify-center gap-2 text-label-sm font-bold uppercase tracking-widest text-text-primary bg-bg-secondary rounded-[--radius-lg] hover:bg-border transition-colors focus:outline-none">
                 {expanded ? 'Hide Details' : 'View Receipt'}
                 <ChevronDown size={16} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
               </button>
               
               <CancellationButton 
                  orderId={order._id} 
                  createdAt={order.createdAt} 
                  status={liveStatus}
                  onCancel={() => {
                     setLiveStatus('cancelled');
                     onStatusChange(order._id, 'cancelled');
                  }}
               />
            </div>
        </div>

        {/* Expandable Meta details */}
        <AnimatePresence>
            {expanded && (
               <motion.div 
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: "auto", opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden bg-bg-secondary border-t border-border"
               >
                  <div className="p-6 space-y-6">
                      <div className="space-y-4">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-text-tertiary">Packaged Items</p>
                          {order.items?.map((item: any, i: number) => (
                             <div key={i} className="flex gap-4 items-center bg-bg-primary p-3 rounded-[--radius-lg] border border-border">
                                <div className="w-12 h-12 bg-bg-secondary rounded-[--radius-md] shrink-0 flex items-center justify-center text-lg">🦴</div>
                                <div className="flex-1">
                                   <p className="text-label-sm font-bold text-text-primary truncate">{item.name}</p>
                                   <p className="text-[10px] font-bold text-text-tertiary uppercase mt-1">Qty: {item.quantity}</p>
                                </div>
                                <span className="font-bold text-text-primary text-label-lg">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                             </div>
                          ))}
                      </div>
                      
                      <div className="space-y-2 bg-bg-primary p-5 rounded-[--radius-xl] border border-border">
                         <div className="flex justify-between text-body-sm text-text-secondary font-medium"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString('en-IN')}</span></div>
                         <div className="flex justify-between text-body-sm text-text-secondary font-medium"><span>Premium Delivery</span><span className="text-success font-bold">FREE</span></div>
                         <div className="h-px w-full bg-border my-3" />
                         <div className="flex justify-between text-label-lg text-text-primary font-black"><span>Total Paid</span><span>₹{order.total?.toLocaleString('en-IN')}</span></div>
                      </div>
                  </div>
               </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Support Issue Reporting Modal */}
      <AnimatePresence>
         {showSupport && (
            <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                 onClick={() => setShowSupport(false)}
               />
               <motion.div 
                 initial={{ y: "100%", opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 exit={{ y: "100%", opacity: 0 }}
                 className="relative w-full max-w-md bg-bg-elevated rounded-t-[--radius-3xl] sm:rounded-b-[--radius-3xl] p-8 shadow-[0_-20px_60px_rgba(0,0,0,0.2)] border border-border"
               >
                   <div className="w-12 h-1.5 bg-border rounded-full mx-auto mb-8 sm:hidden" />
                   <h3 className="text-h3 font-black text-text-primary tracking-tight mb-6 flex items-center gap-3">
                       <HelpCircle className="text-danger" />
                       Report an Issue
                   </h3>
                   
                   <p className="text-body-sm text-text-secondary mb-8 font-medium">Something not right? Tell us what's happening and our priority team will jump in.</p>
                   
                   <div className="space-y-3 mb-10">
                       {[
                         { id: 'delay',    label: 'Order is significantly delayed', icon: Clock },
                         { id: 'location', label: 'Rider is in the wrong location', icon: MapPin },
                         { id: 'response', label: "Rider isn't responding to calls",  icon: Phone },
                         { id: 'missing',  label: 'Items are missing/wrong in bag', icon: Package },
                         { id: 'safety',   label: 'Safety or Quality concern',      icon: ShieldCheck },
                       ].map((issue) => (
                         <button 
                            key={issue.id}
                            onClick={() => handleReport(issue.id)}
                            disabled={reporting}
                            className="w-full p-4 rounded-[--radius-xl] bg-bg-secondary border border-border hover:border-danger hover:bg-danger/5 text-left transition-all flex items-center justify-between group"
                         >
                            <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-bg-primary flex items-center justify-center text-text-tertiary group-hover:text-danger border border-border transition-colors">
                                   <issue.icon size={18} />
                               </div>
                               <span className="text-label-sm font-bold text-text-primary">{issue.label}</span>
                            </div>
                            <ChevronRight size={16} className="text-text-tertiary group-hover:text-danger" />
                         </button>
                       ))}
                   </div>

                   <Button 
                     size="lg" 
                     fullWidth 
                     variant="secondary" 
                     onClick={() => setShowSupport(false)}
                     icon={<X size={18} />}
                   >
                       Cancel Support Request
                   </Button>
               </motion.div>
            </div>
         )}
      </AnimatePresence>

      <AnimatePresence>
         {showSparkle && (
           <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand/95 backdrop-blur-xl"
              onClick={() => setShowSparkle(false)}
           >
              <motion.div 
                 initial={{ scale: 0.8, y: 50 }}
                 animate={{ scale: 1, y: 0 }}
                 transition={{ type: "spring", damping: 14, stiffness: 200 }}
                 className="bg-bg-primary p-10 rounded-[--radius-3xl] shadow-[0_20px_60px_rgba(0,0,0,0.3)] text-center max-w-sm w-full relative overflow-hidden border-2 border-white/10"
              >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent pointer-events-none" />
                  
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="text-8xl drop-shadow-2xl mx-auto mb-6"
                  >
                     🐕
                  </motion.div>
                  
                  <h2 className="text-display font-black text-text-primary tracking-tight mb-3">Get the leash ready!</h2>
                  <p className="text-body-lg text-text-secondary mb-10 leading-relaxed font-medium">Rahul is right around the corner. We'll be at your door in less than a minute.</p>
                  <Button size="xl" fullWidth variant="brand" className="shadow-[0_10px_30px_rgba(255,107,0,0.3)]" onClick={() => setShowSparkle(false)}>I'm Ready!</Button>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// B2. CANCELLATION BUTTON COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function CancellationButton({ orderId, createdAt, status, onCancel }: { orderId: string, createdAt: string, status: string, onCancel: () => void }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    return Math.max(0, 120 - Math.floor((now - created) / 1000));
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 || !['pending', 'placed', 'confirmed'].includes(status)) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, status]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order for a full refund?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Order Cancelled Successfully');
        onCancel();
      } else {
        toast.error(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      toast.error('Connection Error');
    } finally {
      setLoading(false);
    }
  };

  if (timeLeft <= 0 || !['pending', 'placed', 'confirmed'].includes(status)) return null;

  return (
    <motion.button 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={handleCancel}
      disabled={loading}
      className="flex-1 py-4 bg-danger/10 border border-danger/20 text-danger text-label-sm font-black uppercase tracking-widest rounded-[--radius-lg] relative overflow-hidden group hover:bg-danger/20 transition-all"
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
         {loading ? 'Processing...' : `Cancel (${timeLeft}s)`}
      </span>
      {/* Visual Timer Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-danger/40"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: timeLeft, ease: 'linear' }}
      />
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// C. PAST ORDER ITEM
// ═══════════════════════════════════════════════════════════════════════════════

const HistoryItem = memo(function HistoryItem({ order, onSelect }: { order: any; onSelect: (o: any) => void }) {
  const addItem = useCartStore(state => state.addItem);
  const router = useRouter();

  const handleReorder = (e: React.MouseEvent) => {
    e.stopPropagation();
    order.items?.forEach((item: any) => {
       addItem({
          product: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          stock: undefined,
       });
    });
    toast.success('Items added to cart!');
    router.push('/checkout');
  };

  return (
    <div className="w-full flex items-center justify-between p-5 bg-bg-elevated border border-border hover:border-brand transition-colors rounded-[--radius-xl] shadow-sm hover:shadow-md group relative">
       <button onClick={() => onSelect(order)} className="absolute inset-0 z-0" />
       
       <div className="flex gap-4 items-center relative z-10 pointer-events-none">
          <div className="w-14 h-14 bg-bg-secondary rounded-[--radius-lg] flex items-center justify-center border border-border group-hover:scale-105 transition-transform">
             <Package size={22} className="text-text-tertiary" />
          </div>
          <div className="text-left">
             <p className="text-label-lg font-bold text-text-primary line-clamp-1">{order.items?.[0]?.name}</p>
             <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
       </div>

       <div className="text-right flex items-center gap-6 relative z-10">
          <div className="flex flex-col items-end gap-1.5">
             <p className="text-label-lg font-black text-text-primary">₹{order.total}</p>
             <Badge variant={order.orderStatus === 'cancelled' ? 'danger' : 'success'} size="sm">{order.orderStatus}</Badge>
          </div>
          
          <Button 
             variant="brand" 
             size="sm" 
             icon={<RotateCcw size={14} />} 
             onClick={handleReorder}
             className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity"
          >
             Reorder
          </Button>
       </div>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function UserOrdersDashboard({ initialOrders, userName }: { initialOrders: any[]; userName: string; }) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { permission, requestPermission } = useNotifications();
  
  const queryClient = useQueryClient();

  // Primary fresh data via React Query
  const { data: orders = [] } = useQuery({
    queryKey: ['orders', 'user'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      const json = await res.json();
      return json.success ? json.data : [];
    },
    initialData: initialOrders,
  });

  const { data: referralData } = useQuery({
    queryKey: ['user', 'referrals'],
    queryFn: async () => {
       const res = await fetch('/api/user/referrals');
       const json = await res.json();
       return json.success ? json.data : null;
    }
  });

  const handleStatusChange = useCallback((id: string, status: string) => {
    queryClient.setQueryData(['orders', 'user'], (old: any[]) => 
      (old || []).map(o => o._id === id ? { ...o, orderStatus: status } : o)
    );
  }, [queryClient]);

  const activeOrders = useMemo(() => orders.filter((o: any) => !['delivered', 'cancelled'].includes(o.orderStatus)), [orders]);
  const pastOrders = useMemo(() => orders.filter((o: any) => ['delivered', 'cancelled'].includes(o.orderStatus)), [orders]);
  const primaryActive = activeOrders[0] ?? null;

  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-24 pt-6">
      
      {/* Dynamic Notification Permission Bar */}
      {permission === 'default' && primaryActive && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden mb-8"
          >
             <div className="bg-brand text-white p-4 rounded-[--radius-2xl] flex items-center justify-between shadow-[0_10px_30px_rgba(255,107,0,0.2)]">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                       <Bell size={20} className="fill-white" />
                    </div>
                    <div>
                       <p className="text-label-sm font-black uppercase tracking-wider">Enable Live Mission Alerts</p>
                       <p className="text-[11px] font-medium opacity-80 mt-0.5">Get a ping on your browser when 🛵🐕 Rahul arrives.</p>
                    </div>
                 </div>
                 <button 
                   onClick={requestPermission}
                   className="px-4 py-2 bg-white text-brand rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                 >
                    Turn On
                 </button>
             </div>
          </motion.div>
      )}

      {/* Referral & Wallet Card */}
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="bg-bg-secondary border border-border/50 rounded-[--radius-3xl] p-8 shadow-xl relative overflow-hidden"
       >
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Gift size={200} />
          </div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
                   <Sparkles className="text-brand fill-brand" />
                </div>
                <div>
                   <h2 className="text-h4 font-black tracking-tight text-text-primary uppercase italic">Invite a Fellow Pet Parent</h2>
                   <p className="text-body-sm text-text-secondary">They get ₹100, You get ₹100 in <span className="text-brand font-bold">Pet Cash</span> 🐾</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-bg-elevated/50 p-4 rounded-[--radius-2xl] border border-border/30">
                   <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-1">Your Balance</p>
                   <div className="flex items-center gap-2">
                       <WalletIcon size={16} className="text-brand" />
                       <span className="text-h4 font-black">₹{referralData?.walletBalance?.toLocaleString() || '0'}</span>
                   </div>
                </div>
                <div className="bg-bg-elevated p-4 rounded-[--radius-2xl] border-2 border-brand/20 relative group">
                   <p className="text-[10px] font-black uppercase tracking-widest text-brand mb-1">Your Code</p>
                   <div className="flex items-center justify-between">
                      <span className="text-h4 font-black tracking-widest font-mono text-brand">{referralData?.referralCode || '...'}</span>
                      <button 
                        onClick={() => {
                           navigator.clipboard.writeText(referralData?.referralCode || '');
                           toast.success('Code copied to clipboard! 📋');
                        }}
                        className="p-2 hover:bg-brand/10 rounded-lg transition-colors"
                      >
                         <Copy size={16} className="text-brand" />
                      </button>
                   </div>
                </div>
             </div>

             <Button 
               variant="secondary" 
               fullWidth
               onClick={() => {
                  const msg = `Hey! Use my code ${referralData?.referralCode} to get ₹100 off on your first order at PetShop! 🐾`;
                  if (navigator.share) {
                     navigator.share({ title: 'Join PetShop', text: msg, url: window.location.origin });
                  } else {
                     navigator.clipboard.writeText(msg);
                     toast.success('Referral message copied! 🐾');
                  }
               }}
               className="gap-3"
             >
                <Share2 size={16} /> Share Invitation
             </Button>
          </div>
       </motion.div>

      {primaryActive ? (
         <div className="space-y-6">
            <ActiveOrderCard order={primaryActive} onStatusChange={handleStatusChange} />
         </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 bg-bg-elevated rounded-[--radius-3xl] border border-dashed border-border text-center shadow-sm">
            <span className="text-6xl mb-6 drop-shadow-md">🐾</span>
            <h2 className="text-display font-black text-text-primary mb-3 tracking-tight">No Active Missions</h2>
            <p className="text-body-lg text-text-secondary mb-8">Looks like your pets are all stocked up right now.</p>
            <Link href="/products"><Button variant="brand" size="xl" className="px-10 shadow-[0_10px_20px_rgba(255,107,0,0.15)]">Treat Them Now</Button></Link>
        </div>
      )}

      {pastOrders.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-h3 font-black text-text-primary tracking-tight">Previous Hauls</h2>
          <div className="space-y-4">
             {pastOrders.slice(0, 5).map((o: any) => <HistoryItem key={o._id} order={o} onSelect={setSelectedOrder} />)}
          </div>
        </section>
      )}
    </div>
  );
}
