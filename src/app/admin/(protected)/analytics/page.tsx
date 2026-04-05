'use client';

import { useState, useEffect } from 'react';
import { 
    BarChart3, 
    TrendingUp, 
    ShoppingCart, 
    Users, 
    ArrowUpRight, 
    ArrowDownRight,
    Search,
    Package,
    PieChart,
    ChevronRight,
    ArrowRight,
    Zap,
    Box
} from 'lucide-react';

export default function AdminAnalytics() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/admin/analytics');
                const result = await res.json();
                if (result.success) setStats(result.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
            <div className="w-16 h-16 border-[6px] border-indigo-600 border-t-transparent rounded-full animate-spin shadow-2xl shadow-indigo-100"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ">Synchronizing Market Intelligence...</span>
        </div>
    );

    if (!stats) return <div className="text-center py-20 font-black text-slate-900 border-2 border-slate-100 rounded-[40px] m-10 shadow-2xl">Connectivity Failure: Data Stream Unavailable</div>;

    const { metrics, demand } = stats;

    return (
        <div className="p-10 pb-40 space-y-12 max-w-7xl mx-auto selection:bg-indigo-100 selection:text-indigo-900">
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-slate-100 pb-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform group-hover:scale-150 duration-1000"></div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2 italic">Operation Insights</h1>
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] ml-1">Behavioral intelligence & performance metrics</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <button className="px-10 py-5 bg-indigo-600 text-white rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all outline-none">Compile Bio-Report</button>
                    <button className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200/50 hover:bg-slate-50 transition-all outline-none">Data Export</button>
                </div>
            </header>

            {/* Elite Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                {[
                    { label: 'Conversion Velocity', value: `${metrics.conversionRate}%`, icon: TrendingUp, color: 'emerald', trend: '+4.2%' },
                    { label: 'Platform Qualified Leads', value: metrics.totalLeads, icon: Users, color: 'indigo', trend: '+15.1%' },
                    { label: 'Order Throughput', value: metrics.totalOrders, icon: ShoppingCart, color: 'sky', trend: '+12.4%' },
                    { label: 'Gross Net Flow', value: `₹ ${metrics.totalRevenue.toLocaleString()}`, icon: BarChart3, color: 'rose', trend: '+21.3%' }
                ].map((kpi, i) => (
                    <div key={i} className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group overflow-hidden relative">
                        <div className={`absolute -right-4 -top-4 w-32 h-32 bg-${kpi.color}-500/5 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000`}></div>
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div className={`p-5 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-[24px] border border-${kpi.color}-100 shadow-inner group-hover:rotate-12 transition-transform`}>
                                <kpi.icon size={28} />
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                <ArrowUpRight size={14} /> {kpi.trend}
                            </div>
                        </div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{kpi.label}</h3>
                        <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{kpi.value}</span>
                    </div>
                ))}
            </div>

            {/* Demand Visualization Engines */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* High Demanded Inventory */}
                <div className="bg-white rounded-[50px] p-12 border border-slate-100 shadow-2xl shadow-indigo-500/5 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform group-hover:scale-150 duration-[2s]"></div>
                    <div className="flex justify-between items-start mb-12 relative z-10">
                        <div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] block mb-3">High Performance Matrix</span>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter leading-none italic flex items-center gap-4">
                                Dynamic Demand Flow <Zap size={32} fill="currentColor" className="text-amber-400" />
                            </h2>
                        </div>
                        <PieChart size={28} className="text-slate-200" />
                    </div>

                    <div className="space-y-8 relative z-10">
                        {demand.topProducts.map((p: any, i: number) => (
                            <div key={p._id} className="relative group cursor-pointer pb-2">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-sm font-black text-slate-900 tracking-tight group-hover:translate-x-1 transition-transform">{p.name || 'Legacy Inventory'}</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.unitsSold} <span className="text-indigo-600">UNITS</span></span>
                                </div>
                                <div className="h-5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner p-1">
                                    <div 
                                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.4)] relative group-hover:from-indigo-600 group-hover:to-indigo-700 transition-all duration-1000"
                                        style={{ width: `${(p.unitsSold / demand.topProducts[0].unitsSold) * 100}%` }}
                                    >
                                         <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay"></div>
                                    </div>
                                </div>
                                {i === 0 && <div className="absolute -left-4 top-1 w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Critical Analysis: Low Stock Velocity */}
                <div className="bg-slate-900 rounded-[50px] p-12 border border-slate-800 shadow-2xl shadow-indigo-950/40 relative overflow-hidden text-white group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 transition-transform duration-[10s] group-hover:scale-125"></div>
                    <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-rose-600/5 rounded-full blur-[120px] transition-transform duration-[5s] group-hover:scale-150"></div>
                    
                    <div className="relative z-10 flex justify-between items-start mb-12">
                        <div>
                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] block mb-3">Priority Review Needed</span>
                            <h2 className="text-3xl font-black text-white tracking-tighter leading-none italic flex items-center gap-4">
                                Low Velocity Drift <ArrowDownRight size={32} className="text-rose-500" strokeWidth={3} />
                            </h2>
                        </div>
                        <Box size={28} className="text-slate-700" />
                    </div>

                    <div className="relative z-10 space-y-8">
                        {demand.bottomProducts.map((p: any) => (
                            <div key={p._id} className="group cursor-default">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-sm font-black text-white/80 group-hover:text-white transition-colors">{p.name || 'Reference Data'}</span>
                                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{p.unitsSold} Unit Velocity</span>
                                </div>
                                <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                                    <div 
                                        className="h-full bg-rose-600 rounded-full transition-all duration-1000 group-hover:bg-rose-500/50 shadow-2xl shadow-rose-900"
                                        style={{ width: `${(p.unitsSold / demand.topProducts[0].unitsSold) * 100 + 3}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="relative z-10 mt-12 w-full py-6 px-10 bg-white/5 border-2 border-white/10 rounded-[24px] text-[10px] font-black text-rose-400 uppercase tracking-[0.4em] hover:bg-white/10 hover:text-rose-300 transition-all active:scale-[0.98] outline-none shadow-2xl">
                        Optimize Inventory Streams
                    </button>
                </div>
            </div>

            {/* Smart Distribution Grid (Category Logic) */}
            <div className="bg-white rounded-[60px] p-16 border-2 border-slate-50 shadow-xl shadow-slate-200/20 relative overflow-hidden group">
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-50/50 rounded-full blur-[100px] -mr-40 -mt-40 transition-transform group-hover:scale-150 duration-[5s]"></div>
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-20 relative z-10">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">Sector Distribution</h2>
                        <p className="text-slate-400 font-bold max-w-xl text-sm leading-relaxed mt-4">Cross-category performance distribution, including advanced metrics for bread specialty and nutritional segment clusters.</p>
                    </div>
                    <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        <button className="px-6 py-3 bg-white shadow-xl shadow-slate-200 text-[10px] font-black rounded-xl uppercase tracking-widest text-slate-900">Categories</button>
                        <button className="px-6 py-3 text-[10px] font-black rounded-xl uppercase tracking-widest text-slate-400 opacity-60">Segments</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 relative z-10">
                     {[
                        { name: 'Pure Food', count: '5.2k', percent: 85, color: 'indigo' },
                        { name: 'Specialty Bread', count: '1.4k', percent: 45, color: 'amber' },
                        { name: 'Logic Toys', count: '2.8k', percent: 65, color: 'sky' },
                        { name: 'Bio-Grooming', count: '0.9k', percent: 25, color: 'emerald' },
                        { name: 'Vital Health', count: '1.1k', percent: 35, color: 'rose' },
                        { name: 'Accessory Hub', count: '3.1k', percent: 55, color: 'violet' },
                     ].map((seg, i) => (
                        <div key={i} className="flex flex-col items-center group cursor-pointer">
                            <div className="relative inline-flex items-center justify-center p-2 rounded-full border-[8px] border-slate-50 group-hover:border-slate-100 group-hover:scale-110 transition-all duration-500 shadow-2xl shadow-slate-100 mb-6">
                                <svg className="w-28 h-28 transform -rotate-90 drop-shadow-sm">
                                    <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100" />
                                    <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" 
                                        strokeDasharray={301.59} 
                                        strokeDashoffset={301.59 - (301.59 * seg.percent) / 100}
                                        className={`text-${seg.color}-600 transition-all duration-1000 ease-in-out`} 
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-lg font-black text-slate-900 leading-none">{seg.percent}%</span>
                                </div>
                            </div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{seg.name}</h4>
                            <span className="text-sm font-black text-slate-900 opacity-60">{seg.count} Hits</span>
                        </div>
                     ))}
                </div>
            </div>
            
            <div className="p-12 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[60px] text-white relative group overflow-hidden border border-white/5 shadow-[0_40px_100px_rgba(79,70,229,0.3)]">
                <div className="absolute -left-20 -bottom-20 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] transition-transform duration-[5s] group-hover:scale-150"></div>
                <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-12">
                    <div className="text-center xl:text-left flex-1">
                        <div className="inline-block px-4 py-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 animate-pulse">Bio-Predictive Alpha v4.2</div>
                        <h3 className="text-4xl font-black mb-4 italic tracking-tight leading-tight">Neural Inventory Optimization</h3>
                        <p className="text-indigo-200/70 font-bold max-w-2xl text-lg leading-relaxed">Cross-verification suggests an immediate stock redistribution towards the <span className="text-white font-black">'Specialty Bread'</span> sector to capitalize on a +25% projected weekend velocity spike.</p>
                    </div>
                    <button className="px-12 py-6 bg-white text-slate-900 font-black rounded-3xl uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-4 group/btn outline-none">
                         Synchronize Stocks <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    );
}
