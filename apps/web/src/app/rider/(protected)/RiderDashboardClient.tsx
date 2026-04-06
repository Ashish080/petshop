'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Truck, CheckCircle, Clock, MapPin, Zap, 
    ExternalLink, Navigation, WifiOff, RefreshCcw,
    Medal, Trophy, Award, Gift
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { motionPresets } from '@/lib/motion';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import toast from 'react-hot-toast';
import { LeaderboardView } from '@/components/rider/LeaderboardView';

type RiderTab = 'active' | 'available' | 'leaderboard';

export default function RiderDashboardClient({ user, allOrders, availableOrders }: any) {
  const [activeTab, setActiveTab] = useState<RiderTab>('active');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const { isOnline, isSyncing, pendingCount, syncRequest } = useOfflineSync();

  const activeOrders = allOrders.filter((o: any) =>
    ['accepted', 'picked', 'out-for-delivery'].includes(o.orderStatus)
  );
  
  const completedToday = allOrders.filter((o: any) => {
    if (o.orderStatus !== 'delivered') return false;
    const updated = new Date(o.updatedAt);
    const today = new Date();
    return updated.toDateString() === today.toDateString();
  });

  const todayEarnings = completedToday.reduce((sum: number, o: any) => sum + (o.total || 0) * 0.05, 0); 

  const updateOrderStatus = async (orderId: string, status: string) => {
    setLoadingAction(orderId);
    const url = `/api/rider/orders/${orderId}`;
    const success = await syncRequest(url, 'PATCH', { status });
    
    if (success) {
      toast.success(`Mission marked as ${status} 🐾`);
      window.location.reload();
    }
    setLoadingAction(null);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-bg-primary font-sans relative overflow-x-hidden pb-24">
      
      {/* Live Status Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-bg-primary/90 backdrop-blur-xl border-b border-border px-5 py-4 flex items-center justify-between"
      >
        <div>
           <p className="text-label-sm text-text-tertiary uppercase tracking-wider">{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
           <h1 className="text-h4 font-black text-text-primary tracking-tight uppercase italic">Fleet HQ</h1>
        </div>
        <div className="flex items-center gap-3">
           <AnimatePresence>
              {isSyncing && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand animate-spin"
                  >
                     <RefreshCcw size={14} />
                  </motion.div>
              )}
           </AnimatePresence>
           <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-border ${isOnline ? 'bg-success-muted' : 'bg-danger-muted'}`}>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-success animate-pulse' : 'bg-danger'}`} />
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isOnline ? 'text-success' : 'text-danger'}`}>
                 {isOnline ? 'Active' : 'Offline'}
              </span>
           </div>
        </div>
      </motion.div>

      {/* Offline Alert Strip */}
      <AnimatePresence>
         {!isOnline && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-danger text-white px-5 py-2 flex items-center justify-between overflow-hidden"
            >
                <div className="flex items-center gap-2">
                   <WifiOff size={14} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/90 font-bold">Signal Lost • Sync Enabled</span>
                </div>
                {pendingCount > 0 && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black uppercase">{pendingCount} Queued</span>}
            </motion.div>
         )}
      </AnimatePresence>

      <div className="p-5 space-y-8">
        
        {/* Earnings Card (Hidden on Leaderboard for focus) */}
        {activeTab !== 'leaderboard' && (
           <motion.div 
             {...motionPresets.fadeUp}
             className="bg-bg-elevated border border-border overflow-hidden rounded-[--radius-2xl] shadow-md relative"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-success/20 blur-[50px] pointer-events-none -mr-10 -mt-10" />
              <div className="p-6 relative z-10 flex flex-col gap-1">
                 <span className="text-label-sm uppercase tracking-widest text-text-tertiary font-black italic">Today's Revenue</span>
                 <div className="text-display font-black text-text-primary leading-none flex items-center">
                     <span className="text-text-tertiary text-h3 font-medium mr-1 tracking-normal">₹</span>
                     <AnimatedCounter value={todayEarnings > 0 ? todayEarnings : 0} />
                 </div>
              </div>
              <div className="bg-bg-secondary px-6 py-3 border-t border-border flex items-center justify-between">
                 <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">{completedToday.length} Deployments</span>
                 <button className="text-[10px] font-black tracking-wider text-brand uppercase bg-brand/5 px-3 py-1 rounded-lg">Wallet Detail</button>
              </div>
           </motion.div>
        )}

        {/* Improved 3-Tab Segmented Control */}
        <div className="flex bg-bg-secondary p-1 rounded-full border border-border shadow-inner">
           {(['active', 'available', 'leaderboard'] as const).map((tab) => (
               <button 
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`flex-1 py-3 px-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-white' : 'text-text-tertiary hover:text-text-primary'}`}
               >
                  {activeTab === tab && (
                      <motion.div layoutId="riderTab" className="absolute inset-0 bg-text-primary rounded-full shadow-lg" transition={{ type: "spring", stiffness: 350, damping: 25 }} />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-1.5 whitespace-nowrap">
                     {tab === 'active' && <Zap size={12} className={activeTab === tab ? 'text-brand' : ''} />}
                     {tab === 'available' && <Truck size={12} className={activeTab === tab ? 'text-info' : ''} />}
                     {tab === 'leaderboard' && <Award size={12} className={activeTab === tab ? 'text-warning' : ''} />}
                     {tab === 'active' ? 'Pipeline' : tab === 'available' ? 'Available' : 'Legends'}
                     {tab === 'active' && activeOrders.length > 0 && <span className="bg-brand text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold">{activeOrders.length}</span>}
                     {tab === 'available' && availableOrders.length > 0 && <span className="bg-warning text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold">{availableOrders.length}</span>}
                  </span>
               </button>
           ))}
        </div>

        {/* Content Pane */}
        <div className="min-h-[400px]">
           <AnimatePresence mode="wait">
              {activeTab === 'leaderboard' ? (
                 <motion.div key="leaderboard" {...motionPresets.fadeUp}>
                    <LeaderboardView />
                 </motion.div>
              ) : activeTab === 'active' ? (
                 <motion.div key="active" {...motionPresets.fadeUp}>
                    {activeOrders.length > 0 ? (
                       <div className="relative pt-4">
                           {activeOrders.slice(0, 3).map((order: any, idx: number) => {
                               const isTop = idx === 0;
                               return (
                                   <motion.div
                                     key={order._id}
                                     initial={{ scale: 0.9, y: 30, opacity: 0 }}
                                     animate={{ 
                                         scale: 1 - (idx * 0.05), 
                                         y: idx * 25, 
                                         opacity: 1 - (idx * 0.2),
                                         zIndex: 10 - idx
                                     }}
                                     className={`absolute top-0 left-0 w-full bg-bg-elevated border border-border shadow-xl rounded-[--radius-2xl] overflow-hidden ${!isTop && 'pointer-events-none'}`}
                                   >
                                       <div className="p-6">
                                           <div className="flex justify-between items-start mb-4">
                                               <Badge variant="warning">{order.orderStatus.replace('-', ' ').toUpperCase()}</Badge>
                                               <span className="text-h3 font-black text-text-primary">₹{order.total}</span>
                                           </div>
                                           <div className="space-y-4">
                                               <div className="flex items-start gap-3">
                                                   <MapPin size={20} className="text-text-tertiary shrink-0 mt-0.5" />
                                                   <div>
                                                       <h3 className="text-label-lg font-bold text-text-primary leading-tight">{order.shippingAddress?.street}</h3>
                                                       <p className="text-body-sm text-text-tertiary mt-0.5">{order.shippingAddress?.city}</p>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                       <div className="p-4 bg-bg-secondary border-t border-border flex flex-col gap-3">
                                           <Button 
                                             size="lg" 
                                             fullWidth 
                                             variant="brand" 
                                             className="h-16 text-lg font-black italic shadow-lg"
                                             loading={loadingAction === order._id}
                                             onClick={() => updateOrderStatus(order._id, 'delivered')}
                                           >
                                               CONFIRM DELIVERY <CheckCircle size={20} className="ml-2" />
                                           </Button>
                                           <div className="flex gap-2">
                                               <Button variant="secondary" fullWidth icon={<Navigation size={18} />}>Map</Button>
                                               <Button variant="secondary" fullWidth icon={<ExternalLink size={18} />}>Data</Button>
                                           </div>
                                       </div>
                                   </motion.div>
                               );
                           })}
                           <div className="h-[430px]" />
                       </div>
                    ) : (
                       <EmptyState icon={<CheckCircle size={32} />} title="All Clear" desc="No active assignments in your pipeline." />
                    )}
                 </motion.div>
              ) : (
                 <motion.div key="available" {...motionPresets.fadeUp} className="space-y-4 pt-4">
                    {availableOrders.length > 0 ? availableOrders.map((order: any) => (
                       <div key={order._id} className="bg-bg-elevated border border-border shadow-sm rounded-2xl overflow-hidden p-5 flex flex-col gap-4">
                          <div className="flex justify-between items-start">
                             <div>
                                <Badge variant="info">NEARBY</Badge>
                                <h3 className="text-label-lg font-bold text-text-primary mt-2">{order.shippingAddress?.city}</h3>
                             </div>
                             <span className="text-h4 font-black">₹{order.total}</span>
                          </div>
                          <Button size="sm" variant="brand" onClick={() => updateOrderStatus(order._id, 'accepted')} loading={loadingAction === order._id}>Claim Assignment</Button>
                       </div>
                    )) : (
                       <EmptyState icon={<Zap size={32} />} title="Catching Breath" desc="No new assignments detected in this sector." />
                    )}
                 </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, desc }: any) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-12 bg-bg-secondary rounded-[--radius-2xl] border border-dashed border-border mt-4 opacity-60">
             <div className="mb-4 text-text-tertiary">{icon}</div>
             <h3 className="text-label-lg font-black uppercase tracking-tighter italic text-text-tertiary">{title}</h3>
             <p className="text-body-xs text-text-disabled mt-1 uppercase font-bold tracking-widest">{desc}</p>
        </div>
    );
}
