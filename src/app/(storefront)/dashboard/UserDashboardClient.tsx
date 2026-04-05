'use client';

import { useState, useEffect } from 'react';
import { 
  Package, Truck, CheckCircle, Clock, Star, MapPin, 
  ChevronRight, ArrowRight, ShoppingBag, ShieldCheck, 
  MessageSquare, History, Tag, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function UserDashboardClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState<string | null>(null);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const result = await res.json();
      if (result.success) setOrders(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Poll every 30s for tracking
    return () => clearInterval(interval);
  }, []);

  const submitFeedback = async (orderId: string) => {
    const res = await fetch(`/api/orders/${orderId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback)
    });
    const result = await res.json();
    if (result.success) {
        toast.success('Mission Feedback Logged');
        setShowFeedbackModal(null);
        fetchOrders();
    } else {
        toast.error(result.error || 'Feedback transmission failed');
    }
  };

  if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
          <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-white border border-zinc-100 rounded-[32px] flex items-center justify-center animate-pulse shadow-2xl">
                  <Activity size={32} className="text-emerald-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Syncing Personal Mission Archive...</p>
          </div>
      </div>
  );

  const activeOrders = orders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');
  const pastOrders = orders.filter(o => o.orderStatus === 'delivered');

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 lg:py-24 space-y-16 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full border border-emerald-100 mb-6 group cursor-pointer hover:bg-emerald-600 hover:text-white transition-all">
                <ShieldCheck size={14} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified Identity Node</span>
           </div>
           <h1 className="text-5xl font-black text-zinc-900 tracking-tighter italic">Mission Hub</h1>
           <p className="text-zinc-500 font-bold text-lg mt-2 max-w-md leading-relaxed">Secure gateway to your order history and live logistical tracking metrics.</p>
        </div>
        <div className="flex gap-4">
            <Link href="/products" className="bg-zinc-950 text-white rounded-2xl px-10 py-5 font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-zinc-950/20">
                New Mission <Tag size={16} />
            </Link>
        </div>
      </header>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-500/5 relative overflow-hidden group">
              <div className="mb-8 w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform">
                  <History size={24} />
              </div>
              <div>
                  <span className="text-4xl font-black text-zinc-900 block tracking-tighter">{orders.length}</span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mt-1">Total Deployments</span>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] text-zinc-900 group-hover:translate-x-2 transition-transform pointer-events-none"><History size={128} /></div>
          </div>
          <div className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-2xl shadow-emerald-600/20 relative overflow-hidden group">
              <div className="mb-8 w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                  <CheckCircle size={24} />
              </div>
              <div>
                  <span className="text-4xl font-black text-white block tracking-tighter">{pastOrders.length}</span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-emerald-100 mt-1">Successful Missions</span>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10 text-white group-hover:translate-x-2 transition-transform pointer-events-none"><CheckCircle size={128} /></div>
          </div>
          <div className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-xl shadow-zinc-500/5 relative overflow-hidden group">
              <div className="mb-8 w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center border border-orange-100 group-hover:scale-110 transition-transform">
                  <Activity size={24} />
              </div>
              <div>
                  <span className="text-4xl font-black text-zinc-900 block tracking-tighter">{activeOrders.length}</span>
                  <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mt-1">Active Deliveries</span>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] text-zinc-900 group-hover:translate-x-2 transition-transform pointer-events-none"><Activity size={128} /></div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Live Tracking */}
        <section className="lg:col-span-12">
            <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-3 italic">
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping"></div>
                    Deployments in Transit
                </h2>
                <Link href="/orders" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-indigo-600 transition-colors flex items-center gap-2">View Full Archives <ChevronRight size={14} /></Link>
            </div>
            {activeOrders.length === 0 ? (
                <div className="bg-zinc-50 rounded-[48px] p-20 border border-dashed border-zinc-200 text-center group active:scale-[0.99] transition-transform">
                    <div className="w-24 h-24 bg-white border border-zinc-100 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl text-zinc-200 group-hover:scale-110 transition-transform">
                        <ShoppingBag size={48} strokeWidth={1} />
                    </div>
                    <h3 className="text-2xl font-black text-zinc-900 mb-2">No Active Missions</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 leading-relaxed max-w-xs mx-auto">Tactical pipeline is clear. Start a new deployment from the storefront.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {activeOrders.map((order, i) => (
                        <div key={order._id} className="bg-white rounded-[40px] p-10 border border-zinc-100 shadow-2xl shadow-zinc-500/5 group">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                       <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 uppercase tracking-widest">{order.orderStatus}</span>
                                       <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">ID: {order.orderNumber?.slice(-8)}</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-zinc-900 tracking-tight mb-2 italic">{order.items[0]?.name}{order.items.length > 1 ? ` +${order.items.length-1} more` : ''}</h3>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                        <MapPin size={12} className="text-indigo-600" /> {order.shippingAddress.street}, {order.shippingAddress.city}
                                    </div>
                                </div>
                                <div className="lg:w-96">
                                    {/* Tracking Stepper */}
                                    <div className="flex items-center justify-between relative">
                                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-100 -translate-y-1/2 -z-0"></div>
                                        {['pending', 'confirmed', 'picked', 'out-for-delivery', 'delivered'].map((s, idx) => {
                                           const steps = ['pending', 'confirmed', 'accepted', 'picked', 'out-for-delivery', 'delivered'];
                                           const currentIdx = steps.indexOf(order.orderStatus);
                                           const thisIdx = steps.indexOf(s);
                                           const isDone = thisIdx <= currentIdx;
                                           const isActive = thisIdx === currentIdx;
                                           
                                           return (
                                              <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                                                 <div className={`w-8 h-8 rounded-xl border-4 border-white shadow-lg flex items-center justify-center transition-all duration-700 ${isDone ? 'bg-indigo-600 text-white scale-110' : 'bg-zinc-100 text-zinc-400'}`}>
                                                     {isDone ? <CheckCircle size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>}
                                                 </div>
                                                 <span className={`text-[8px] font-black uppercase tracking-widest whitespace-nowrap hidden md:block ${isActive ? 'text-indigo-600' : 'text-zinc-400'}`}>{s.replace('-', ' ')}</span>
                                              </div>
                                           );
                                        })}
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <button className="w-16 h-16 bg-zinc-50 border border-zinc-100 text-zinc-900 rounded-[22px] flex items-center justify-center group-hover:bg-zinc-950 group-hover:text-white transition-all shadow-inner group-hover:shadow-2xl group-hover:scale-105 active:scale-95">
                                        <ArrowRight size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>

        {/* History & Feedback */}
        <section className="lg:col-span-12">
            <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-2xl font-black text-zinc-900 tracking-tight italic">Completed Archive</h2>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{pastOrders.length} Successfully Deployed</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastOrders.map((order) => (
                    <div key={order._id} className="bg-white rounded-[32px] p-8 border border-zinc-100 shadow-xl shadow-zinc-500/5 group hover:border-emerald-500 transition-all">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-zinc-50 rounded-2xl p-1.5 border border-zinc-100 relative group-hover:scale-110 transition-transform">
                                <img src={order.items[0]?.image || 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=200&auto=format&fit=crop'} alt="order-item" className="w-full h-full object-cover rounded-xl" />
                                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-lg"><CheckCircle size={12} /></div>
                            </div>
                            <span className="text-sm font-black text-zinc-900">₹{order.total}</span>
                        </div>
                        <h4 className="font-black text-zinc-900 text-lg tracking-tight mb-1 truncate">{order.items[0]?.name}</h4>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-6">{new Date(order.createdAt).toLocaleDateString()}</p>
                        
                        {order.feedback ? (
                           <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex items-center justify-between">
                               <div className="flex gap-1 text-emerald-600">
                                   {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < order.feedback.rating ? 'currentColor' : 'none'} strokeWidth={3} />)}
                               </div>
                               <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic">Mission Evaluated</span>
                           </div>
                        ) : (
                           <button 
                            onClick={() => setShowFeedbackModal(order._id)}
                            className="w-full py-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-[0.98]"
                           >
                               <MessageSquare size={14} /> Mission Debriefing
                           </button>
                        )}
                    </div>
                ))}
            </div>
        </section>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-3xl p-6">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }} 
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="bg-white rounded-[48px] p-12 max-w-xl w-full relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-24 bg-emerald-600 opacity-5 -z-0"></div>
                    <div className="relative z-10 text-center">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-emerald-100 ring-8 ring-emerald-50/50">
                            <MessageSquare size={32} />
                        </div>
                        <h3 className="text-3xl font-black text-zinc-900 tracking-tighter mb-2 italic">Mission Debriefing</h3>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-loose mb-10">Intelligence Evaluation for Order #{showFeedbackModal.slice(-8)}</p>

                        <div className="space-y-10">
                            <div className="flex flex-col items-center gap-4">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Satisfaction Protocol (1-5)</label>
                                <div className="flex gap-4">
                                    {[1,2,3,4,5].map(star => (
                                        <button 
                                            key={star} 
                                            onClick={() => setFeedback({...feedback, rating: star})}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${feedback.rating >= star ? 'bg-emerald-600 text-white scale-110 shadow-2xl' : 'bg-zinc-100 text-zinc-300'}`}
                                        >
                                            <Star size={20} fill={feedback.rating >= star ? 'currentColor' : 'none'} strokeWidth={3} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block text-left">Detailed Intelligence / Comments</label>
                                <textarea 
                                    placeholder="Execute verbal feedback transmission..."
                                    className="w-full bg-zinc-50 border border-zinc-100 rounded-[28px] p-6 text-sm font-bold text-zinc-900 focus:outline-none focus:border-emerald-600 min-h-[150px] shadow-inner"
                                    value={feedback.comment}
                                    onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={() => setShowFeedbackModal(null)}
                                    className="flex-1 py-6 rounded-[28px] font-black text-[10px] uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors"
                                >
                                    Abort
                                </button>
                                <button 
                                    onClick={() => submitFeedback(showFeedbackModal)}
                                    className="flex-2 w-[60%] bg-zinc-950 text-white rounded-[28px] py-6 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-zinc-950/20 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    Transmit Intel <CheckCircle size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
