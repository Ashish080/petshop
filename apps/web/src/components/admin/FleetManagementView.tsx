'use client';

import { useState, useEffect } from 'react';
import { 
    Users, MapPin, Activity, Clock, 
    CheckCircle, ShieldAlert, Phone,
    MoreVertical, Power, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

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
        const interval = setInterval(fetchFleet, 30000); // 30s auto-refresh
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
                toast.success(`Rider marked as ${newStatus}`);
            }
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-text-tertiary">
                <Activity size={40} className="animate-spin mb-4" />
                <p className="text-label-sm font-black uppercase tracking-widest animate-pulse">Syncing Fleet Telemetry...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-bg-elevated p-6 rounded-[--radius-2xl] border border-border shadow-sm">
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">Total Fleet</p>
                    <p className="text-h2 font-black text-text-primary">{riders.length}</p>
                </div>
                <div className="bg-bg-elevated p-6 rounded-[--radius-2xl] border border-border shadow-sm">
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">Active Now</p>
                    <p className="text-h2 font-black text-success">{riders.filter(r => r.status === 'active').length}</p>
                </div>
                <div className="bg-bg-elevated p-6 rounded-[--radius-2xl] border border-border shadow-sm">
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">In Transit</p>
                    <p className="text-h2 font-black text-brand">{riders.reduce((acc, r) => acc + (r.activeOrdersCount || 0), 0)}</p>
                </div>
            </div>

            {/* Rider Grid (Modern Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {riders.map((rider) => (
                    <motion.div 
                        layout
                        key={rider._id}
                        className="bg-bg-elevated border border-border rounded-[--radius-3xl] p-6 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative"
                    >
                        {/* Background Accent */}
                        <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity ${rider.status === 'active' ? 'bg-success' : 'bg-text-tertiary'}`} />

                        <div className="flex items-start justify-between mb-6 relative">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl bg-bg-secondary border border-border flex items-center justify-center font-black text-h4 text-text-secondary group-hover:scale-105 transition-transform">
                                        {rider.name.charAt(0)}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-bg-elevated ${rider.status === 'active' ? 'bg-success animate-pulse' : 'bg-text-tertiary'}`} />
                                </div>
                                <div>
                                    <h3 className="text-label-md font-bold text-text-primary uppercase tracking-tight">{rider.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant={rider.status === 'active' ? 'success' : 'secondary'} size="sm" className="px-1.5 font-black uppercase text-[8px] tracking-widest">
                                            {rider.status || 'Offline'}
                                        </Badge>
                                        <span className="text-[10px] text-text-tertiary font-medium">LKO-FLEET-{rider._id.slice(-4).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                            <button className="p-2 text-text-tertiary hover:text-text-primary transition-colors">
                                <MoreVertical size={18} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-bg-secondary/50 p-3 rounded-xl border border-border/40">
                                <p className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <ShoppingBag size={10} /> Active Missions
                                </p>
                                <p className="text-label-md font-black text-text-primary">{rider.activeOrdersCount || 0}</p>
                            </div>
                            <div className="bg-bg-secondary/50 p-3 rounded-xl border border-border/40">
                                <p className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <Clock size={10} /> Reliability
                                </p>
                                <p className="text-label-md font-black text-info">98.4%</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4 border-t border-border">
                            <button className="flex-1 py-2 bg-bg-secondary hover:bg-bg-primary border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-text-primary transition-all flex items-center justify-center gap-2">
                                <Phone size={12} /> Contact
                            </button>
                            <button 
                                onClick={() => toggleStatus(rider._id, rider.status)}
                                className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${rider.status === 'active' ? 'bg-danger/10 text-danger hover:bg-danger hover:text-white' : 'bg-success/10 text-success hover:bg-success hover:text-white'}`}
                            >
                                <Power size={12} /> {rider.status === 'active' ? 'Disable' : 'Activate'}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {riders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center opacity-60 bg-bg-elevated rounded-[--radius-3xl] border border-dashed border-border mt-12">
                     <Users size={48} className="text-text-disabled mb-4" />
                     <p className="text-h4 font-black text-text-tertiary uppercase italic">No Riders Registered</p>
                     <p className="text-body-sm text-text-disabled mt-2">Create accounts with 'rider' role to see them here.</p>
                </div>
            )}
        </div>
    );
}

function ShoppingBag(props: any) {
    return <Activity {...props} />
}
