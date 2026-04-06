'use client';

import { useState, useEffect } from 'react';
import { 
    Trophy, Medal, Star, TrendingUp, 
    Zap, Activity, Target, ChevronRight,
    User, Award, Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

/* ── SUB-COMPONENTS ── */
function GoldMedal(props: any) { return <Award {...props} /> }
function SilverMedal(props: any) { return <Medal {...props} /> }
function BronzeMedal(props: any) { return <Star {...props} /> }

function PodiumRank({ rider, rank, height, color, badgeColor, isWinner = false }: any) {
    const medals: Record<number, any> = { 1: GoldMedal, 2: SilverMedal, 3: BronzeMedal };
    const MedalIcon = medals[rank] || Award;

    return (
        <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center gap-4 flex-1 max-w-[120px] group"
        >
            <div className="relative">
                <div className={`w-16 h-16 rounded-3xl bg-bg-elevated border-2 transition-all group-hover:scale-110 p-0.5 shadow-xl flex items-center justify-center font-black text-h3 text-text-secondary ${isWinner ? 'border-brand' : 'border-border'}`}>
                    {rider.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-white border-4 border-bg-primary shadow-lg ${rank === 1 ? 'bg-brand' : rank === 2 ? 'bg-text-tertiary' : 'bg-warning'}`}>
                    <MedalIcon size={16} />
                </div>
            </div>
            
            <div className="text-center w-full">
                <p className="text-[10px] font-black text-text-primary truncate uppercase tracking-tighter mb-1">{rider.name}</p>
                <div className={`w-full ${height} ${badgeColor} border-x border-t border-border/30 rounded-t-2xl flex flex-col items-center justify-center pt-2 overflow-hidden relative shadow-sm`}>
                    <p className={`text-h3 font-black italic tracking-tight ${color}`}>{rider.points}</p>
                    <p className="text-[8px] font-black text-text-tertiary uppercase tracking-widest opacity-60">SCORE</p>
                    {isWinner && (
                        <div className="absolute top-2 w-full h-1 bg-brand/20 animate-pulse" />
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* ── MAIN COMPONENT ── */
export function LeaderboardView() {
    const [riders, setRiders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLeaderboard = async () => {
        try {
            const res = await fetch('/api/rider/leaderboard');
            const data = await res.json();
            if (data.success) setRiders(data.data);
        } catch (err) {
            toast.error('Failed to sync leaderboard telemetry');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 60000); // 60s auto-refresh
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-text-tertiary">
                <Trophy size={40} className="animate-bounce mb-4 text-brand" />
                <p className="text-label-sm font-black uppercase tracking-widest animate-pulse">Syncing Fleet Rankings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Context / Actions Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-h3 font-black text-text-primary tracking-tighter uppercase italic leading-none">Fleet Legends</h2>
                    <p className="text-label-sm text-text-secondary font-medium tracking-tight mt-1 opacity-80">(Last 7 Days)</p>
                </div>
                <div className="w-12 h-12 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center text-brand">
                    <Crown size={24} />
                </div>
            </div>

            {/* Podium Section (Top 3) */}
            <div className="flex items-end justify-center gap-4 py-12 relative overflow-hidden px-4">
                <div className="absolute inset-0 bg-gradient-to-t from-brand/5 via-brand/0 to-transparent pointer-events-none" />
                
                {riders[1] && <PodiumRank rider={riders[1]} rank={2} height="h-32" color="text-text-tertiary" badgeColor="bg-text-tertiary/10" />}
                {riders[0] && <PodiumRank rider={riders[0]} rank={1} height="h-44" color="text-brand" badgeColor="bg-brand/10" isWinner />}
                {riders[2] && <PodiumRank rider={riders[2]} rank={3} height="h-24" color="text-warning" badgeColor="bg-warning/10" />}
            </div>

            {/* Main Ranking List */}
            <div className="space-y-4">
                {riders.slice(3).map((rider, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={rider.rank}
                        className={`p-5 rounded-2xl border transition-all flex items-center justify-between group cursor-default ${rider.isCurrentUser ? 'bg-brand/5 border-brand/30 shadow-lg' : 'bg-bg-elevated border-border/50 hover:bg-bg-secondary hover:border-brand/20 shadow-sm'}`}
                    >
                        <div className="flex items-center gap-4">
                             <div className="w-8 h-8 rounded-full bg-bg-secondary border border-border flex items-center justify-center font-black text-text-tertiary group-hover:text-brand group-hover:border-brand transition-all text-xs">
                                 {rider.rank}
                             </div>
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-2xl bg-bg-primary border border-border flex items-center justify-center font-black text-text-tertiary">
                                     {rider.name.charAt(0)}
                                 </div>
                                 <div>
                                     <h3 className="text-label-md font-bold text-text-primary capitalize">{rider.name} {rider.isCurrentUser && <span className="text-brand ml-2">(YOU)</span>}</h3>
                                     <div className="flex items-center gap-2 mt-0.5">
                                         <Badge variant="info" size="sm" className="px-1 py-0.5 bg-bg-primary text-text-disabled text-[8px] font-black uppercase tracking-widest">{rider.deliveries} MISSIONS</Badge>
                                         <span className="text-[10px] text-text-tertiary font-bold">{Math.floor(rider.points / 1.2)} CRITICALLY ACCURATE</span>
                                     </div>
                                 </div>
                             </div>
                        </div>
                        <div className="text-right">
                             <p className="text-h4 font-black italic text-text-primary group-hover:scale-110 transition-transform">{rider.points.toLocaleString()}</p>
                             <p className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">LOYALTY PTS</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {riders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                     <Target size={48} className="text-text-disabled mb-4" />
                     <p className="text-label-lg font-black text-text-tertiary uppercase italic tracking-tighter">Arena Cold Syncing</p>
                     <p className="text-body-sm text-text-disabled mt-2 uppercase tracking-wide">Perform missions to enter the legends board</p>
                </div>
            )}
        </div>
    );
}
