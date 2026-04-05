'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Search, ChevronRight, X, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_CONFIG: Record<string, { label: string, icon: any, color: string }> = {
    placed: { label: 'Order Placed', icon: Clock, color: 'slate' },
    accepted: { label: 'Assigned to Rider', icon: Zap, color: 'indigo' },
    picked: { label: 'In Transit', icon: Package, color: 'amber' },
    'out-for-delivery': { label: 'Nearing Target', icon: Truck, color: 'sky' },
    delivered: { label: 'Delivered Successfully', icon: CheckCircle, color: 'emerald' },
    cancelled: { label: 'Mission Terminated', icon: X, color: 'rose' }
};

export default function OrdersClient({ orders: initialOrders }: { orders: any[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [liveOrder, setLiveOrder] = useState<any>(null);
    const [polling, setPolling] = useState(false);

    useEffect(() => {
        if (!selectedOrderId) {
            setLiveOrder(null);
            setPolling(false);
            return;
        }

        const fetchLiveOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${selectedOrderId}`);
                const data = await res.json();
                if (data.success) {
                    setLiveOrder(data.data);
                    if (data.data.orderStatus === 'delivered' || data.data.orderStatus === 'cancelled') {
                        setPolling(false);
                    } else {
                        setPolling(true);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchLiveOrder();
        const interval = setInterval(fetchLiveOrder, 5000);
        return () => clearInterval(interval);
    }, [selectedOrderId]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
            {/* List */}
            <div className={`lg:col-span-2 space-y-6 ${selectedOrderId ? 'hidden lg:block' : 'block'}`}>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div 
                            key={order._id} 
                            onClick={() => setSelectedOrderId(order._id)}
                            className={`group relative bg-white p-8 rounded-[40px] border transition-all cursor-pointer hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/10 active:scale-[0.99] ${selectedOrderId === order._id ? 'border-2 border-indigo-600 shadow-2xl shadow-indigo-500/10' : 'border-slate-100 shadow-xl shadow-slate-200/20'}`}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-slate-50 rounded-[22px] p-2 border border-slate-100 flex items-center justify-center text-slate-300">
                                        <Package size={28} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">#{order.orderNumber.slice(-8)}</span>
                                            <span className="text-[10px] font-bold text-slate-400 capitalize bg-slate-50 px-2.5 py-1 rounded-full">{order.orderStatus.replace('-', ' ')}</span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{order.items[0]?.name}{order.items.length > 1 ? ` +${order.items.length-1} more` : ''}</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-2 italic">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col items-end gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                                    <span className="text-2xl font-black text-slate-900 leading-none">₹ {order.total}</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Total</span>
                                </div>
                            </div>
                            <div className="absolute top-1/2 right-6 -translate-y-1/2 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all hidden lg:block">
                                <ChevronRight size={28} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-[60px] border border-dashed border-slate-200 shadow-inner">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                            <Search size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">No Order Logs</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest max-w-[180px] mx-auto leading-relaxed">Your mission history is currently empty.</p>
                    </div>
                )}
            </div>

            {/* Tracker Panel */}
            <div className={`lg:col-span-1 h-fit lg:sticky lg:top-24 transition-all duration-500 ${selectedOrderId ? 'block animate-in fade-in slide-in-from-right-4' : 'hidden md:opacity-40'}`}>
                <AnimatePresence mode="wait">
                    {liveOrder ? (
                        <motion.div 
                            key="tracker"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-white rounded-[50px] p-10 border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.05)] overflow-hidden relative group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-[60px] -mr-16 -mt-16"></div>
                            
                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className="space-y-1.5">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">Logistic Progress</h4>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">Live Tracking</h2>
                                </div>
                                <button onClick={() => setSelectedOrderId(null)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-rose-500 transition-colors lg:hidden">
                                     <X size={20} />
                                </button>
                                {polling && <div className="h-2 w-2 bg-indigo-600 rounded-full animate-ping absolute top-0 -left-6"></div>}
                            </div>

                            <div className="relative space-y-10 pl-8 border-l-2 border-slate-100 pb-2">
                                {['placed', 'accepted', 'picked', 'out-for-delivery', 'delivered'].map((s, i) => {
                                    const cfg = STATUS_CONFIG[s];
                                    const currentIdx = ['placed', 'accepted', 'picked', 'out-for-delivery', 'delivered'].indexOf(liveOrder.orderStatus);
                                    const isDone = i <= currentIdx;
                                    const isActive = i === currentIdx;

                                    return (
                                        <div key={s} className="relative group/step">
                                            <div className={`absolute -left-[45px] top-0 w-8 h-8 rounded-full border-4 bg-white flex items-center justify-center transition-all duration-700 z-10 ${isDone ? 'border-indigo-600 bg-indigo-600 shadow-xl shadow-indigo-500/20' : 'border-slate-50'}`}>
                                                 {isDone && <CheckCircle size={14} className="text-white" />}
                                            </div>
                                            {isActive && !isDone && <div className="absolute -left-[49px] -top-1 w-10 h-10 border-2 border-indigo-600/10 rounded-full animate-ping"></div>}
                                            
                                            <div>
                                                <h5 className={`text-sm font-black transition-colors ${isDone ? 'text-slate-900' : 'text-slate-300'}`}>{cfg.label}</h5>
                                                {isActive && (
                                                    <div className="mt-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100/50 flex items-center gap-4 animate-in slide-in-from-left-4 duration-500">
                                                        <cfg.icon className="text-indigo-600 shrink-0" size={24} />
                                                        <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest leading-loose">Synchronizing with field units...</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-12 pt-10 border-t border-slate-50">
                                <div className="flex items-center gap-5 group/rider">
                                    <div className="w-16 h-16 rounded-[22px] bg-indigo-50 border border-indigo-100 overflow-hidden relative shadow-lg shadow-indigo-500/5 transition-transform group-hover/rider:scale-110">
                                        <img src={`https://ui-avatars.com/api/?name=${liveOrder.riderId || 'Rider'}&background=random`} alt="rider" />
                                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full"></div>
                                    </div>
                                    <div>
                                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tactical Delivery Hub</span>
                                         <h5 className="text-lg font-black text-slate-900 tracking-tight">{liveOrder.riderId ? 'Active Agent Assigned' : 'Awaiting Deployment'}</h5>
                                         <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mt-1">Real-time coordinates active</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-indigo-900 rounded-[50px] p-16 text-center text-white relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10"></div>
                            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                            
                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10 backdrop-blur-3xl animate-bounce">
                                    <MapPin size={36} className="text-indigo-400" />
                                </div>
                                <h3 className="text-2xl font-black mb-4 italic tracking-tighter">Mission Status</h3>
                                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] leading-loose max-w-[150px] mx-auto mb-10 opacity-60">Select an identification code to initiate live tracking synchronization.</p>
                                
                                <button className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3">
                                    Continue Monitoring <ArrowRight size={16} strokeWidth={3} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
