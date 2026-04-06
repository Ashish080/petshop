'use client';

import { useState } from 'react';
import { 
    LayoutDashboard, TrendingUp, Users, ShoppingBag, 
    ArrowUpRight, ArrowDownRight, Activity, 
    PieChart, BarChart3, Target, Zap, 
    Calendar, RefreshCcw, Download,
    Search, Filter, ChevronDown, CheckCircle2,
    Package, Truck, Star, MousePointer2,
    Clock, Cpu, Binary
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Cell, AreaChart, Area 
} from 'recharts';

const data = [
    { name: 'Mon', revenue: 4200, missions: 12 },
    { name: 'Tue', revenue: 5800, missions: 18 },
    { name: 'Wed', revenue: 4900, missions: 15 },
    { name: 'Thu', revenue: 7200, missions: 24 },
    { name: 'Fri', revenue: 8100, missions: 28 },
    { name: 'Sat', revenue: 9400, missions: 32 },
    { name: 'Sun', revenue: 8800, missions: 30 },
];

export function AnalyticsDashboardView() {
    const [timeframe, setTimeframe] = useState('7d');

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Mission Critical Telemetry Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 relative p-8 rounded-[32px] bg-white/[0.02] border border-white/5 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[80px] rounded-full -mr-32 -mt-32" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-brand/10 border border-brand/20">
                            <Binary size={18} className="text-brand" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic leading-none">Strategic Vision</h2>
                    </div>
                    <p className="text-xs font-bold text-white/30 uppercase tracking-[0.3em] mt-1">Growth telemetry & operational analytics</p>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="flex items-center p-1.5 bg-black/40 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl">
                        {['24h', '7d', '30d', 'ALL'].map((t) => (
                            <button 
                                key={t}
                                onClick={() => setTimeframe(t)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === t ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'text-white/30 hover:text-white/60'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all group">
                        <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Core KPI Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                 <KPI 
                    title="Gross Revenue" 
                    value="₹14.8M" 
                    trend="+18.4%" 
                    isUp 
                    icon={TrendingUp} 
                    color="#FF6B00" 
                 />
                 <KPI 
                    title="System Load" 
                    value="42%" 
                    trend="-2.1%" 
                    isUp={false} 
                    icon={Cpu} 
                    color="#7C5CFC" 
                 />
                 <KPI 
                    title="User Retention" 
                    value="94.2%" 
                    trend="+5.2%" 
                    isUp 
                    icon={Target} 
                    color="#00C48C" 
                 />
                 <KPI 
                    title="Fulfillment" 
                    value="98.8%" 
                    trend="OPTIMIZED" 
                    isUp 
                    icon={CheckCircle2} 
                    color="#FFB020" 
                 />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 
                 {/* Revenue Momentum Chart */}
                 <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-[32px] p-8 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 blur-[100px] rounded-full pointer-events-none" />
                     
                     <div className="flex items-center justify-between mb-10 relative z-10">
                         <div>
                             <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Revenue Momentum</h3>
                             <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">Staged performance analytics</p>
                         </div>
                         <div className="flex items-center gap-6">
                            <LegendItem color="#FF6B00" label="Revenue" />
                            <LegendItem color="#7C5CFC" label="Missions" />
                         </div>
                     </div>

                     <div className="h-80 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="rgba(255,255,255,0.2)" 
                                    fontSize={10} 
                                    fontWeight="bold" 
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#0F0F10', 
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ stroke: 'rgba(255,107,0,0.2)', strokeWidth: 2 }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#FF6B00" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorRev)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                     </div>
                 </div>

                 {/* Top Products Rank */}
                 <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 relative overflow-hidden group">
                     <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-10">Top Selling</h3>
                     <div className="space-y-8 relative z-10">
                         {[
                             { name: 'Puppy Star Kit', sales: 48, growth: '+12%', color: '#FF6B00' },
                             { name: 'Orthopedic Bed', sales: 32, growth: '+4%', color: '#7C5CFC' },
                             { name: 'Premium Salmon', sales: 24, growth: '-2%', color: '#00C48C' },
                             { name: 'Training Toy XL', sales: 18, growth: '+18%', color: '#FFB020' },
                             { name: 'Organic Shampoo', sales: 12, growth: '+8%', color: '#F04438' }
                         ].map((p, i) => (
                             <div key={i} className="group cursor-default">
                                 <div className="flex items-center justify-between mb-3">
                                     <span className="text-[11px] font-bold text-white/60 uppercase tracking-tight italic">{p.name}</span>
                                     <span className="text-[10px] font-black text-white uppercase tracking-widest">{p.sales} Units</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                     <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(p.sales / 50) * 100}%` }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 1.5, ease: "circOut" }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: p.color, boxShadow: `0 0 15px ${p.color}40` }}
                                     />
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>

            </div>

             {/* Strategic Insights */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white/[0.02] border border-white/5 rounded-[32px] p-8 block group">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 rounded-xl bg-danger/10 border border-danger/20">
                            <Activity size={18} className="text-danger" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-white leading-none">System Pulse</h3>
                    </div>
                    
                    <div className="space-y-8">
                        {[
                            { msg: 'Order #8921 processed', time: '2m ago', icon: ShoppingBag, color: '#FF6B00' },
                            { msg: 'Rider Rahul is now Online', time: '12m ago', icon: Truck, color: '#00C48C' },
                            { msg: 'Stock low on Puppy Star Kit', time: '45m ago', icon: Package, color: '#FFB020' },
                            { msg: 'Revenue target reached 🎯', time: '1h ago', icon: Zap, color: '#7C5CFC' }
                        ].map((pulse, i) => (
                            <div key={i} className="flex gap-4 group">
                                <div className="p-2 h-fit rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition-all">
                                    <pulse.icon size={14} style={{ color: pulse.color }} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white group-hover:text-brand transition-colors">{pulse.msg}</p>
                                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1 italic">{pulse.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <InsightCard 
                        title="Customer Delight" 
                        value="4.92 / 5" 
                        description="98.2% of pet parents reported instant happiness following delivery."
                        icon={Star}
                        color="#FF6B00"
                    />
                    <InsightCard 
                        title="Efficiency Quotient" 
                        value="1.4x" 
                        description="New rider routing algorithm has reduced dead-mileage by 14.5%."
                        icon={Zap}
                        color="#7C5CFC"
                    />
                </div>
            </div>
        </div>
    );
}

function KPI({ title, value, trend, isUp, icon: Icon, color }: any) {
    return (
        <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-[60px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity" style={{ backgroundColor: color }} />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{title}</p>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all" style={{ color }}>
                    <Icon size={20} />
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-3xl font-black text-white tracking-tighter mb-3 italic">{value}</p>
                <div className="flex items-center gap-2">
                    <div className={`flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${isUp ? 'text-success bg-success/10 border border-success/20' : 'text-danger bg-danger/10 border border-danger/20'}`}>
                        {isUp ? <ArrowUpRight size={10} className="mr-1" /> : <ArrowDownRight size={10} className="mr-1" />} {trend}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function LegendItem({ color, label }: { color: string, label: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{label}</span>
        </div>
    );
}

function InsightCard({ title, value, description, icon: Icon, color }: any) {
    return (
        <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 flex flex-col justify-between group overflow-hidden relative shadow-2xl">
            <Icon className="absolute -bottom-10 -right-10 w-48 h-48 opacity-[0.03] rotate-12 group-hover:scale-110 group-hover:-rotate-6 transition-all" style={{ color }} />
            
            <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4" style={{ color }}>{title}</h4>
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl font-black text-white tracking-tighter italic">{value}</span>
                </div>
            </div>
            
            <p className="text-xs text-white/40 leading-relaxed font-bold uppercase tracking-tight italic opacity-60 group-hover:opacity-100 transition-opacity">
                {description}
            </p>
        </div>
    );
}
