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

export function AdminDashboardClient() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);
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
        fetchStats();
    }, []);

    const formatCurrency = (num: number) => `₹${Number(num || 0).toLocaleString('en-IN')}`;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Synchronizing Workspace...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <header className="mb-12 flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-3 tracking-tighter">Command Center</h1>
                    <p className="text-text-light font-medium text-lg max-w-xl">Welcome back, Boss! Here's how {brandConfig.name} is performing today.</p>
                </div>

                <div className="flex items-center gap-4 relative">
                    {/* Notifications Bell */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={`p-4 bg-white border border-card-border rounded-2xl text-text-light hover:text-brand-primary transition-all relative ${showNotifications ? 'ring-2 ring-brand-primary/20 border-brand-primary' : ''}`}
                        >
                            <Bell size={24} />
                            {notifications.some(n => !n.read) && (
                                <span className="absolute top-4 right-4 w-2 h-2 bg-secondary rounded-full animate-pulse shadow-sm shadow-secondary/50"></span>
                            )}
                        </button>
                        
                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 bg-white border border-card-border rounded-3xl shadow-2xl z-50 overflow-hidden animate-slide-in-top">
                                <div className="p-4 bg-gray-50 border-b border-card-border flex justify-between items-center">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-text-primary">Recent Alerts</h4>
                                    <button 
                                        onClick={() => setNotifications(n => n.map(i => ({...i, read: true})))}
                                        className="text-[10px] font-black text-brand-primary hover:underline"
                                    >
                                        Mark all read
                                    </button>
                                </div>
                                <div className="max-h-[350px] overflow-y-auto">
                                    {notifications.map(n => (
                                        <div key={n.id} className={`p-4 border-b border-card-border/50 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? 'bg-brand-primary/[0.02]' : ''}`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <h5 className="font-black text-xs text-text-primary">{n.title}</h5>
                                                <span className="text-[9px] font-bold text-text-light">{n.time}</span>
                                            </div>
                                            <p className="text-[11px] font-medium text-text-light leading-relaxed">{n.msg}</p>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/admin/orders" className="block text-center p-3 text-[10px] font-black uppercase tracking-widest text-text-light hover:text-brand-primary bg-gray-50/50">
                                    View Command History
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowQuickActions(!showQuickActions)}
                            className={`flex items-center gap-3 px-8 py-4 bg-brand-primary text-white font-black rounded-2xl shadow-xl shadow-brand-primary/25 hover:scale-105 active:scale-95 transition-all ${showQuickActions ? 'ring-4 ring-brand-primary/20' : ''}`}
                        >
                            <PlusCircle size={22} strokeWidth={3} />
                            Quick Actions
                        </button>

                        {showQuickActions && (
                            <div className="absolute right-0 mt-3 w-64 bg-white border border-card-border rounded-3xl shadow-2xl z-50 overflow-hidden p-2 animate-slide-in-right">
                                <Link href="/admin/billing" className="flex items-center gap-3 p-4 hover:bg-brand-primary/5 rounded-2xl transition-colors group">
                                    <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                                        <ClipboardList size={20} />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-black text-text-primary">Create Invoice</h5>
                                        <p className="text-[9px] font-bold text-text-light">Start Billing</p>
                                    </div>
                                </Link>
                                <Link href="/admin/products" className="flex items-center gap-3 p-4 hover:bg-secondary/5 rounded-2xl transition-colors group">
                                    <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-black text-text-primary">Add Product</h5>
                                        <p className="text-[9px] font-bold text-text-light">Inventory Update</p>
                                    </div>
                                </Link>
                                <div className="border-t border-card-border my-2 mx-2"></div>
                                <Link href="/" target="_blank" className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-2xl transition-colors text-text-light">
                                    <ExternalLink size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Go to Store</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Dynamic Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
                {[
                    { label: "Total Revenue", value: formatCurrency(stats?.totalRevenue || 0), desc: "Current Month", color: "text-brand-primary", bg: "bg-brand-primary/5", icon: TrendingUp },
                    { label: "Active Products", value: stats?.totalProducts || 0, desc: "In Stock", color: "text-secondary", bg: "bg-secondary/5", icon: Package },
                    { label: "Total Orders", value: stats?.totalOrders || 0, desc: "Lifetime", color: "text-accent", bg: "bg-accent/5", icon: ShoppingBag },
                    { label: "Active Customers", value: stats?.totalCustomers || 0, desc: "Verified", color: "text-green-500", bg: "bg-green-500/5", icon: Users },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[32px] border border-card-border shadow-2xl relative overflow-hidden flex flex-col justify-between h-44 group hover:-translate-y-1 transition-all">
                        <div className={`absolute -top-4 -right-4 w-24 h-24 ${stat.bg} rounded-full blur-2xl group-hover:scale-125 transition-transform`}></div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-light">{stat.label}</h3>
                            <stat.icon size={20} className={stat.color} />
                        </div>
                        <div>
                            <p className={`text-4xl font-black mb-1 ${stat.color}`}>{stat.value}</p>
                            <p className="text-[10px] font-black text-text-light flex items-center gap-1 opacity-70 italic">
                                {stat.desc} Performance
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* Recent Orders Management */}
                <div className="xl:col-span-8">
                    <div className="bg-white rounded-[40px] p-10 border border-card-border shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black text-text-primary flex items-center gap-3">
                                <ClipboardList className="text-brand-primary" size={24} /> Recent Orders
                            </h3>
                            <Link href="/admin/orders" className="text-xs font-black text-brand-primary hover:underline uppercase tracking-widest flex items-center gap-2">
                                Operations Manager <ArrowUpRight size={14} />
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-card-border/50 text-left">
                                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-light">Order ID</th>
                                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-light">Customer</th>
                                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-light">Total / Status</th>
                                        <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-light text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-card-border/30">
                                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                                        stats.recentOrders.map((order: Order) => (
                                            <tr key={order._id} className="group hover:bg-brand-primary/5 transition-colors">
                                                <td className="py-6">
                                                    <div className="font-black text-text-primary text-sm leading-tight">
                                                        {order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`}
                                                    </div>
                                                    <div className="text-[9px] font-black text-text-light tracking-widest mt-1">ID: {order._id.slice(-6)}</div>
                                                </td>
                                                <td className="py-6">
                                                    <div className="font-bold text-text-primary text-xs">
                                                        {(typeof order.user === 'object' && order.user?.name) || 'Guest'}
                                                    </div>
                                                    <div className="text-[10px] text-text-light font-medium">
                                                        {(typeof order.user === 'object' && order.user?.email) || ''}
                                                    </div>
                                                </td>
                                                <td className="py-6">
                                                    <div className="font-black text-text-primary text-sm">{formatCurrency(order.total)}</div>
                                                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {order.paymentStatus}
                                                    </span>
                                                </td>
                                                <td className="py-6 text-right">
                                                    <div className="text-[10px] font-black text-text-light uppercase tracking-widest">
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </div>
                                                    <div className="text-[9px] text-text-light opacity-50">
                                                        {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-text-light font-bold uppercase tracking-widest text-xs opacity-40">
                                                <Clock size={40} className="mx-auto mb-4 opacity-10" />
                                                No Recent Activity Found
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
                    <div className="bg-secondary p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                        <h3 className="text-xl font-black mb-6">Staff Control</h3>
                        <div className="space-y-6">
                            {[
                                { name: "Kanha Admin", status: "Commander", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" },
                                { name: "System Bot", status: "Auto-Pilot / Online", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" },
                            ].map((staff, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-sm">
                                    <div className="w-12 h-12 rounded-2xl overflow-hidden relative border-2 border-white/50">
                                        <Image src={staff.img} alt={staff.name} fill className="object-cover" sizes="48px" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm">{staff.name}</h4>
                                        <p className="text-[10px] font-black tracking-widest opacity-80 uppercase">{staff.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-10 border border-card-border shadow-2xl">
                        <h3 className="text-lg font-black text-text-primary mb-6">Service Monitor</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-light">
                                    <span>Server Load</span>
                                    <span>24%</span>
                                </div>
                                <div className="h-2 w-full bg-bg-page rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[24%] rounded-full shadow-sm shadow-green-500/50" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-light">
                                    <span>Database Health</span>
                                    <span>99.9%</span>
                                </div>
                                <div className="h-2 w-full bg-bg-page rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary w-[99.9%] rounded-full shadow-sm shadow-secondary/50" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-card-border/50">
                            <div className="flex items-center gap-3 text-green-500 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                All Systems Nominal
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
