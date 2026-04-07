'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    TrendingUp, Users, Package, ShoppingBag, 
    Bell, Search, ChevronRight, Activity, 
    ArrowRight, MapPin, CheckCircle, Clock,
    ShieldAlert, AlertCircle, Check, X,
    Mail, MessageSquare, ExternalLink,
    LayoutDashboard, Wallet, BarChart3,
    Truck, Settings, LogOut, Menu, Zap,
    ArrowUpRight, ArrowDownRight, MoreHorizontal,
    Layers, Crosshair, Command
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { brandConfig } from '@/config/brand';
import toast from 'react-hot-toast';

// --- Sub-Views ---
import { FleetManagementView } from './FleetManagementView';
import { WalletManagementView } from './WalletManagementView';
import { AnalyticsDashboardView } from './AnalyticsDashboardView';
import { AdminProductsClient } from './AdminProductsClient';
import { SystemPulseView } from './SystemPulseView';

import { PredictiveDemandView } from './PredictiveDemandView';

type AdminTab = 'overview' | 'orders' | 'inventory' | 'fleet' | 'wallet' | 'analytics' | 'pulse' | 'vision';

export function AdminDashboardClient() {
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');

    const { data: tickets = [] } = useQuery({
        queryKey: ['admin', 'tickets'],
        queryFn: async () => {
            const res = await fetch('/api/admin/tickets');
            const data = await res.json();
            return data.success ? data.data : [];
        }
    });

    const { data: adminOrders = [], isLoading: ordersLoading } = useQuery({
        queryKey: ['admin', 'orders', 'recent'],
        queryFn: async () => {
            const res = await fetch('/api/admin/orders?limit=8');
            const data = await res.json();
            return data.success ? data.data : [];
        },
        refetchInterval: 15000 // Tactical re-sync
    });

    const getStatusProtocol = (status: string) => {
        switch(status?.toLowerCase()) {
            case 'delivered': return { label: 'SUCCESS', color: 'text-success', iconColor: 'bg-success' };
            case 'cancelled': return { label: 'TERMINATED', color: 'text-danger', iconColor: 'bg-danger' };
            case 'shipped': return { label: 'IN TRANSIT', color: 'text-brand', iconColor: 'bg-brand' };
            default: return { label: 'PENDING', color: 'text-info', iconColor: 'bg-info' };
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'fleet': return <FleetManagementView />;
            case 'wallet': return <WalletManagementView />;
            case 'analytics': return <AnalyticsDashboardView />;
            case 'pulse': return <SystemPulseView />;
            case 'inventory': return <AdminProductsClient initialProducts={[]} />;
            case 'vision': return <PredictiveDemandView />;
            case 'overview':
            default:
                return (
                    <div className="space-y-12 animate-fade-in">
                        {/* High-Precision KPI Layer */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard title="Gross Revenue" value="₹1.24M" trend="+12.5%" icon={TrendingUp} color="#FF6B00" />
                            <MetricCard title="Fleet Enlisted" value="18" trend="LIVE" icon={Truck} color="#00C48C" />
                            <MetricCard title="System Guard" value="04" trend="SECURE" icon={ShieldAlert} color="#F04438" />
                            <MetricCard title="Pet Parents" value="2.4k" trend="+18%" icon={Users} color="#7C5CFC" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                             {/* Operational Command Feed */}
                             <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-brand/10 border border-brand/20">
                                            <Crosshair size={18} className="text-brand" />
                                        </div>
                                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Mission Logs</h3>
                                    </div>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-brand transition-colors">Tactical Archive</button>
                                </div>

                                <div className="glass rounded-[32px] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-3xl">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-white/[0.02] border-b border-white/5">
                                                <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Mission ID</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Protocol</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Payload</th>
                                                <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {adminOrders.length > 0 ? adminOrders.map((order: any) => {
                                                const protocol = getStatusProtocol(order.status);
                                                return (
                                                    <tr key={order._id} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors group">
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-brand/40 transition-all">
                                                                    <Command size={16} className="text-white/20 group-hover:text-brand transition-colors" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-black text-white italic uppercase tracking-tight leading-none">{order._id.slice(-6).toUpperCase()}</p>
                                                                    <p className="text-[9px] font-bold text-white/20 uppercase mt-2 italic">{order.shippingAddress?.city || 'Lucknow Sector'}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,107,0,0.5)] ${protocol.iconColor}`} />
                                                                <span className={`text-[10px] font-black uppercase italic tracking-widest leading-none ${protocol.color}`}>
                                                                    {protocol.label}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <p className="text-sm font-black text-white italic tracking-tighter leading-none">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            <button className="w-10 h-10 rounded-xl glass border border-white/5 text-white/20 hover:text-brand transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center ml-auto">
                                                                <ExternalLink size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            }) : (
                                                <tr>
                                                    <td colSpan={4} className="py-20 text-center">
                                                        <p className="text-[10px] font-black text-white/10 uppercase tracking-widest">No active missions detected</p>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                             </div>

                             {/* Priority Strategic Alerts */}
                             <div className="space-y-6">
                                <div className="flex items-center gap-3 px-2">
                                    <div className="p-2 rounded-lg bg-danger/10 border border-danger/20">
                                        <ShieldAlert size={18} className="text-danger" />
                                    </div>
                                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Priorities</h3>
                                </div>

                                <div className="space-y-4">
                                    {tickets.length > 0 ? (tickets.map((t: any) => (
                                        <div key={t._id} className="p-6 glass rounded-3xl relative overflow-hidden group hover:border-danger/30 transition-all border border-white/5">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-danger opacity-40" />
                                            <div className="flex justify-between items-start mb-4">
                                                <Badge className="bg-danger/10 text-danger border-danger/20 text-[9px] uppercase font-black italic">{t.issueType}</Badge>
                                                <span className="text-[9px] font-black text-white/20 uppercase">2m ago</span>
                                            </div>
                                            <p className="text-sm font-black text-white italic uppercase tracking-tight truncate">{t.userEmail}</p>
                                            <p className="text-[10px] text-white/40 mt-1 line-clamp-2 leading-relaxed">System protocol breach detected at node 7. Secure immediate verification.</p>
                                        </div>
                                    ))) : (
                                        <div className="p-12 border-2 border-white/5 border-dashed rounded-[40px] flex flex-col items-center justify-center text-center">
                                            <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6">
                                                <Activity size={24} className="text-white/10" />
                                            </div>
                                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">Grid Operational</p>
                                            <p className="text-[9px] font-bold text-white/10 uppercase italic">No active breaches</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pulse Meter Mock */}
                                <div className="p-8 glass rounded-[32px] border border-brand/20 relative overflow-hidden group shadow-2xl shadow-brand/10">
                                    <Zap className="absolute -right-8 -bottom-8 w-40 h-40 text-brand/5 rotate-12 group-hover:scale-110 transition-transform" />
                                    <h4 className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mb-6">Tactical Pulse</h4>
                                    <div className="flex items-end justify-between relative z-10">
                                        <div>
                                            <p className="text-4xl font-black text-white italic tracking-tighter leading-none">98.4%</p>
                                            <p className="text-[9px] font-bold text-white/30 uppercase mt-3 tracking-widest uppercase">Grid Optimization</p>
                                        </div>
                                        <div className="w-14 h-14 rounded-2xl border-4 border-brand/10 border-t-brand animate-spin" />
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-12">
            {/* Global Tab Interface */}
            <div className="flex items-center gap-2 p-1.5 glass rounded-3xl border border-white/5 w-fit">
                {['overview', 'vision', 'fleet', 'inventory', 'pulse', 'wallet', 'analytics'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as AdminTab)}
                        className={`px-6 h-11 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-brand text-white shadow-xl shadow-brand/20' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.03]'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

function MetricCard({ title, value, trend, icon: Icon, color }: any) {
    return (
        <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="p-8 glass rounded-[32px] border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all shadow-2xl"
        >
            <div className="absolute -right-4 -bottom-4 w-32 h-32 blur-[40px] opacity-[0.03] group-hover:opacity-[0.08] transition-all" style={{ backgroundColor: color }} />
            
            <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all" style={{ color }}>
                    <Icon size={22} />
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase italic text-brand">
                        <ArrowUpRight size={14} />
                        {trend}
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">{title}</p>
                <h3 className="text-4xl font-black text-white italic tracking-tighter leading-none">{value}</h3>
            </div>
        </motion.div>
    );
}
