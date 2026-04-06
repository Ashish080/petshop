'use client';

import { useSession, signOut } from 'next-auth/react';
import { User, Mail, Shield, LogOut, Package, Star, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RiderProfile() {
    const { data: session } = useSession();
    
    if (!session?.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
                <div className="text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <User size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">Session Expired</h3>
                    <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Re-authentication required</p>
                    <Link href="/auth/login" className="mt-6 inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                        Return to Hub
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-indigo-600 p-8 pt-12 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[60px] translate-x-32 -translate-y-32"></div>
                
                <Link href="/rider" className="inline-flex items-center gap-2 mb-8 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5">
                    <ArrowLeft size={16} /> Back to Missions
                </Link>

                <div className="flex items-center gap-6 relative z-10">
                    <div className="w-24 h-24 rounded-[32px] bg-white border-4 border-white/10 overflow-hidden shadow-2xl">
                        <img src={`https://ui-avatars.com/api/?name=${session.user.name}&background=6366F1&color=fff&size=128`} alt="avatar" />
                    </div>
                    <div>
                        <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-widest mb-2 border border-white/10">Tactical Rider Node</div>
                        <h1 className="text-3xl font-black tracking-tight">{session.user.name}</h1>
                        <p className="text-indigo-100/70 text-xs font-bold uppercase tracking-widest mt-1">Operational ID: {session.user.id.slice(-8)}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto -mt-10 px-6 relative z-20 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4">
                            <Package size={20} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 leading-none">148</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Deliveries</p>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit mb-4">
                            <Star size={20} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 leading-none">4.92</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Legacy Rating</p>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-loose">Identity Synchronization</h4>
                    </div>
                    <div className="p-10 space-y-8">
                        <div className="flex gap-6 items-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                <Mail size={20} />
                            </div>
                            <div className="flex-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Communication Node</label>
                                <p className="text-sm font-black text-slate-800">{session.user.email}</p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                <Shield size={20} />
                            </div>
                            <div className="flex-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Clearance Level</label>
                                <p className="text-sm font-black text-slate-800">Assigned: {session.user.role?.toUpperCase()}</p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-center">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                <Calendar size={20} />
                            </div>
                            <div className="flex-1">
                                <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Ops Since</label>
                                <p className="text-sm font-black text-slate-800">March 2026</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4 pt-6">
                    <button 
                        onClick={() => signOut({ callbackUrl: '/auth/login' })}
                        className="w-full bg-rose-50 text-rose-600 py-6 rounded-[32px] font-black text-[10px] uppercase tracking-widest border border-rose-100 flex items-center justify-center gap-3 hover:bg-rose-600 hover:text-white transition-all shadow-xl shadow-rose-500/5 group"
                    >
                        <LogOut size={18} className="group-hover:-rotate-12 transition-transform" /> 
                        Terminate Session (Logout)
                    </button>
                    <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest italic leading-loose px-10">Verification key is stored locally for this node. Ensure secure shutdown of the mission logs before exit.</p>
                </div>
            </main>
        </div>
    );
}
