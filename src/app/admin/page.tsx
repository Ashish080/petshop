"use client";

import { themeConfig } from '@/config/theme';
import { brandConfig } from '@/config/brand';
import {
    LayoutDashboard,
    Dog,
    ShoppingBag,
    CalendarCheck,
    BarChart3,
    Users,
    Settings,
    PlusCircle,
    ArrowUpRight,
    Search,
    Bell,
    ExternalLink
} from 'lucide-react';
import Image from 'next/image';

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-bg-page flex flex-col md:flex-row transition-colors duration-300">
            {/* Admin Sidebar */}
            <aside className="w-full md:w-72 bg-nav-bg border-r border-card-border p-8 flex flex-col sticky top-0 md:h-screen shrink-0">
                <div className="mb-12">
                    <h2 className="text-2xl font-black text-brand-primary tracking-tighter flex items-center gap-2">
                        <LayoutDashboard size={28} strokeWidth={3} />
                        Admin CP
                    </h2>
                    <p className="text-[10px] font-black text-text-light uppercase tracking-[0.2em] mt-2">Brand Management v1.0</p>
                </div>

                <nav className="flex flex-col gap-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-light px-4 mb-2">Internal Tools</p>
                    <a href="#" className="flex items-center gap-3 px-5 py-4 bg-brand-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/25 transition-all">
                        <BarChart3 size={20} /> Overview
                    </a>
                    {[
                        { icon: Dog, label: "Manage Pets" },
                        { icon: ShoppingBag, label: "Inventory" },
                        { icon: CalendarCheck, label: "Appointments" },
                        { icon: Users, label: "Customers" },
                        { icon: Settings, label: "Site Config" },
                    ].map((item, idx) => (
                        <a key={idx} href="#" className="flex items-center gap-3 px-5 py-4 text-text-light hover:text-text-primary hover:bg-brand-primary/5 rounded-2xl font-black text-sm transition-all">
                            <item.icon size={20} /> {item.label}
                        </a>
                    ))}
                </nav>

                <div className="mt-auto pt-8 border-t border-card-border/50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white font-black text-xs">
                            AD
                        </div>
                        <div>
                            <h4 className="font-black text-text-primary text-sm leading-none mb-1">Admin User</h4>
                            <p className="text-[10px] font-black text-secondary tracking-widest uppercase">Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Admin Main Content */}
            <main className="flex-1 p-6 md:p-12 lg:p-16">
                <header className="mb-12 flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-3 tracking-tighter">Command Center</h1>
                        <p className="text-text-light font-medium text-lg max-w-xl">Welcome back, Boss! Here's how {brandConfig.name} is performing today.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-4 bg-card-bg border border-card-border rounded-2xl text-text-light hover:text-brand-primary transition-all relative">
                            <Bell size={24} />
                            <span className="absolute top-4 right-4 w-2 h-2 bg-secondary rounded-full"></span>
                        </button>
                        <button className="flex items-center gap-3 px-8 py-4 bg-brand-primary text-white font-black rounded-2xl shadow-xl shadow-brand-primary/25 hover:scale-105 active:scale-95 transition-all">
                            <PlusCircle size={22} strokeWidth={3} />
                            Quick Actions
                        </button>
                    </div>
                </header>

                {/* Big Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
                    {[
                        { label: "Total Revenue", value: "₹12,45,000", change: "+14.2%", color: "text-brand-primary", bg: "bg-brand-primary/5" },
                        { label: "Active Pets", value: "48", change: "+2 New", color: "text-secondary", bg: "bg-secondary/5" },
                        { label: "Appointments", value: "112", change: "+5 Today", color: "text-accent", bg: "bg-accent/5" },
                        { label: "New Customers", value: "850", change: "+12%", color: "text-green-500", bg: "bg-green-500/5" },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-nav-bg p-8 rounded-[32px] border border-card-border shadow-2xl relative overflow-hidden flex flex-col justify-between h-44 group hover:-translate-y-1 transition-all">
                            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-[60px] blur-2xl group-hover:scale-110 transition-transform`}></div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-light">{stat.label}</h3>
                            <div>
                                <p className={`text-4xl font-black mb-1 ${stat.color}`}>{stat.value}</p>
                                <p className="text-xs font-black text-text-light flex items-center gap-1">
                                    <ArrowUpRight size={14} className={stat.color} /> {stat.change} vs Last Month
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                    {/* Recent Inventory Management */}
                    <div className="xl:col-span-8">
                        <div className="bg-nav-bg rounded-[40px] p-10 border border-card-border shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-2xl font-black text-text-primary flex items-center gap-3">
                                    <ShoppingBag className="text-brand-primary" size={24} /> Recent Listings
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="relative hidden sm:block">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" size={14} />
                                        <input type="text" placeholder="Search..." className="pl-9 pr-4 py-2 bg-bg-page/50 border border-card-border rounded-xl text-xs font-bold text-text-primary focus:outline-none" />
                                    </div>
                                    <button className="text-xs font-black text-brand-primary hover:underline uppercase tracking-widest">View All</button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-card-border/50 text-left">
                                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-light">Item</th>
                                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-light">Category</th>
                                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-light">Price/Status</th>
                                            <th className="pb-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-light text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-card-border/30">
                                        {(typeof window !== 'undefined' && localStorage.getItem('allTransactions')) ? (
                                            JSON.parse(localStorage.getItem('allTransactions') || '[]').map((row: any, i: number) => (
                                                <tr key={i} className="group hover:bg-brand-primary/5 transition-colors">
                                                    <td className="py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div>
                                                                <h4 className="font-black text-text-primary text-sm leading-tight">{row.name}</h4>
                                                                <p className="text-[10px] font-black text-text-light tracking-widest">{row.id}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-6">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-primary/10 text-brand-primary border border-brand-primary/20`}>
                                                            {row.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-6 font-black text-text-primary text-sm">
                                                        <div>{row.price}</div>
                                                        <div className="text-[9px] font-bold text-text-light mt-1 truncate max-w-[120px]">{row.customer}</div>
                                                    </td>
                                                    <td className="py-6 text-right font-black text-text-light text-[10px] uppercase tracking-widest">{row.date}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            [
                                                { name: "Golden Retriever", type: "Adoption", data: "₹65,000", id: "#DOG-101", customer: "demo@petshop.in", date: "18 Mar" },
                                                { name: "Royal Canin Puppy", type: "Product", data: "₹5,200", id: "#PROD-242", customer: "rahul@gmail.com", date: "17 Mar" },
                                            ].map((row, i) => (
                                                <tr key={i} className="group hover:bg-brand-primary/5 transition-colors">
                                                    <td className="py-6">
                                                        <div>
                                                            <h4 className="font-black text-text-primary text-sm leading-tight">{row.name}</h4>
                                                            <p className="text-[10px] font-black text-text-light tracking-widest">{row.id}</p>
                                                        </div>
                                                    </td>
                                                    <td className="py-6">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${row.type === 'Product' ? 'bg-secondary/10 text-secondary' : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'}`}>
                                                            {row.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-6 font-black text-text-primary text-sm">
                                                        <div>{row.data}</div>
                                                        <div className="text-[9px] font-bold text-text-light mt-1">{row.customer}</div>
                                                    </td>
                                                    <td className="py-6 text-right font-black text-text-light text-[10px] uppercase tracking-widest">{row.date}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Team/Quick Chat Mock */}
                    <div className="xl:col-span-4 space-y-8">
                        <div className="bg-secondary p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                            <h3 className="text-xl font-black mb-6">Staff Picks</h3>
                            <div className="space-y-6">
                                {[
                                    { name: "Dr. Amy", status: "Vet / Online", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop" },
                                    { name: "John Doe", status: "Admin / Away", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" },
                                ].map((staff, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-sm">
                                        <div className="w-12 h-12 rounded-2xl overflow-hidden relative border-2 border-white/50">
                                            <Image src={staff.img} alt={staff.name} fill className="object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm">{staff.name}</h4>
                                            <p className="text-[10px] font-black tracking-widest opacity-80">{staff.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-nav-bg rounded-[40px] p-10 border border-card-border shadow-2xl">
                            <h3 className="text-lg font-black text-text-primary mb-6">System Health</h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-light">
                                        <span>Server Load</span>
                                        <span>24%</span>
                                    </div>
                                    <div className="h-2 w-full bg-bg-page rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[24%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-text-light">
                                        <span>Storage Used</span>
                                        <span>78%</span>
                                    </div>
                                    <div className="h-2 w-full bg-bg-page rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary w-[78%]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
