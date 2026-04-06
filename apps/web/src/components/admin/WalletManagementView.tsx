'use client';

import { useState, useEffect } from 'react';
import { 
    Wallet, TrendingUp, Filter, Search, 
    ArrowUpCircle, ArrowDownCircle,
    RotateCcw, ShieldCheck, History,
    CreditCard, DollarSign, Send, Gift,
    Activity, ArrowUpRight, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export function WalletManagementView() {
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [amount, setAmount] = useState<number>(0);
    const [reason, setReason] = useState('');

    const fetchWallets = async () => {
        try {
            const res = await fetch('/api/admin/wallets');
            const data = await res.json();
            if (data.success) setStats(data.data);
        } catch (err) {
            toast.error('Ledger sync failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    const filteredUsers = stats.filter(u => 
        (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
        (u.email || '').toLowerCase().includes(search.toLowerCase())
    );

    const adjustBalance = async () => {
        if (!selectedUser || !amount || !reason) {
            toast.error('Complete all adjustment parameters');
            return;
        }

        try {
            const res = await fetch('/api/admin/wallets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: selectedUser.email, amount, reason })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Wallet updated successfully');
                setStats(prev => prev.map(u => u.email === selectedUser.email ? { ...u, balance: (u.balance || 0) + amount } : u));
                setSelectedUser(null);
                setAmount(0);
                setReason('');
            }
        } catch (err) {
            toast.error('Failed to adjust wallet balance');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-white/20">
                <Activity size={48} className="animate-pulse mb-6 text-brand" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse italic">Syncing Financial Ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            {/* Header / Global Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <div className="glass p-8 rounded-[32px] border border-white/5 relative overflow-hidden group">
                    <TrendingUp className="absolute -right-4 -bottom-4 text-brand opacity-[0.03] group-hover:opacity-[0.08] transition-all" size={120} />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 italic">Circulating Pet Cash</p>
                    <p className="text-4xl font-black text-white italic tracking-tighter">₹{stats.reduce((acc, u) => acc + (u.balance || 0), 0).toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-4 text-[10px] font-black text-brand italic">
                        <ArrowUpRight size={14} /> +₹12.4k THIS WEEK
                    </div>
                 </div>
                 <div className="glass p-8 rounded-[32px] border border-white/5">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 italic">Active Wallets</p>
                    <p className="text-4xl font-black text-white italic tracking-tighter">{stats.filter(u => (u.balance || 0) > 0).length}</p>
                    <p className="mt-4 text-[10px] font-bold text-white/20 uppercase tracking-widest italic">Across Lucknow Sector</p>
                 </div>
                 <div className="glass p-8 rounded-[32px] border border-white/5">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4 italic">System Provisions</p>
                    <p className="text-4xl font-black text-info italic tracking-tighter">₹2.4k</p>
                    <p className="mt-4 text-[10px] font-bold text-white/20 uppercase tracking-widest italic">MANUAL ADJUSTMENTS TODAY</p>
                 </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Search & List (Left) */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="relative group">
                         <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-brand transition-colors" size={20} />
                         <input 
                            placeholder="Identify pet parent by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-16 pl-16 pr-6 glass border border-white/5 rounded-2xl text-sm font-bold text-white focus:border-brand/40 outline-none transition-all shadow-2xl placeholder:text-white/10"
                         />
                    </div>

                    <div className="glass border border-white/5 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-3xl">
                         <div className="overflow-x-auto">
                             <table className="w-full text-left">
                                 <thead>
                                     <tr className="bg-white/[0.02] border-b border-white/5">
                                         <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Pet Parent Profile</th>
                                         <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Pet Cash Balance</th>
                                         <th className="px-8 py-5 text-right pr-8 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Actions</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {filteredUsers.map((user) => (
                                         <tr key={user.email} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors group">
                                             <td className="px-8 py-6">
                                                 <div className="flex items-center gap-4">
                                                      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-black text-white/60 group-hover:text-brand group-hover:border-brand/40 transition-all italic">
                                                          {user.name?.charAt(0) || 'U'}
                                                      </div>
                                                      <div>
                                                          <p className="text-sm font-black text-white italic uppercase tracking-tight leading-none">{user.name || 'Anonymous Node'}</p>
                                                          <p className="text-[10px] font-bold text-white/20 lowercase mt-1.5">{user.email}</p>
                                                      </div>
                                                 </div>
                                             </td>
                                             <td className="px-8 py-6">
                                                 <div className="flex items-center gap-3">
                                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.balance > 0 ? 'bg-success/10 text-success' : 'bg-white/5 text-white/20'}`}>
                                                          <Wallet size={18} />
                                                      </div>
                                                      <span className="text-lg font-black text-white italic tracking-tighter">₹{(user.balance || 0).toLocaleString()}</span>
                                                 </div>
                                             </td>
                                             <td className="px-8 py-6 text-right pr-8">
                                                  <button 
                                                    onClick={() => setSelectedUser(user)}
                                                    className="h-10 px-6 glass border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-widest italic rounded-xl hover:text-brand hover:border-brand/40 transition-all"
                                                  >
                                                      Adjust Balance
                                                  </button>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                    </div>
                </div>

                {/* Adjustment Console (Right Overlay Style) */}
                <div className="xl:col-span-1">
                    <AnimatePresence mode="wait">
                        {selectedUser ? (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass border border-white/5 rounded-[40px] p-10 shadow-2xl sticky top-8 overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-[60px] pointer-events-none" />

                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-info/10 border border-info/20">
                                            <Zap size={18} className="text-info" />
                                        </div>
                                        <h2 className="text-xl font-black uppercase tracking-tighter text-white italic leading-none">Console</h2>
                                    </div>
                                    <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white">
                                        <RotateCcw size={20} />
                                    </button>
                                </div>

                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl mb-10 flex items-center gap-4">
                                     <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center font-black text-brand text-xl italic">
                                         {selectedUser.name?.charAt(0) || 'U'}
                                     </div>
                                     <div>
                                         <p className="text-sm font-black text-white italic uppercase tracking-tight">{selectedUser.name || 'Anonymous'}</p>
                                         <p className="text-[10px] font-bold text-white/20 lowercase tracking-widest mt-1">{selectedUser.email}</p>
                                     </div>
                                </div>

                                <div className="space-y-8">
                                     <div>
                                         <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 block italic">Adjustment Yield (₹)</label>
                                         <div className="relative group">
                                             <div className="w-full h-16 glass border border-white/10 rounded-2xl flex items-center px-6 focus-within:border-brand/40 transition-all">
                                                 <span className="text-xl font-black text-brand italic mr-3">₹</span>
                                                 <input 
                                                    type="number"
                                                    placeholder="0"
                                                    value={amount || ''}
                                                    onChange={(e) => setAmount(Number(e.target.value))}
                                                    className="w-full bg-transparent text-2xl font-black text-white outline-none italic placeholder:text-white/5"
                                                 />
                                             </div>
                                         </div>
                                     </div>

                                     <div>
                                         <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-3 block italic">Audit Rationale</label>
                                         <textarea 
                                            placeholder="Reason for manual protocol..."
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            rows={3}
                                            className="w-full px-6 py-5 glass border border-white/5 rounded-3xl text-xs font-bold text-white/60 outline-none focus:border-brand/40 transition-all resize-none shadow-sm placeholder:text-white/10"
                                         />
                                     </div>

                                     <div className="grid grid-cols-2 gap-3">
                                          <button onClick={() => setAmount(50)} className="h-12 bg-white/[0.02] border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-brand transition-all italic">Reward ₹50</button>
                                          <button onClick={() => setAmount(100)} className="h-12 bg-white/[0.02] border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-brand transition-all italic">Reward ₹100</button>
                                     </div>

                                     <button 
                                        onClick={adjustBalance}
                                        className="w-full h-16 bg-brand text-white rounded-2xl shadow-xl shadow-brand/20 hover:translate-x-1 active:scale-95 transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 italic"
                                     >
                                         {amount >= 0 ? <Gift size={18} /> : <CreditCard size={18} />}
                                         Execute Provision
                                     </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="glass border-2 border-dashed border-white/5 rounded-[40px] p-12 text-center flex flex-col items-center justify-center h-full min-h-[500px] grayscale opacity-20">
                                <Send size={48} className="text-white mb-6" />
                                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Manual Control</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-2">Select node to adjust yield</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
