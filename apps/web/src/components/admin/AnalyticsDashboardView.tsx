'use client';

import { useState } from 'react';
import { 
    LayoutDashboard, TrendingUp, Users, ShoppingBag, 
    ArrowUpRight, ArrowDownRight, Activity, 
    PieChart, BarChart3, Target, Zap, 
    Calendar, RefreshCcw, Download,
    Search, Filter, ChevronDown, CheckCircle2,
    Package, Truck, Star, MousePointer2,
    Clock, Cpu, Binary, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Cell, AreaChart, Area 
} from 'recharts';

const data = [
    { name: 'MON', revenue: 4200, missions: 12 },
    { name: 'TUE', revenue: 5800, missions: 18 },
    { name: 'WED', revenue: 4900, missions: 15 },
    { name: 'THU', revenue: 7200, missions: 24 },
    { name: 'FRI', revenue: 8100, missions: 28 },
    { name: 'SAT', revenue: 9400, missions: 32 },
    { name: 'SUN', revenue: 8800, missions: 30 },
];

export function AnalyticsDashboardView() {
    const [timeframe, setTimeframe] = useState('7d');

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* Mission Critical Telemetry Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 relative p-10 glass rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 blur-[100px] rounded-full -mr-40 -mt-40 pointer-events-none" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 bg-brand rounded-full animate-pulse shadow-[0_0_10px_rgba(255,107,0,0.8)]" />
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">Sector <span className="text-brand">Intelligence</span></h2>
                    </div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">Telemetry Stream: LKO-ALPHA-7</p>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="flex items-center p-1.5 glass border border-white/10 rounded-2xl shadow-2xl backdrop-blur-3xl">
                        {['24h', '7D', '30D', 'YTD'].map((t) => (
                            <button 
                                key={t}
                                onClick={() => setTimeframe(t)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] italic transition-all ${timeframe === t ? 'bg-brand text-white shadow-xl shadow-brand/30' : 'text-white/20 hover:text-white/60'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button className="w-14 h-14 glass border border-white/10 rounded-2xl flex items-center justify-center text-white/20 hover:text-brand hover:border-brand/40 transition-all group">
                        <Download size={22} className="group-hover:translate-y-0.5 transition-transform" />
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
                    title="Mission Load" 
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
                 <div className="lg:col-span-2 glass rounded-[48px] p-10 border border-white/5 relative overflow-hidden group shadow-2xl backdrop-blur-3xl">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 blur-[120px] rounded-full pointer-events-none" />
                     
                     <div className="flex items-center justify-between mb-12 relative z-10">
                         <div>
                             <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">Revenue <span className="text-white/20">Momentum</span></h3>
                             <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] mt-3 italic">Staged Operational Performance</p>
                         </div>
                         <div className="flex items-center gap-8">
                            <LegendItem color="#FF6B00" label="Revenue" />
                            <LegendItem color="#7C5CFC" label="Node Flux" />
                         </div>
                     </div>

                     <div className="h-96 w-full relative z-10 pr-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,107,0,0.05)" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="rgba(255,255,255,0.1)" 
                                    fontSize={10} 
                                    fontWeight="900" 
                                    tickLine={false}
                                    axisLine={false}
                                    dy={15}
                                    tick={{ fill: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'rgba(15, 15, 16, 0.8)', 
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '24px',
                                        fontSize: '11px',
                                        fontWeight: '900',
                                        color: '#fff',
                                        padding: '16px'
                                    }}
                                    itemStyle={{ color: '#fff', textTransform: 'uppercase' }}
                                    cursor={{ stroke: 'rgba(255,107,0,0.2)', strokeWidth: 2 }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#FF6B00" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorRev)" 
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                     </div>
                 </div>

                 {/* Top Products Rank */}
                 <div className="glass rounded-[48px] p-10 border border-white/5 relative overflow-hidden group shadow-2xl backdrop-blur-3xl">
                     <div className="flex items-center gap-3 mb-12">
                        <Activity size={18} className="text-brand" />
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-white leading-none">Apex <span className="text-white/20">Assets</span></h3>
                     </div>
                     <div className="space-y-10 relative z-10">
                         {[
                             { name: 'Puppy Star Kit', sales: 48, growth: '+12%', color: '#FF6B00' },
                             { name: 'Orthopedic Bed', sales: 32, growth: '+4%', color: '#7C5CFC' },
                             { name: 'Premium Salmon', sales: 24, growth: '-2%', color: '#00C48C' },
                             { name: 'Training Toy XL', sales: 18, growth: '+18%', color: '#FFB020' },
                             { name: 'Organic Shampoo', sales: 12, growth: '+8%', color: '#F04438' }
                         ].map((p, i) => (
                             <div key={i} className="group cursor-default">
                                 <div className="flex items-center justify-between mb-4">
                                     <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.1em] italic leading-none">{p.name}</span>
                                     <span className="text-[10px] font-black text-brand uppercase tracking-widest leading-none italic">{p.sales}U</span>
                                 </div>
                                 <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                                     <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(p.sales / 50) * 100}%` }}
                                        transition={{ delay: 0.5 + i * 0.1, duration: 1.5, ease: "circOut" }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: p.color, boxShadow: `0 0 20px ${p.color}40` }}
                                     />
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>

            </div>

             {/* Strategic Insights */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 glass rounded-[48px] p-10 border border-white/5 relative overflow-hidden group shadow-2xl">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-2.5 rounded-2xl bg-danger/10 border border-danger/20">
                            <Activity size={20} className="text-danger animate-pulse" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-white leading-none">Global <span className="text-white/20">Pulse</span></h3>
                    </div>
                    
                    <div className="space-y-10">
                        {[
                            { msg: 'System Ingress: #8921 verified', time: '2M AGO', icon: ShoppingBag, color: '#FF6B00' },
                            { msg: 'Node Beta: Rider Alpha Online', time: '12M AGO', icon: Truck, color: '#00C48C' },
                            { msg: 'Stock Critical: Kit Sequence 7', time: '45M AGO', icon: ShieldAlert, color: '#FFB020' },
                            { msg: 'Objective Reached: Revenue X', time: '1H AGO', icon: Zap, color: '#7C5CFC' }
                        ].map((pulse, i) => (
                            <div key={i} className="flex gap-5 group">
                                <div className="p-3 h-fit rounded-2xl bg-white/[0.03] border border-white/10 group-hover:border-brand/40 group-hover:bg-brand/5 transition-all">
                                    <pulse.icon size={16} style={{ color: pulse.color }} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-white/80 italic uppercase tracking-tight leading-snug group-hover:text-white transition-all">{pulse.msg}</p>
                                    <p className="text-[9px] text-white/20 uppercase font-black tracking-[0.2em] mt-2 italic">{pulse.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <InsightCard 
                        title="Customer Sentiment" 
                        value="98.2%" 
                        description="Deployment satisfaction index across all commercial sectors."
                        icon={Star}
                        color="#FF6B00"
                    />
                    <InsightCard 
                        title="Efficiency Delta" 
                        value="+24.5%" 
                        description="Operational velocity increase following V8 protocol rollout."
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
            className="glass p-10 rounded-[40px] border border-white/5 group relative overflow-hidden shadow-2xl backdrop-blur-3xl"
        >
            <div className="absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full blur-[80px] opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity" style={{ backgroundColor: color }} />
            
            <div className="flex justify-between items-start mb-10 relative z-10">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] italic">{title}</p>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all" style={{ color }}>
                    <Icon size={22} />
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-4xl font-black text-white tracking-tighter mb-4 italic leading-none">{value}</p>
                <div className="flex items-center gap-2">
                    <div className={`flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] italic ${isUp ? 'text-success bg-success/10 border border-success/20' : 'text-danger bg-danger/10 border border-danger/20'}`}>
                        {isUp ? <ArrowUpRight size={10} className="mr-1.5" /> : <ArrowDownRight size={10} className="mr-1.5" />} {trend}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function LegendItem({ color, label }: { color: string, label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] italic">{label}</span>
        </div>
    );
}

function InsightCard({ title, value, description, icon: Icon, color }: any) {
    return (
        <div className="glass rounded-[48px] p-10 border border-white/5 flex flex-col justify-between group overflow-hidden relative shadow-2xl backdrop-blur-3xl">
            <Icon className="absolute -bottom-12 -right-12 w-56 h-56 opacity-[0.02] rotate-12 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700" style={{ color }} />
            
            <div className="relative z-10">
                <h4 className="text-[10px] font-black uppercase tracking-[0.5em] mb-6 italic" style={{ color }}>{title}</h4>
                <div className="flex items-center gap-4">
                    <span className="text-6xl font-black text-white tracking-tighter italic leading-none">{value}</span>
                </div>
            </div>
            
            <p className="relative z-10 text-[10px] text-white/20 leading-relaxed font-black uppercase tracking-widest italic mt-12 group-hover:text-white/40 transition-all">
                {description}
            </p>
        </div>
    );
}
