'use client';

import { useState, useEffect } from 'react';
import { 
    Users, MapPin, Activity, Clock, 
    CheckCircle, ShieldAlert, Phone,
    MoreVertical, Power, UserCheck,
    Navigation, Target, Zap, Crosshair
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import { TacticalFleetMap } from './TacticalFleetMap';

export function FleetManagementView() {
    const [riders, setRiders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFleet = async () => {
        try {
            const res = await fetch('/api/admin/fleet');
            const data = await res.json();
            if (data.success) setRiders(data.data);
        } catch (err) {
            toast.error('Failed to load fleet data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFleet();
        const interval = setInterval(fetchFleet, 30000); 
        return () => clearInterval(interval);
    }, []);

    const toggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'offline' : 'active';
        try {
            const res = await fetch('/api/admin/fleet', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setRiders(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
                toast.success(`Protocol ${newStatus.toUpperCase()} established`);
            }
        } catch (err) {
            toast.error('Protocol update failed');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <div className="relative mb-8">
                    <Activity size={48} className="text-brand animate-spin" />
                    <div className="absolute inset-0 bg-brand/20 blur-xl animate-pulse" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 animate-pulse italic">Synchronizing Tactical Nodes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in">
            
            {/* Split View Map + Fleet */}
            <div className="flex flex-col xl:flex-row gap-8">
                
                {/* Tactical Visualization */}
                <div className="xl:flex-1 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-brand/10 border border-brand/20">
                                <Crosshair size={16} className="text-brand" />
                            </div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Lucknow Tactical Grid</h3>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] uppercase font-black tracking-widest text-white/20 italic">
                            <span>Sector 1-9 Online</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        </div>
                    </div>
                    <TacticalFleetMap fleet={riders} />
                </div>

                {/* Fleet Registry Dashboard */}
                <div className="xl:w-[420px] space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-info/10 border border-info/20">
                                <Users size={16} className="text-info" />
                            </div>
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Active Fleet</h3>
                        </div>
                    </div>
                    
                    <div className="h-[600px] overflow-y-auto space-y-4 pr-3 custom-scrollbar">
                        {riders.map((rider) => (
                            <motion.div 
                                key={rider._id}
                                className="p-6 glass rounded-[32px] border border-white/5 hover:border-brand/30 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-2xl opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" style={{ backgroundColor: rider.status === 'active' ? '#00C48C' : '#7C5CFC' }} />
                                
                                <div className="flex items-center gap-4 mb-6 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center font-black text-2xl text-white italic transition-transform group-hover:scale-110">
                                        {rider.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-black text-white italic uppercase tracking-tight">{rider.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className={`w-1.5 h-1.5 rounded-full ${rider.status === 'active' ? 'bg-success animate-pulse shadow-[0_0_8px_rgba(0,196,140,0.5)]' : 'bg-white/20'}`} />
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${rider.status === 'active' ? 'text-success' : 'text-white/20'}`}>
                                                {rider.status === 'active' ? 'Operational' : 'Node Offline'}
                                            </span>
                                        </div>
                                    </div>
                                    <button onClick={() => toggleStatus(rider._id, rider.status)} className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${rider.status === 'active' ? 'bg-danger/10 border-danger/20 text-danger hover:bg-danger hover:text-white' : 'bg-success/10 border-success/20 text-success hover:bg-success hover:text-white'}`}>
                                        <Power size={16} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Missions</p>
                                        <p className="text-xl font-black text-white italic tracking-tighter">{rider.activeOrdersCount || 0}</p>
                                    </div>
                                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Pulse</p>
                                        <p className="text-xl font-black text-brand italic tracking-tighter">98.4%</p>
                                    </div>
                                </div>

                                <button className="w-full h-12 glass border border-white/10 hover:border-white/30 rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all group/btn relative z-10 overflow-hidden">
                                    <div className="absolute inset-0 bg-brand/5 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                                    <Phone size={14} className="group-hover/btn:scale-110 transition-transform text-white/40 group-hover/btn:text-brand" />
                                    <span className="relative z-10">Contact Protocol</span>
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Fleet Status Hub Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">
                 {[
                    { label: "Active Fleet", value: riders.filter(r => r.status === 'active').length, icon: Navigation, color: "#00C48C" },
                    { label: "Transit Mission", value: riders.reduce((acc, r) => acc + (r.activeOrdersCount || 0), 0), icon: Zap, color: "#FF6B00" },
                    { label: "Grid Health", value: "99.8%", icon: Activity, color: "#7C5CFC" },
                    { label: "Avg Delivery", value: "32m", icon: Clock, color: "#FFB020" }
                 ].map((stat, i) => (
                    <div key={i} className="p-8 glass rounded-[32px] border border-white/5 relative overflow-hidden group">
                        <stat.icon className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.03] group-hover:scale-110 group-hover:-rotate-12 transition-all" style={{ color: stat.color }} />
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">{stat.label}</p>
                        <h4 className="text-4xl font-black text-white tracking-tighter italic" style={{ color: stat.color }}>{stat.value}</h4>
                    </div>
                 ))}
            </div>

        </div>
    );
}
