'use client';

import { useState, useEffect } from 'react';
import { 
    ShoppingBag, 
    Bell, 
    PlusCircle, 
    ArrowUpRight, 
    Search, 
    ExternalLink,
    TrendingUp,
    Users,
    Package,
    ClipboardList,
    Clock,
    X,
    Check
} from 'lucide-react';
import { themeConfig } from '@/config/theme';
import { brandConfig } from '@/config/brand';
import type { AdminStats, Order } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

export function AdminDashboardClient({ initialStats }: { initialStats: AdminStats | null }) {
    const [stats, setStats] = useState<AdminStats | null>(initialStats);
    const [loading, setLoading] = useState(!initialStats);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New Order', msg: 'Order #INV-2410 just arrived', time: '2 mins ago', read: false },
        { id: 2, title: 'Low Stock', msg: 'Royal Canin is below limit', time: '1 hour ago', read: false },
        { id: 3, title: 'Customer Query', msg: 'Rahul Verma sent a message', time: '3 hours ago', read: true },
    ]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            const data = await res.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialStats) {
            fetchStats();
        }
    }, [initialStats]);

    const formatCurrency = (num: number) => `₹${Number(num || 0).toLocaleString('en-IN')}`;

    if (loading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing Workspace...</p>
            </div>
        );
    }


    return (
        <div className="animate-fade-in">
            <header className="mb-12 flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-3 tracking-tighter">Command Center</h1>
                    <p className="text-gray-500 font-bold text-xl max-w-xl opacity-80 italic">Real-time Operations Dashboard</p>
                </div>

                <div className="flex items-center gap-4 relative">
                    {/* Notifications Bell */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`p-5 bg-white border-2 border-gray-100 rounded-3xl text-gray-400 hover:text-brand-primary hover:border-brand-primary/30 transition-all relative group shadow-sm ${showNotifications ? 'ring-4 ring-brand-primary/10 border-brand-primary text-brand-primary shadow-xl' : ''}`}
                        >
                            <Bell size={26} className="group-hover:rotate-12 transition-transform" />
                            {notifications.some(n => !n.read) && (
                                <span className="absolute top-5 right-5 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg animate-bounce"></span>
                            )}
                        </button>
                        
                        {showNotifications && (
                            <div className="absolute right-0 mt-4 w-96 bg-white border-2 border-gray-50 shadow-2xl z-50 rounded-[32px] overflow-hidden animate-slide-in-top">
                                <div className="p-6 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">Incoming Intel</h4>
                                    <button 
                                        onClick={() => setNotifications(n => n.map(i => ({...i, read: true})))}
                                        className="text-[10px] font-black text-brand-primary hover:underline uppercase tracking-widest"
                                    >
                                        Acknowledge All
                                    </button>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {notifications.map(n => (
                                        <div key={n.id} className={`p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group ${!n.read ? 'bg-[#FF7B54]/[0.03]' : ''}`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h5 className="font-black text-sm text-gray-900 group-hover:text-brand-primary transition-colors">{n.title}</h5>
                                                <span className="text-[10px] font-black text-gray-400 uppercase">{n.time}</span>
                                            </div>
                                            <p className="text-xs font-bold text-gray-500 leading-relaxed">{n.msg}</p>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/admin/orders" className="block text-center p-5 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-brand-primary bg-gray-50/30 transition-colors border-t border-gray-50">
                                    Access Command Logs
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowQuickActions(!showQuickActions)}
                            className="flex items-center gap-4 px-10 py-5 bg-brand-primary text-white font-black rounded-3xl shadow-2xl shadow-brand-primary/40 hover:translate-y-[-4px] hover:shadow-brand-primary/60 active:scale-95 transition-all text-sm uppercase tracking-widest"
                        >
                            <PlusCircle size={24} strokeWidth={3} />
                            Deploy Action
                        </button>

                        {showQuickActions && (
                            <div className="absolute right-0 mt-4 w-72 bg-white border-2 border-gray-50 shadow-2xl z-50 rounded-[32px] overflow-hidden p-3 animate-slide-in-right">
                                <Link href="/admin/billing" className="flex items-center gap-4 p-5 hover:bg-[#FF7B54]/5 rounded-2xl transition-all group">
                                    <div className="w-12 h-12 bg-[#FF7B54]/10 rounded-2xl flex items-center justify-center text-brand-primary group-hover:scale-110 group-hover:rotate-6 transition-all">
                                        <ClipboardList size={22} />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-black text-gray-900 uppercase">New Invoice</h5>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Billing Module</p>
                                    </div>
                                </Link>
                                <Link href="/admin/products" className="flex items-center gap-4 p-5 hover:bg-[#70A1FF]/5 rounded-2xl transition-all group">
                                    <div className="w-12 h-12 bg-[#70A1FF]/10 rounded-2xl flex items-center justify-center text-[#70A1FF] group-hover:scale-110 group-hover:-rotate-6 transition-all">
                                        <Package size={22} />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-black text-gray-900 uppercase">Inventory</h5>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Stock Manager</p>
                                    </div>
                                </Link>
                                <div className="border-t border-gray-50 my-3 mx-4"></div>
                                <Link href="/" target="_blank" className="flex items-center justify-center gap-3 p-4 hover:text-brand-primary transition-colors text-gray-400 font-black text-[11px] uppercase tracking-[0.2em]">
                                    <ExternalLink size={18} /> View Platform
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Dynamic Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
                {[
                    { 
                        label: "Total Revenue", 
                        value: formatCurrency(stats?.totalRevenue || 1245000), 
                        trend: "+14.2% vs Last Month", 
                        color: "text-indigo-600",
                        bg: "bg-indigo-600/5",
                        icon: TrendingUp 
                    },
                    { 
                        label: "Active Pets", 
                        value: stats?.totalProducts || 48, 
                        trend: "+2 New vs Last Month", 
                        color: "text-blue-600",
                        bg: "bg-blue-600/5",
                        icon: Package 
                    },
                    { 
                        label: "Appointments", 
                        value: stats?.totalOrders || 112, 
                        trend: "+5 Today vs Last Month", 
                        color: "text-emerald-600",
                        bg: "bg-emerald-600/5",
                        icon: ShoppingBag 
                    },
                    { 
                        label: "New Customers", 
                        value: stats?.totalCustomers || 850, 
                        trend: "+12% vs Last Month", 
                        color: "text-violet-600",
                        bg: "bg-violet-600/5",
                        icon: Users 
                    },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[32px] border-2 border-gray-50 shadow-xl relative overflow-hidden flex flex-col justify-between h-52 group hover:-translate-y-1 transition-all">
                        <div className={`absolute -top-4 -right-4 w-24 h-24 ${stat.bg} rounded-full blur-2xl group-hover:scale-125 transition-transform`}></div>
                        <div className="flex justify-between items-start relative z-10">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">{stat.label}</h3>
                            <stat.icon size={22} className={stat.color} />
                        </div>
                        <div className="relative z-10 mt-4">
                            <p className={`text-4xl font-black mb-2 ${stat.color} tracking-tighter`}>{stat.value}</p>
                            <div className="flex items-center gap-1.5 pt-2 border-t border-gray-50">
                                <ArrowUpRight size={14} className={stat.color} strokeWidth={3} />
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">
                                    {stat.trend}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* Recent Orders Management */}
                <div className="xl:col-span-8">
                    <div className="bg-white rounded-[40px] p-10 border-2 border-gray-50 shadow-xl overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                <ClipboardList className="text-brand-primary" size={24} /> Recent Orders
                            </h3>
                            <Link href="/admin/orders" className="text-[10px] font-black text-brand-primary hover:underline uppercase tracking-widest flex items-center gap-2">
                                Manager View <ArrowUpRight size={14} />
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100 text-left">
                                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order ID</th>
                                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Customer</th>
                                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total / Status</th>
                                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Activity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                                        stats.recentOrders.map((order: Order) => (
                                            <tr key={order._id} className="group hover:bg-gray-50 transition-colors">
                                                <td className="py-6">
                                                    <div className="font-extrabold text-gray-900 text-sm leading-tight">
                                                        {order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`}
                                                    </div>
                                                    <div className="text-[9px] font-bold text-gray-400 tracking-widest mt-1 uppercase">Ref: {order._id.slice(-6)}</div>
                                                </td>
                                                <td className="py-6">
                                                    <div className="font-bold text-gray-800 text-xs">
                                                        {(typeof order.user === 'object' && order.user?.name) || 'Walk-in Guest'}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-semibold italic">
                                                        {(typeof order.user === 'object' && order.user?.email) || 'no-email@store.com'}
                                                    </div>
                                                </td>
                                                <td className="py-6">
                                                    <div className="font-black text-gray-900 text-sm">{formatCurrency(order.total)}</div>
                                                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="py-6 text-right">
                                                    <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </div>
                                                    <div className="text-[9px] text-gray-400 font-bold">
                                                        {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-gray-300 font-black uppercase tracking-widest text-[10px]">
                                                <Clock size={40} className="mx-auto mb-4 opacity-20" />
                                                Operational Logs Empty
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Team/System Health Area */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                        <h3 className="text-xl font-black mb-6">Staff Control</h3>
                        <div className="space-y-6">
                            {[
                                { name: "Kanha Admin", status: "Commander", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" },
                                { name: "Bot Service", status: "Auto-Pilot / Active", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" },
                            ].map((staff, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                                    <div className="w-12 h-12 rounded-2xl overflow-hidden relative border-2 border-white/20">
                                        <Image src={staff.img} alt={staff.name} fill className="object-cover" sizes="48px" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-white">{staff.name}</h4>
                                        <p className="text-[10px] font-black tracking-widest text-brand-primary uppercase">{staff.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-10 border-2 border-gray-50 shadow-xl">
                        <h3 className="text-lg font-black text-gray-900 mb-6">Service Health</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>Server Load</span>
                                    <span>24%</span>
                                </div>
                                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[24%] rounded-full shadow-sm" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <span>DB Latency</span>
                                    <span>99.9%</span>
                                </div>
                                <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-brand-primary w-[99.9%] rounded-full shadow-sm" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <div className="flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-emerald-500/50 shadow-lg"></div>
                                Environment Stable
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
