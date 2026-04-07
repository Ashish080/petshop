'use client';

import { motion } from 'framer-motion';
import { 
    Zap, TrendingUp, Target, Activity, 
    ShieldAlert, ArrowUpRight, Crosshair,
    Users, ShoppingBag, MapPin, BarChart3, Truck
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/Button';

const DEMAND_DATA = [
    { time: '08:00', demand: 12, predicted: 15 },
    { time: '10:00', demand: 28, predicted: 32 },
    { time: '12:00', demand: 45, predicted: 50 },
    { time: '14:00', demand: 38, predicted: 42 },
    { time: '16:00', demand: 52, predicted: 58 },
    { time: '18:00', demand: 75, predicted: 82 },
    { time: '20:00', demand: 68, predicted: 75 },
];

export function PredictiveDemandView() {
    return (
        <div className="space-y-12 animate-fade-in pb-20">
            {/* 1. AGGRESSIVE INTELLIGENCE HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 p-12 glass rounded-[48px] border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
                
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-2xl bg-brand/10 border border-brand/20 shadow-inner group">
                            <Zap size={22} className="text-brand group-hover:scale-110 transition-transform" />
                        </div>
                        <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Strategic <span className="text-brand">Vision</span></h2>
                    </div>
                    <p className="text-sm font-black text-white/30 uppercase tracking-[0.4em] italic mb-8">AI-Powered Demand forecasting & sector saturation analysis</p>
                    
                    <div className="flex items-center gap-6">
                        <div className="px-5 py-3 glass rounded-2xl border border-white/5 flex items-center gap-3">
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-[0_0_10px_#00C48C]" />
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Core Intelligence: Online</span>
                        </div>
                        <div className="px-5 py-3 glass rounded-2xl border border-white/5 flex items-center gap-3">
                            <Activity size={14} className="text-info" />
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Confidence: 94.2%</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <button className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-black text-[11px] uppercase tracking-[0.2em] italic hover:text-brand hover:border-brand/40 transition-all">
                        Calibrate Engine
                    </button>
                    <button className="h-16 px-10 rounded-2xl bg-brand text-white font-black text-[11px] uppercase tracking-[0.2em] italic shadow-xl shadow-brand/20 hover:translate-x-1 transition-all">
                        Execute Pivot
                    </button>
                </div>
            </div>

            {/* 2. DEMAND VELOCITY GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Real-time Demand Velocity Chart */}
                <div className="lg:col-span-2 glass rounded-[48px] p-10 border border-white/5 relative overflow-hidden shadow-2xl backdrop-blur-3xl min-h-[480px]">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">Demand <span className="text-white/20">Velocity</span></h3>
                            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] mt-3 italic">Live Flow vs Theoretical Peak</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={DEMAND_DATA}>
                                <defs>
                                    <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7C5CFC" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,107,0,0.05)" vertical={false} />
                                <XAxis 
                                    dataKey="time" 
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
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="demand" 
                                    stroke="#FF6B00" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorDemand)" 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="predicted" 
                                    stroke="#7C5CFC" 
                                    strokeWidth={2}
                                    strokeDasharray="8 8"
                                    fillOpacity={1} 
                                    fill="url(#colorPredicted)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sector Saturation Rank */}
                <div className="glass rounded-[48px] p-10 border border-white/5 relative overflow-hidden shadow-2xl flex flex-col justify-between">
                     <div>
                        <div className="flex items-center gap-3 mb-10">
                            <Crosshair size={18} className="text-brand" />
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white leading-none">Sector <span className="text-white/20">Loads</span></h3>
                        </div>
                        <div className="space-y-8">
                            {[
                                { name: 'Sector 7 (North)', load: 88, status: 'CRITICAL', color: '#F04438' },
                                { name: 'Sector 2 (Central)', load: 64, status: 'STABLE', color: '#FF6B00' },
                                { name: 'Sector 4 (West)', load: 42, status: 'OPTIMAL', color: '#00C48C' },
                                { name: 'Sector 9 (East)', load: 18, status: 'IDLE', color: '#7C5CFC' }
                            ].map((s, i) => (
                                <div key={i} className="group cursor-default">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.1em] italic leading-none">{s.name}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest leading-none italic" style={{ color: s.color }}>{s.load}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${s.load}%` }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 1.5, ease: "circOut" }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: s.color, boxShadow: `0 0 20px ${s.color}60` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>

                     <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl mt-12 flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-brand/10">
                            <ShieldAlert size={16} className="text-brand" />
                        </div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-relaxed italic">
                            Sector 7 requires immediate rider reallocation protocol.
                        </p>
                     </div>
                </div>
            </div>

            {/* 3. AI TACTICAL ADVISORY */}
            <div className="glass rounded-[48px] p-12 border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                    <Target size={300} />
                </div>
                
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative z-10">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-brand/20 border border-brand/40 flex items-center justify-center animate-pulse">
                                <Activity size={20} className="text-brand" />
                            </div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">AI Tactical <span className="text-brand">Advisor</span></h3>
                        </div>
                        <p className="text-body-lg text-white/40 leading-relaxed font-bold italic uppercase tracking-tight mb-8">
                            Engine has detected a <span className="text-white">92.4% Saturation Apex</span> in Sector 7. 
                            Current deployment is insufficient to maintain <span className="text-brand font-black">15min Transit Protocol</span>.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-5 glass rounded-2xl border border-white/5 group hover:border-brand/40 transition-all cursor-pointer">
                                <div className="p-2 rounded-lg bg-brand/10 text-brand">
                                    <ArrowUpRight size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white uppercase italic">Status: Critical Load</p>
                                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Reallocate 4 Riders from Sector 9 to Sector 7</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 glass rounded-2xl border border-white/5 group hover:border-success/40 transition-all cursor-pointer">
                                <div className="p-2 rounded-lg bg-success/10 text-success">
                                    <TrendingUp size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white uppercase italic">Status: Opportunity</p>
                                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Incentivize 2x Yield in Central Grid (Sector 2)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 min-w-[320px]">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] italic">Auto-Pivot Mode</span>
                            <div className="w-12 h-6 bg-brand/20 rounded-full border border-brand/40 relative">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-brand rounded-full shadow-[0_0_10px_#FF6B00]" />
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Response Latency</p>
                                <p className="text-2xl font-black text-white italic tracking-tighter">14ms</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Protocol Fidelity</p>
                                <p className="text-2xl font-black text-success italic tracking-tighter">99.8%</p>
                            </div>
                        </div>
                        <Button className="w-full mt-10 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] italic h-14 hover:bg-brand hover:text-white transition-all">
                            Force System Sync
                        </Button>
                    </div>
                </div>
            </div>

            {/* 4. ASSET ALLOCATION PROTOCOL */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AllocationMetric title="Fleet Saturation" value="92.4%" delta="+8%" icon={Truck} color="#FF6B00" />
                <AllocationMetric title="Inventory Buffer" value="14 Days" delta="LOW" icon={ShoppingBag} color="#F04438" />
                <AllocationMetric title="Yield Efficiency" value="1.8x" delta="+12%" icon={Activity} color="#00C48C" />
                <AllocationMetric title="Grid Latency" value="12ms" delta="MINIMAL" icon={Zap} color="#7C5CFC" />
            </div>

        </div>
    );
}

function AllocationMetric({ title, value, delta, icon: Icon, color }: any) {
    return (
        <div className="p-8 glass rounded-[32px] border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all shadow-2xl">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 blur-[40px] opacity-[0.03] group-hover:opacity-[0.08] transition-all" style={{ backgroundColor: color }} />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:scale-110 transition-all" style={{ color }}>
                    <Icon size={18} />
                </div>
                <div className="text-[9px] font-black uppercase tracking-widest italic" style={{ color }}>
                    {delta}
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">{title}</p>
                <h4 className="text-3xl font-black text-white italic tracking-tighter leading-none">{value}</h4>
            </div>
        </div>
    );
}
