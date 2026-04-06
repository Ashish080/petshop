'use client';

import { useState } from 'react';
import { 
    LayoutDashboard, TrendingUp, Users, ShoppingBag, 
    ArrowUpRight, ArrowDownRight, Activity, 
    PieChart, BarChart3, Target, Zap, 
    Calendar, RefreshCcw, Download,
    Search, Filter, ChevronDown, CheckCircle2,
    Package, Truck, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { brandConfig } from '@/config/brand';

export function AnalyticsDashboardView() {
    const [timeframe, setTimeframe] = useState('7d');

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Context / Actions Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-h3 font-black text-text-primary tracking-tighter uppercase italic leading-none">Mission Control</h2>
                    <p className="text-label-sm text-text-secondary font-medium tracking-tight mt-1 opacity-80">Real-time performance metrics and growth telemetry</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center p-1 bg-bg-elevated border border-border rounded-xl shadow-sm">
                        {['24h', '7d', '30d'].map((t) => (
                            <button 
                                key={t}
                                onClick={() => setTimeframe(t)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === t ? 'bg-brand text-white shadow-md' : 'text-text-tertiary hover:text-text-primary'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button className="w-10 h-10 bg-bg-elevated border border-border rounded-xl flex items-center justify-center text-text-tertiary hover:text-brand transition-colors shadow-sm">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                 <KPI 
                    title="Gross Revenue" 
                    value="₹1.48L" 
                    trend="+18.4%" 
                    isUp 
                    icon={TrendingUp} 
                    color="brand" 
                 />
                 <KPI 
                    title="Active Missions" 
                    value="42" 
                    trend="+5.2%" 
                    isUp 
                    icon={Zap} 
                    color="info" 
                 />
                 <KPI 
                    title="User Retention" 
                    value="94.2%" 
                    trend="-1.2%" 
                    isUp={false} 
                    icon={Target} 
                    color="success" 
                 />
                 <KPI 
                    title="Avg Delivery Time" 
                    value="24m" 
                    trend="-4m" 
                    isUp 
                    icon={Truck} 
                    color="warning" 
                 />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 
                 {/* Main Revenue Chart (Animated Bars) */}
                 <div className="lg:col-span-2 bg-bg-elevated border border-border rounded-[--radius-3xl] p-8 shadow-sm">
                     <div className="flex items-center justify-between mb-10">
                         <div>
                             <h3 className="text-h4 font-black italic uppercase tracking-tighter text-text-primary">Revenue Momentum</h3>
                             <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest mt-1">Staged daily performance (LKO-REGION)</p>
                         </div>
                         <div className="flex items-center gap-4">
                             <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-brand" />
                                <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Revenue</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-info" />
                                <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Orders</span>
                             </div>
                         </div>
                     </div>

                     <div className="h-64 flex items-end justify-between gap-4">
                         {[12, 18, 11, 24, 28, 19, 32].map((v, i) => (
                             <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                 <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${v * 2.5}px` }}
                                    transition={{ delay: i * 0.1, duration: 1, ease: "circOut" }}
                                    className="w-full bg-brand/10 border-x border-t border-brand/20 group-hover:bg-brand/30 transition-all rounded-t-lg relative"
                                 >
                                     <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-bg-primary border border-border px-2 py-1 rounded text-[10px] font-black text-brand shadow-xl">
                                         ₹{(v * 8).toFixed(1)}k
                                     </div>
                                 </motion.div>
                                 <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Day {i+1}</span>
                             </div>
                         ))}
                     </div>
                 </div>

                 {/* Top Products (Vertical Ranking) */}
                 <div className="bg-bg-elevated border border-border rounded-[--radius-3xl] p-8 shadow-sm">
                     <h3 className="text-h4 font-black italic uppercase tracking-tighter text-text-primary mb-8 underline decoration-brand decoration-4 underline-offset-8">Top Selling</h3>
                     <div className="space-y-6">
                         {[
                             { name: 'Puppy Star Kit', sales: 48, growth: '+12%', color: 'brand' },
                             { name: 'Orthopedic Bed', sales: 32, growth: '+4%', color: 'info' },
                             { name: 'Premium Salmon', sales: 24, growth: '-2%', color: 'success' },
                             { name: 'Training Toy XL', sales: 18, growth: '+18%', color: 'warning' },
                             { name: 'Organic Shampoo', sales: 12, growth: '+8%', color: 'danger' }
                         ].map((p, i) => (
                             <div key={i} className="group cursor-default">
                                 <div className="flex items-center justify-between mb-2">
                                     <span className="text-label-sm font-bold text-text-primary capitalize">{p.name}</span>
                                     <span className="text-[10px] font-black text-brand uppercase tracking-widest">{p.sales} Units</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-bg-secondary rounded-full overflow-hidden border border-border">
                                     <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(p.sales / 50) * 100}%` }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 1.5, ease: "circOut" }}
                                        className={`h-full bg-${p.color} shadow-[0_0_15px_rgba(255,122,0,0.3)]`}
                                     />
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>

            </div>

             {/* Recent Activity Mini Feed */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-bg-elevated border border-border rounded-[--radius-3xl] p-8 shadow-sm">
                    <h3 className="text-h5 font-black italic uppercase tracking-tighter text-text-primary mb-8 flex items-center gap-2">
                        <Activity size={18} className="text-danger" /> System Pulse
                    </h3>
                    <div className="space-y-6">
                        {[
                            { msg: 'New Order #8921 processed', time: '2m ago', type: 'order' },
                            { msg: 'Rider Rahul is now Online', time: '12m ago', type: 'fleet' },
                            { msg: 'Stock low on Puppy Star Kit', time: '45m ago', type: 'alert' },
                            { msg: 'Revenue target reached 🎯', time: '1h ago', type: 'goal' }
                        ].map((pulse, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="w-1 h-8 rounded-full bg-border group-hover:bg-brand transition-colors" />
                                <div>
                                    <p className="text-label-sm font-bold text-text-primary">{pulse.msg}</p>
                                    <p className="text-[10px] text-text-tertiary uppercase font-black tracking-widest mt-1 opacity-60">{pulse.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-bg-elevated border-2 border-brand/10 rounded-[--radius-3xl] p-8 flex flex-col justify-between group overflow-hidden relative shadow-lg shadow-brand/5">
                        <Star className="absolute -bottom-8 -right-8 w-40 h-40 text-brand opacity-5 scale-110 group-hover:rotate-12 transition-transform" />
                        <h4 className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mb-2">Customer Satisfaction</h4>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-display font-black text-text-primary tracking-tighter">4.92</span>
                            <div className="flex gap-1 text-brand">
                                {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="currentColor" />)}
                            </div>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-relaxed font-medium">98.2% of pet parents reported "Instant Happiness" following delivery. Mission Success Rate is at an all-time high.</p>
                    </div>

                    <div className="bg-bg-elevated border border-border rounded-[--radius-3xl] p-8 flex flex-col justify-between group overflow-hidden relative shadow-sm">
                        <Zap className="absolute -bottom-8 -right-8 w-40 h-40 text-info opacity-5 scale-110 group-hover:scale-125 transition-transform" />
                        <h4 className="text-[10px] font-black text-info uppercase tracking-[0.3em] mb-2">Operational Efficiency</h4>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-display font-black text-text-primary tracking-tighter">1.4x</span>
                            <span className="px-3 py-1 bg-info/10 text-info text-label-sm font-black rounded-lg uppercase tracking-widest shadow-sm">Optimized</span>
                        </div>
                        <p className="text-[11px] text-text-secondary leading-relaxed font-medium">New rider routing algorithm has reduced dead-mileage by 14.5% this week. Fuel and time efficiency improving.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPI({ title, value, trend, isUp, icon: Icon, color }: any) {
    const colorMap: any = {
        brand: 'text-brand bg-brand/10',
        info: 'text-info bg-info/10',
        success: 'text-success bg-success/10',
        warning: 'text-warning bg-warning/10',
        danger: 'text-danger bg-danger/10'
    };

    return (
        <div className="bg-bg-elevated border border-border p-6 rounded-[--radius-2xl] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity bg-${color}`} />
            <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">{title}</p>
                <div className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-sm group-hover:scale-110 transition-transform ${colorMap[color]}`}>
                    <Icon size={18} />
                </div>
            </div>
            <div>
                <p className="text-h2 font-black text-text-primary tracking-tight mb-2 italic">{value}</p>
                <div className="flex items-center gap-2">
                    <div className={`flex items-center px-1.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${isUp ? 'text-success bg-success/5 border border-success/10' : 'text-danger bg-danger/5 border border-danger/10'}`}>
                        {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {trend}
                    </div>
                    <span className="text-[9px] text-text-disabled uppercase font-black tracking-widest">vs prev period</span>
                </div>
            </div>
        </div>
    );
}
