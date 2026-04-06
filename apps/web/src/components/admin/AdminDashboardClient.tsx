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
    Check,
    Sparkles,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeConfig } from '@/config/theme';
import { brandConfig } from '@/config/brand';
import type { AdminStats, Order } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

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
                <motion.div 
                   animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full mb-6" 
                />
                <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">Initializing Neural Link...</p>
            </div>
        );
    }

    return (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
            <header className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
                <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-3 mb-2">
                       <Activity className="text-brand-primary animate-pulse" size={20} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">System Live</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter leading-[0.8] mb-4">Command <br /> Center</h1>
                    <p className="text-zinc-500 font-medium text-lg italic max-w-xl opacity-60 flex items-center gap-2">
                       Awaiting your next strategic deployment...
                    </p>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center gap-6">
                    {/* Notifications */}
                    <div className="relative">
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-6 glass rounded-[32px] text-zinc-500 hover:text-brand-primary transition-colors relative shadow-2xl shadow-zinc-200/50"
                        >
                            <Bell size={24} />
                            {notifications.some(n => !n.read) && (
                                <span className="absolute top-6 right-6 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg animate-ping"></span>
                            )}
                        </motion.button>
                        
                        <AnimatePresence>
                           {showNotifications && (
                               <motion.div 
                                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                 animate={{ opacity: 1, y: 0, scale: 1 }}
                                 exit={{ opacity: 0, scale: 0.95 }}
                                 className="absolute right-0 mt-6 w-96 bg-white border border-zinc-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] z-50 rounded-[40px] overflow-hidden"
                               >
                                   <div className="p-8 bg-zinc-50/50 border-b border-zinc-100 flex justify-between items-center">
                                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Incoming Core Intel</h4>
                                   </div>
                                   <div className="max-h-[400px] overflow-y-auto">
                                       {notifications.map(n => (
                                           <div key={n.id} className="p-8 border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors cursor-pointer group">
                                               <div className="flex justify-between items-start mb-2">
                                                   <h5 className="font-black text-sm text-zinc-900">{n.title}</h5>
                                                   <span className="text-[9px] font-black text-zinc-500 uppercase">{n.time}</span>
                                               </div>
                                               <p className="text-xs font-medium text-zinc-500 leading-relaxed">{n.msg}</p>
                                           </div>
                                       ))}
                                   </div>
                               </motion.div>
                           )}
                        </AnimatePresence>
                    </div>

                    <Link href="/admin/billing">
                       <motion.button 
                         whileHover={{ y: -5, scale: 1.02 }}
                         whileTap={{ scale: 0.98 }}
                         className="px-10 py-6 bg-zinc-900 text-white font-black rounded-[32px] shadow-2xl shadow-zinc-900/20 flex items-center gap-4 text-sm uppercase tracking-widest"
                       >
                           <PlusCircle size={22} />
                           Deploy Action
                       </motion.button>
                    </Link>
                </motion.div>
            </header>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
                {[
                    { label: "Total Revenue", val: stats?.totalRevenue || 1245000, prefix: "₹", trend: "+14%", icon: TrendingUp, color: "orange" },
                    { label: "Active Inventory", val: stats?.totalProducts || 48, prefix: "", trend: "Stable", icon: Package, color: "blue" },
                    { label: "Operations", val: stats?.totalOrders || 112, prefix: "", trend: "+5 Today", icon: ShoppingBag, color: "yellow" },
                    { label: "User Base", val: stats?.totalCustomers || 850, prefix: "", trend: "+12%", icon: Users, color: "green" },
                ].map((stat, idx) => (
                    <motion.div 
                      variants={itemVariants}
                      key={idx} 
                      className="glass p-10 rounded-[48px] relative overflow-hidden group border-white/50"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{stat.label}</span>
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-zinc-50 text-zinc-500 group-hover:bg-zinc-900 group-hover:text-white transition-all transform group-hover:rotate-12">
                               <stat.icon size={20} />
                            </div>
                        </div>
                        <div className="text-5xl font-black text-zinc-900 tracking-tighter mb-4">
                           <AnimatedCounter value={stat.val} prefix={stat.prefix} />
                        </div>
                        <div className="flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                           <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                           <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.trend} v Last Month</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                <motion.div variants={itemVariants} className="xl:col-span-8">
                    <div className="glass rounded-[56px] p-12 border-white/50 shadow-2xl">
                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-3xl font-black text-zinc-900 tracking-tight">Recent Activity Log</h3>
                            <Link href="/admin/orders" className="p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-900 hover:text-white transition-all group">
                                <ArrowUpRight size={20} />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {stats?.recentOrders?.map((order: Order, i: number) => (
                                <motion.div 
                                  whileHover={{ x: 10 }}
                                  key={order._id} 
                                  className="flex items-center justify-between p-6 rounded-[32px] hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100"
                                >
                                    <div className="flex gap-6 items-center">
                                       <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-900 font-black text-xs">
                                          #{order._id.slice(-4).toUpperCase()}
                                       </div>
                                       <div>
                                          <h4 className="font-black text-zinc-900">{(typeof order.user === 'object' && order.user?.name) || 'Guest Agent'}</h4>
                                          <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mt-1">{order.paymentStatus}</p>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <div className="text-xl font-black text-zinc-900">{formatCurrency(order.total || 0)}</div>
                                       <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">Confirmed</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="xl:col-span-4 space-y-12">
                    <div className="bg-zinc-900 p-12 rounded-[56px] text-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)]">
                        <h3 className="text-xl font-black mb-8 flex items-center gap-4">
                           <Users size={20} className="text-brand-primary" />
                           Staff Personnel
                        </h3>
                        <div className="space-y-8">
                            {[
                                { name: "Lead Admin", status: "Commander", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" },
                                { name: "Cloud Automator", status: "Active", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" },
                            ].map((staff, i) => (
                                <motion.div key={i} whileHover={{ scale: 1.05 }} className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all border-2 border-white/10 relative">
                                        <Image src={staff.img} alt={staff.name} fill className="object-cover" sizes="56px" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white">{staff.name}</h4>
                                        <p className="text-[9px] font-black tracking-widest text-brand-primary uppercase mt-1">{staff.status}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="glass rounded-[56px] p-12 border-white/50">
                        <h3 className="text-sm font-black text-zinc-900 mb-8 uppercase tracking-widest">Platform Pulse</h3>
                        <div className="space-y-10">
                            {[
                                { lab: "Relational DB", val: "99.9%", color: "bg-brand-primary" },
                                { lab: "Traffic Bandwidth", val: "22%", color: "bg-zinc-900" }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-end">
                                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.lab}</span>
                                       <span className="text-sm font-black text-zinc-900">{stat.val}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-100 rounded-full">
                                       <motion.div 
                                         initial={{ width: 0 }}
                                         animate={{ width: stat.val }}
                                         transition={{ duration: 2, ease: "circOut" }}
                                         className={`h-full ${stat.color} rounded-full`} 
                                       />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
