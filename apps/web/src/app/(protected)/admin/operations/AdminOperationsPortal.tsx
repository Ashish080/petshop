'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle, XCircle, Clock, Search, 
  ArrowRight, Filter, ChevronUp, ChevronDown, 
  AlertTriangle, RefreshCw, Eye, User, Truck,
  FileText, Activity, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

type Tab = 'Audit Logs' | 'Rider Verification' | 'Live Monitoring';

export default function AdminOperationsPortal() {
    const [activeTab, setActiveTab] = useState<Tab>('Audit Logs');
    const [logs, setLogs] = useState<any[]>([]);
    const [riders, setRiderrs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('all');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/audit-logs?page=${page}&action=${filter === 'all' ? '' : filter}`);
            const data = await res.json();
            if (data.success) {
                setLogs(data.data.logs);
                setTotalPages(data.data.pagination.pages);
            }
        } catch (err) {
            toast.error('Failed to command mission logs');
        } finally {
            setLoading(false);
        }
    }

    const fetchRiders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/kyc?status=${filter === 'all' ? 'pending' : filter}`);
            const data = await res.json();
            if (data.success) setRiderrs(data.data.riders);
        } catch (err) {
            toast.error('Failed to sync rider fleet');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (activeTab === 'Audit Logs') fetchLogs();
        if (activeTab === 'Rider Verification') fetchRiders();
    }, [activeTab, page, filter]);

    const handleVerifyRider = async (id: string, status: 'verified' | 'rejected', reason?: string) => {
        try {
            const res = await fetch('/api/admin/kyc', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ riderId: id, status, reason })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Rider ${status === 'verified' ? 'Authorized' : 'Blacklisted'}`);
                fetchRiders();
            } else {
                toast.error(data.error);
            }
        } catch (err) {
            toast.error('Identity sync failure');
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 lg:p-12 font-sans">
            {/* HUD HEADER */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16 relative">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-emerald-500 font-bold tracking-widest text-overline uppercase">
                        <Activity size={18} className="animate-pulse" /> PetShop Command & Control
                    </div>
                    <h1 className="text-display min-h-[1.5em] tracking-tighter text-white font-black italic">
                        MISSION {activeTab.toUpperCase().replace(' ', '_')}
                    </h1>
                </div>

                <div className="flex bg-[#111] p-1.5 rounded-2xl border border-white/5 backdrop-blur-3xl">
                    {['Audit Logs', 'Rider Verification', 'Live Monitoring'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab as Tab); setPage(1); setFilter('all'); }}
                            className={`px-8 py-3 rounded-xl font-black text-label-sm uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white/80'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <main className="grid grid-cols-1 gap-8 relative">
                {/* GLASS DASHBOARD PANEL */}
                <div className="bg-[#111] border border-white/5 rounded-[--radius-3xl] overflow-hidden min-h-[600px] shadow-2xl relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    
                    <div className="p-10 border-b border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="relative group/search">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within/search:text-emerald-500 transition-colors" size={20} />
                                <input 
                                    placeholder="Search mission targets..." 
                                    className="bg-[#050505] border border-white/10 rounded-2xl pl-14 pr-6 py-4 w-80 font-bold text-label-sm outline-none focus:border-emerald-500/50 transition-all placeholder:text-white/20"
                                />
                            </div>
                            <select 
                                onChange={(e) => setFilter(e.target.value)}
                                className="bg-[#050505] border border-white/10 rounded-2xl px-6 py-4 font-bold text-label-sm outline-none text-white/60 cursor-pointer hover:bg-[#111] transition-all"
                            >
                                <option value="all">Filter: ALL_ACTIONS</option>
                                {activeTab === 'Audit Logs' ? (
                                    <>
                                        <option value="WALLET_ADJUSTMENT">WALLET_ADJUSTMENT</option>
                                        <option value="STOCK_ADJUSTMENT">STOCK_ADJUSTMENT</option>
                                        <option value="SYSTEM_CONFIG">SYSTEM_CONFIG</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="pending">PENDING_REVIEW</option>
                                        <option value="verified">VERIFIED_RIDERS</option>
                                        <option value="rejected">BLACKLISTED</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div className="flex items-center gap-4">
                            <button onClick={activeTab === 'Audit Logs' ? fetchLogs : fetchRiders} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/5">
                                <RefreshCw size={20} className={loading ? 'animate-spin text-emerald-500' : 'text-white/60'} />
                            </button>
                            <div className="h-10 w-[1px] bg-white/5 mx-2"></div>
                            <span className="text-overline text-white/40 tracking-widest">Total Nodes: {activeTab === 'Audit Logs' ? logs.length : riders.length}</span>
                        </div>
                    </div>

                    <div className="relative z-10 custom-scrollbar overflow-x-auto">
                        <AnimatePresence mode="wait">
                            <motion.table 
                                key={activeTab + filter}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full text-left border-collapse"
                            >
                                <thead>
                                    <tr className="border-b border-white/5">
                                        {activeTab === 'Audit Logs' ? (
                                            <>
                                                <th className="px-10 py-6 text-overline text-white/30 tracking-widest font-black uppercase">Timestamp</th>
                                                <th className="px-10 py-6 text-overline text-white/30 tracking-widest font-black uppercase">Commander</th>
                                                <th className="px-10 py-6 text-overline text-white/30 tracking-widest font-black uppercase">Operation</th>
                                                <th className="px-10 py-6 text-overline text-white/30 tracking-widest font-black uppercase">Target</th>
                                                <th className="px-10 py-6 text-overline text-white/30 tracking-widest font-black uppercase">Changes</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="px-10 py-6 text-overline text-white/30 tracking-widest font-black uppercase">Rider Identity</th>
                                                <th className="px-10 py-6 text-overline text-white/30 tracking-widest font-black uppercase">Logistics Detail</th>
                                                <th className="px-10 py-6 text-overline text-white/30 tracking-widest font-black uppercase">Status</th>
                                                <th className="px-10 py-6 text-overline text-white/30 tracking-widest font-black uppercase">Action Control</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-10 py-32 text-center">
                                                <div className="flex flex-col items-center gap-6">
                                                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center animate-pulse">
                                                        <Activity className="text-emerald-500" size={32} />
                                                    </div>
                                                    <p className="text-overline text-white/40 animate-pulse tracking-widest font-black uppercase">Establishing secure uplink...</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : activeTab === 'Audit Logs' ? (
                                        logs.map((log) => (
                                            <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all group/row">
                                                <td className="px-10 py-8">
                                                    <div className="text-emerald-500 font-mono text-label-sm font-black italic">{new Date(log.createdAt).toLocaleTimeString()}</div>
                                                    <div className="text-white/20 text-[10px] mt-1 uppercase font-black tracking-widest font-mono">{new Date(log.createdAt).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="text-label-sm font-black tracking-tight">{log.adminEmail}</div>
                                                    <div className="text-overline text-white/40 mt-1 uppercase font-black tracking-widest">Admin Authorization</div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className={`px-4 py-1.5 rounded-lg text-overline font-black tracking-widest uppercase ${
                                                        log.action === 'WALLET_ADJUSTMENT' ? 'bg-blue-500/10 text-blue-400' :
                                                        log.action === 'STOCK_ADJUSTMENT' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                                                    }`}>
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="text-label-sm text-white/60 font-mono">{log.targetType.toUpperCase()}:{log.targetId.slice(-8)}</div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-red-400/50 font-black italic">{JSON.stringify(log.changes.before)}</div>
                                                        <ArrowRight size={14} className="text-white/20" />
                                                        <div className="text-emerald-400 font-black italic">{JSON.stringify(log.changes.after)}</div>
                                                    </div>
                                                    <div className="text-[11px] text-white/30 mt-2 font-bold tracking-tight">Reason: {log.reason}</div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        riders.map((rider) => (
                                            <tr key={rider.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 relative overflow-hidden">
                                                            {rider.image ? (
                                                                <img src={rider.image} className="w-full h-full object-cover" />
                                                            ) : <User size={24} />}
                                                        </div>
                                                        <div>
                                                            <div className="text-label-sm font-black tracking-tight">{rider.name}</div>
                                                            <div className="text-white/40 font-bold text-xs mt-0.5">{rider.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="grid grid-cols-2 gap-4 max-w-sm">
                                                        <div>
                                                            <div className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-1">ID Profile</div>
                                                            <div className="text-label-sm font-black italic">{rider.kycDetails?.idType || 'DATA_MISSING'}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-1">Vehicle Node</div>
                                                            <div className="text-label-sm font-black italic uppercase">{rider.kycDetails?.vehicleType || 'WALKING'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <span className={`px-4 py-1.5 rounded-lg text-overline font-black tracking-widest uppercase ${
                                                        rider.kycStatus === 'verified' ? 'bg-emerald-500/10 text-emerald-400' :
                                                        rider.kycStatus === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                                                    }`}>
                                                        {rider.kycStatus}
                                                    </span>
                                                </td>
                                                <td className="px-10 py-8">
                                                    {rider.kycStatus === 'pending' ? (
                                                        <div className="flex items-center gap-3">
                                                            <button 
                                                                onClick={() => handleVerifyRider(rider.id, 'verified')}
                                                                className="px-6 py-2.5 bg-emerald-500 text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                                                            >
                                                                Authorize
                                                            </button>
                                                            <button 
                                                                onClick={() => {
                                                                    const reason = prompt('Enter rejection reason:');
                                                                    if (reason) handleVerifyRider(rider.id, 'rejected', reason);
                                                                }}
                                                                className="px-6 py-2.5 bg-white/5 text-white/60 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all"
                                                            >
                                                                Deny
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            disabled
                                                            className="px-6 py-2.5 bg-white/5 text-white/20 rounded-xl font-black text-xs uppercase tracking-widest border border-white/5"
                                                        >
                                                            Protocol Locked
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </motion.table>
                        </AnimatePresence>
                    </div>

                    {/* PAGINATION HUD */}
                    {activeTab === 'Audit Logs' && totalPages > 1 && (
                        <div className="px-10 py-8 border-t border-white/5 flex items-center justify-between relative z-10">
                            <span className="text-overline text-white/30 tracking-widest">Page {page} of {totalPages}</span>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                                >
                                    <ChevronUp className="-rotate-90" size={20} />
                                </button>
                                <button 
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                                >
                                    <ChevronDown className="-rotate-90" size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* DECORATIVE ELEMENTS */}
            <div className="fixed bottom-0 left-0 p-12 pointer-events-none mix-blend-screen opacity-20">
                <Shield size={200} className="text-emerald-500/20" />
            </div>
            <div className="fixed top-1/2 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
        </div>
    );
}
