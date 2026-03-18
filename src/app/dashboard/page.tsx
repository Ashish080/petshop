"use client";

import { themeConfig } from '@/config/theme';
import { brandConfig } from '@/config/brand';
import Image from 'next/image';
import { Activity, Calendar, Syringe, Plus, Settings, User, Bell, Search, Heart, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-bg-page flex flex-col md:flex-row transition-colors duration-300">
            {/* Sidebar */}
            <aside className="w-full md:w-80 bg-nav-bg border-r border-card-border p-8 flex flex-col gap-10 sticky top-0 md:h-screen shrink-0">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/10">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden relative shadow-lg shadow-brand-primary/20">
                            <Image src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" alt="User" fill className="object-cover" />
                        </div>
                        <div>
                            <h3 className="font-black text-text-primary text-lg leading-none mb-1">Sarah J.</h3>
                            <p className="text-xs font-black text-brand-primary uppercase tracking-widest">Premium Member</p>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-light px-4 mb-2">Main Menu</p>
                        <a href="#" className="flex items-center justify-between group px-5 py-4 bg-brand-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-brand-primary/25 transition-all hover:scale-[1.02]">
                            <div className="flex items-center gap-3">
                                <Activity size={20} /> Dashboard
                            </div>
                            <ChevronRight size={16} />
                        </a>
                        {[
                            { icon: Calendar, label: "Appointments" },
                            { icon: Heart, label: "My Favorites" },
                            { icon: Bell, label: "Notifications", badge: "3" },
                            { icon: Settings, label: "Settings" },
                        ].map((item, idx) => (
                            <a key={idx} href="#" className="flex items-center justify-between px-5 py-4 text-text-light hover:text-text-primary hover:bg-brand-primary/5 rounded-2xl font-black text-sm transition-all">
                                <div className="flex items-center gap-3">
                                    <item.icon size={20} /> {item.label}
                                </div>
                                {item.badge && (
                                    <span className="w-5 h-5 flex items-center justify-center bg-secondary text-white text-[10px] rounded-full shadow-lg shadow-secondary/20">
                                        {item.badge}
                                    </span>
                                )}
                            </a>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto">
                    <div className="bg-secondary/10 p-6 rounded-3xl border border-secondary/20 relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary/20 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                        <p className="text-xs font-black text-secondary mb-2 uppercase tracking-widest">Support</p>
                        <h4 className="font-black text-text-primary text-sm mb-4">Need help with your pet?</h4>
                        <button className="w-full py-3 bg-secondary text-white rounded-xl font-black text-xs transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-secondary/20">
                            Contact Vet
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto">
                <header className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-3 tracking-tighter">My Pets Passport</h1>
                        <p className="text-text-light font-medium text-lg leading-relaxed max-w-xl">Track wellness, vaccinations, and all the paw-some moments.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                            <input
                                type="text"
                                placeholder="Search records..."
                                className="w-full pl-12 pr-6 py-4 bg-card-bg border border-card-border rounded-2xl text-sm font-bold text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all shadow-sm"
                            />
                        </div>
                        <button className="p-4 bg-brand-primary text-white rounded-2xl shadow-xl shadow-brand-primary/25 hover:scale-105 active:scale-95 transition-all">
                            <Plus size={24} strokeWidth={3} />
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12">
                    {/* Pet Profile Card */}
                    <div className="xl:col-span-1">
                        <div className="bg-nav-bg rounded-[40px] p-10 border border-card-border shadow-2xl relative overflow-hidden group transition-all hover:shadow-brand-primary/5">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 rounded-bl-[100px] -z-1 transition-all group-hover:scale-110"></div>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-36 h-36 rounded-[48px] overflow-hidden border-8 border-bg-page shadow-2xl relative mb-8 rotate-3 transition-transform group-hover:rotate-0">
                                    <Image src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop" fill className="object-cover" alt="Bella" />
                                </div>
                                <h2 className="text-4xl font-black text-text-primary mb-2">Bella</h2>
                                <p className="text-secondary font-black tracking-tight mb-8">Golden Retriever • 2 Years</p>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="bg-bg-page p-5 rounded-3xl border border-card-border transition-colors group-hover:bg-brand-primary/5">
                                        <span className="text-[10px] text-text-light font-black uppercase tracking-[0.2em] block mb-2">Weight</span>
                                        <span className="text-xl font-black text-text-primary">24.5 kg</span>
                                    </div>
                                    <div className="bg-bg-page p-5 rounded-3xl border border-card-border transition-colors group-hover:bg-brand-primary/5">
                                        <span className="text-[10px] text-text-light font-black uppercase tracking-[0.2em] block mb-2">Gender</span>
                                        <span className="text-xl font-black text-text-primary">Female</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats & Records */}
                    <div className="xl:col-span-2 space-y-10">
                        {/* Status Cards */}
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="bg-nav-bg p-8 rounded-[32px] border border-card-border flex items-center gap-6 shadow-xl transition-all hover:-translate-y-1">
                                <div className="p-5 rounded-2xl bg-brand-primary/10 text-brand-primary shadow-lg shadow-brand-primary/5">
                                    <Syringe size={32} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-text-light font-black text-[10px] uppercase tracking-[0.2em] mb-1">Next Vaccination</h3>
                                    <p className="text-xl font-black text-text-primary mb-1 leading-none">Rabies Booster</p>
                                    <p className="text-xs font-black text-orange-500 bg-orange-500/10 inline-block px-3 py-1 rounded-full mt-2">Due in 14 days</p>
                                </div>
                            </div>
                            <div className="bg-nav-bg p-8 rounded-[32px] border border-card-border flex items-center gap-6 shadow-xl transition-all hover:-translate-y-1">
                                <div className="p-5 rounded-2xl bg-secondary/10 text-secondary shadow-lg shadow-secondary/5">
                                    <Calendar size={32} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="text-text-light font-black text-[10px] uppercase tracking-[0.2em] mb-1">Upcoming Grooming</h3>
                                    <p className="text-xl font-black text-text-primary mb-1 leading-none">Spa & De-shedding</p>
                                    <p className="text-xs font-black text-text-light bg-text-light/10 inline-block px-3 py-1 rounded-full mt-2">Oct 24th, 10:00 AM</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Health Records */}
                        <div className="bg-nav-bg rounded-[40px] p-10 border border-card-border shadow-2xl relative overflow-hidden">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-2xl font-black text-text-primary flex items-center gap-3">
                                    <Activity className="text-brand-primary" size={24} /> Health Records
                                </h3>
                                <button className="text-xs font-black text-brand-primary hover:underline uppercase tracking-widest transition-all">View All</button>
                            </div>
                            <div className="grid gap-6">
                                {[
                                    { date: "Aug 12, 2025", title: "Annual Checkup", Vet: "Dr. Smith", status: "Completed", type: "General" },
                                    { date: "May 04, 2025", title: "Deworming", Vet: "Nurse Joy", status: "Completed", type: "Vaccine" },
                                    { date: "Jan 18, 2025", title: "Microchip Installed", Vet: "Dr. Smith", status: "Completed", type: "Surgery" }
                                ].map((record, i) => (
                                    <div key={i} className="flex items-center justify-between p-6 bg-bg-page/40 rounded-3xl border border-card-border/30 transition-all hover:bg-brand-primary/5 hover:border-brand-primary/20 cursor-pointer group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-card-bg rounded-2xl text-text-light font-black text-xs shadow-sm group-hover:scale-110 transition-transform">
                                                {record.date.split(' ')[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-text-primary text-lg leading-tight mb-1">{record.title}</h4>
                                                <p className="text-xs font-black text-text-light uppercase tracking-wider">{record.Vet} • <span className="text-brand-primary/70">{record.type}</span></p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="px-5 py-2.5 bg-green-500/10 text-green-500 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border border-green-500/20">
                                                {record.status}
                                            </span>
                                            <ChevronRight className="text-text-light opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" size={20} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
