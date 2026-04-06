'use client';

import { useState, useEffect } from 'react';
import { 
    Activity, ShieldAlert, Cpu, Terminal, 
    ArrowRight, ChevronRight, Search, Filter,
    Eye, Database, Globe, User, Package, ShoppingBag,
    TrendingUp, Wallet, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';

export function SystemPulseView() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/admin/audit-logs?limit=50');
            const data = await res.json();
            if (data.success) {
                // Ensure logs are extracted correctly from the paginated response
                setLogs(data.data.logs || []);
            }
        } catch (err) {
            console.error('Pulse sync failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 15000); // 15s refresh for simulated live pulse
        return () => clearInterval(interval);
    }, []);

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'WALLET_ADJUSTMENT': return <Wallet size={14} className="text-success" />;
            case 'STOCK_ADJUSTMENT': return <Package size={14} className="text-warning" />;
            case 'ORDER_MODIFICATION': return <ShoppingBag size={14} className="text-info" />;
            case 'SYSTEM_CONFIG': return <Database size={14} className="text-danger" />;
            default: return <Activity size={14} className="text-brand" />;
        }
    };

    return (
        <div className="space-y-10 animate-fade-in pb-32">
            
            {/* PULSE HEADER COMMAND */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-10 glass rounded-[40px] relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-brand/10 border border-brand/20">
                            <Terminal size={20} className="text-brand" />
                        </div>
                        <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">System Pulse</h2>
                    </div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse shadow-[0_0_8px_rgba(255,107,0,0.5)]" />
                        Live Event Stream Protocol Active
                    </p>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="hidden lg:flex items-center gap-8 mr-8">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1 italic">Event Ingress</p>
                            <p className="text-2xl font-black text-white italic tracking-tighter">0.82/sec</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1 italic">Active Nodes</p>
                            <p className="text-2xl font-black text-success italic tracking-tighter">312</p>
                        </div>
                    </div>
                    <button className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 text-white flex items-center gap-3 font-black text-[10px] uppercase tracking-widest italic transition-all group">
                        <Globe size={18} className="text-white/20 group-hover:text-brand" />
                        Network Map
                    </button>
                </div>
            </div>

            {/* PULSE GRID ENGINE */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                
                {/* 1. FILTER COMMAND BAR */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                            <Filter size={16} className="text-white/40" />
                        </div>
                        <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">Protocols</h3>
                    </div>

                    <div className="space-y-3">
                        {[
                            { id: 'all', label: 'Universal Feed', icon: Activity },
                            { id: 'WALLET_ADJUSTMENT', label: 'Financial Pulse', icon: Wallet },
                            { id: 'STOCK_ADJUSTMENT', label: 'Asset Ingress', icon: Package },
                            { id: 'ORDER_MODIFICATION', label: 'Mission Meta', icon: ShoppingBag },
                            { id: 'SYSTEM_CONFIG', label: 'Base Layer', icon: Database }
                        ].map((btn) => (
                            <button 
                                key={btn.id}
                                onClick={() => setFilter(btn.id)}
                                className={`w-full h-14 px-6 rounded-2xl flex items-center justify-between transition-all group ${filter === btn.id ? 'bg-brand text-white shadow-xl shadow-brand/20' : 'bg-white/[0.02] border border-white/5 text-white/40 hover:bg-white/[0.04]'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <btn.icon size={18} className={filter === btn.id ? 'text-white' : 'text-white/20'} />
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{btn.label}</span>
                                </div>
                                {filter === btn.id && <ChevronRight size={14} className="text-white/60" />}
                            </button>
                        ))}
                    </div>

                    {/* Operational Health Indicator */}
                    <div className="p-8 glass rounded-[32px] border border-white/5 relative overflow-hidden group mt-12 bg-success/5">
                        <Cpu className="absolute -right-6 -bottom-6 w-32 h-32 text-success opacity-[0.03] rotate-12" />
                        <h4 className="text-[10px] font-black text-success uppercase tracking-[0.3em] mb-4">Node Integrity</h4>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-3xl font-black text-white italic tracking-tighter">99.98%</p>
                                <p className="text-[9px] font-bold text-white/30 uppercase mt-2 italic tracking-widest">Global S-Layer Status</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. EVENT STREAM */}
                <div className="xl:col-span-3 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-info/10 border border-info/20">
                                <Terminal size={16} className="text-info" />
                            </div>
                            <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">Live Ingress Stream</h3>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/20 italic">
                            <span>Sensing Node: UP-73</span>
                            <div className="w-1 h-1 bg-brand rounded-full animate-pulse" />
                        </div>
                    </div>

                    <div className="h-[700px] overflow-y-auto space-y-4 pr-4 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {logs.filter(l => filter === 'all' || l.action === filter).map((log, i) => (
                                <motion.div 
                                    key={log._id || log.id}
                                    layout
                                    initial={{ opacity: 0, x: -20, scale: 0.98 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-6 glass rounded-[28px] border border-white/5 hover:border-brand/40 transition-all group flex items-start gap-6 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] blur-3xl pointer-events-none group-hover:bg-brand/5 transition-colors" />
                                    
                                    {/* Action Identifier Zone */}
                                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110">
                                        {getActionIcon(log.action)}
                                    </div>

                                    {/* Data Stream Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-[12px] font-bold text-white italic uppercase tracking-tighter leading-none">{log.action.replace('_', ' ')}</h4>
                                                <Badge className="bg-white/5 text-white/30 border-white/10 text-[8px] font-black tracking-widest italic">{log.targetType.toUpperCase()}</Badge>
                                            </div>
                                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest whitespace-nowrap">{new Date(log.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                        
                                        <p className="text-[11px] font-bold text-white/60 line-clamp-1 mb-4 flex items-center gap-2">
                                            <User size={10} className="text-white/20" />
                                            {log.adminEmail} <ArrowRight size={8} className="text-white/20 mx-1" /> {log.reason}
                                        </p>

                                        {/* Precision Diff Visualization */}
                                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between gap-6 overflow-hidden">
                                            <div className="min-w-0 flex-1 truncate text-[10px] font-mono text-white/20 uppercase tracking-tight">
                                                ID: {(log.targetId || '').slice(-12)}
                                            </div>
                                            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-white italic text-[11px] font-black">
                                                <ArrowUpRight size={12} className="text-brand" />
                                                Ingested
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* EMPTY STATE PROTOCOL */}
                        {logs.filter(l => filter === 'all' || l.action === filter).length === 0 && !loading && (
                            <div className="flex flex-col items-center justify-center py-40 text-center opacity-20 grayscale">
                                <Database size={48} className="mb-6" />
                                <h4 className="text-xl font-black italic uppercase tracking-tighter text-white">Event Horizon Empty</h4>
                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Zero ingress detected in this sector</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
