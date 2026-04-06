'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, Package, 
  DollarSign, PieChart as PieIcon, Activity, Box, Zap
} from 'lucide-react';

const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];

export default function AnalyticsClient() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/admin/analytics');
        const result = await res.json();
        if (result.success) setData(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synthesizing Data Streams...</p>
        </div>
    </div>
  );

  if (!data) return <div>Failed to load data</div>;

  const { highlights, products } = data;

  return (
    <div className="space-y-10 pb-12">
      <header>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Portfolio Intel</h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-loose mt-1">SaaS-Grade Demand Metrics & Conversions</p>
      </header>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `₹${highlights.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'indigo' },
          { label: 'Conversion Rate', value: `${highlights.conversionRate}%`, icon: TrendingUp, color: 'emerald' },
          { label: 'Order Velocity', value: highlights.totalOrders, icon: Package, color: 'amber' },
          { label: 'Market Reach', value: highlights.totalUsers, icon: Users, color: 'rose' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-${stat.color}-50 text-${stat.color}-600 border border-${stat.color}-100`}>
                    <stat.icon size={22} />
                </div>
                <div>
                   <span className="text-3xl font-black text-slate-900 block tracking-tight">{stat.value}</span>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">{stat.label}</span>
                </div>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-slate-900 pointer-events-none group-hover:translate-x-2 transition-transform"><stat.icon size={96} /></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Most Demanded Chart */}
        <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-2xl shadow-slate-200/10">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <Activity size={20} className="text-indigo-600" /> Top Performers
                </h3>
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Live Velocity</span>
            </div>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={products.mostDemanded}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} hide />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', fontWeight: 900, fontSize: '12px' }}
                            cursor={{ fill: '#f8fafc' }}
                        />
                        <Bar dataKey="demandCount" fill="#6366f1" radius={[10, 10, 10, 10]} barSize={24} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-8 space-y-4">
                {products.mostDemanded.map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-slate-400">0{i+1}</span>
                            <span className="text-xs font-black text-slate-700">{p.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 bg-white px-2 py-1 rounded-lg shadow-sm border border-slate-100">{p.demandCount} units</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Bread Analytics */}
        <div className="bg-zinc-900 rounded-[48px] p-10 text-white shadow-2xl shadow-indigo-900/10 relative overflow-hidden">
            <div className="absolute inset-0  opacity-[0.03]"></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-black tracking-tight flex items-center gap-3 mb-10">
                        <Zap size={20} className="text-amber-400" /> Bread SKU Dynamics
                    </h3>
                    <div className="h-[250px] mb-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={products.breadDemand} 
                                    dataKey="demandCount" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={60} 
                                    outerRadius={80}
                                    paddingAngle={8}
                                >
                                    {products.breadDemand.map((_: any, index: number) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ background: '#18181b', borderRadius: '16px', border: '1px solid #3f3f46', fontSize: '10px', fontWeight: 900 }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    {products.breadDemand.map((p: any, i: number) => (
                        <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 truncate">{p.name}</span>
                            </div>
                            <span className="text-xl font-black">{p.demandCount} <span className="text-[10px] text-zinc-600">REQ</span></span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
