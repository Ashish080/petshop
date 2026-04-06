'use client';

import { useState, useEffect } from 'react';
import { 
    Wallet, TrendingUp, Filter, Search, 
    ArrowUpCircle, ArrowDownCircle,
    RotateCcw, ShieldCheck, History,
    CreditCard, DollarSign, Send, Gift
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
            toast.error('Failed to load wallet telemetry');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    const filteredUsers = stats.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
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
                toast.success('Wallet updated successfully 🐾');
                setStats(prev => prev.map(u => u.email === selectedUser.email ? { ...u, balance: u.balance + amount } : u));
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
            <div className="flex flex-col items-center justify-center py-24 text-text-tertiary">
                <Wallet size={40} className="animate-pulse mb-4 text-brand" />
                <p className="text-label-sm font-black uppercase tracking-widest animate-pulse">Syncing Financial Ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Global Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 <div className="bg-bg-elevated p-6 rounded-[--radius-2xl] border border-border shadow-sm flex flex-col justify-between group overflow-hidden relative">
                    <TrendingUp className="absolute top-4 right-4 text-success opacity-20 pointer-events-none group-hover:scale-110 transition-transform" size={48} />
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">Circulating Pet Cash</p>
                    <p className="text-h2 font-black text-text-primary">₹{stats.reduce((acc, u) => acc + (u.balance || 0), 0).toLocaleString()}</p>
                 </div>
                 <div className="bg-bg-elevated p-6 rounded-[--radius-2xl] border border-border shadow-sm">
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">Active Wallets</p>
                    <p className="text-h2 font-black text-brand">{stats.filter(u => u.balance > 0).length}</p>
                 </div>
                 <div className="bg-bg-elevated p-6 rounded-[--radius-2xl] border border-border shadow-sm">
                    <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">Manual Provisions</p>
                    <p className="text-h2 font-black text-info">₹2.4k Today</p>
                 </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Search & List (Left) */}
                <div className="xl:col-span-2 space-y-4">
                    <div className="relative group">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" size={18} />
                         <input 
                            placeholder="Search pet parents by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-bg-elevated border border-border rounded-2xl text-label-md focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none transition-all shadow-sm"
                         />
                    </div>

                    <div className="bg-bg-elevated border border-border rounded-[--radius-3xl] overflow-hidden shadow-sm">
                         <div className="overflow-x-auto">
                             <table className="w-full text-left border-collapse">
                                 <thead>
                                     <tr className="bg-bg-secondary text-text-tertiary text-[10px] uppercase tracking-widest font-black border-b border-border">
                                         <th className="p-5 pl-8">Pet Parent</th>
                                         <th className="p-5">Pet Cash Balance</th>
                                         <th className="p-5 text-right pr-8">Action</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {filteredUsers.map((user) => (
                                         <tr key={user.email} className="border-b border-border/50 last:border-0 hover:bg-bg-secondary transition-colors group">
                                             <td className="p-5 pl-8">
                                                 <div className="flex items-center gap-3">
                                                      <div className="w-10 h-10 rounded-full bg-bg-secondary border border-border flex items-center justify-center font-bold text-text-tertiary group-hover:text-brand group-hover:border-brand transition-colors">
                                                          {user.name.charAt(0)}
                                                      </div>
                                                      <div>
                                                          <p className="text-label-md font-bold text-text-primary capitalize">{user.name}</p>
                                                          <p className="text-[11px] text-text-tertiary lowercase">{user.email}</p>
                                                      </div>
                                                 </div>
                                             </td>
                                             <td className="p-5">
                                                 <div className="flex items-center gap-2">
                                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${user.balance > 0 ? 'bg-success/10 text-success' : 'bg-text-tertiary/10 text-text-tertiary'}`}>
                                                          <Wallet size={16} />
                                                      </div>
                                                      <span className="text-label-lg font-black text-text-primary italic">₹{user.balance.toLocaleString()}</span>
                                                 </div>
                                             </td>
                                             <td className="p-5 text-right pr-8">
                                                  <button 
                                                    onClick={() => setSelectedUser(user)}
                                                    className="px-4 py-2 bg-brand/10 text-brand text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-brand hover:text-white transition-all shadow-sm"
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
                                className="bg-bg-elevated border border-border rounded-[--radius-3xl] p-8 shadow-xl sticky top-8 overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <ShieldCheck size={120} />
                                </div>

                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-h4 font-black uppercase tracking-tighter text-text-primary italic">Support Console</h2>
                                    <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-bg-secondary rounded-full transition-colors text-text-tertiary">
                                        <RotateCcw size={20} />
                                    </button>
                                </div>

                                <div className="bg-bg-secondary p-5 rounded-2xl border border-border/50 mb-8 flex items-center gap-4">
                                     <div className="w-14 h-14 rounded-full bg-brand/10 border-2 border-brand/20 flex items-center justify-center font-black text-brand text-h4">
                                         {selectedUser.name.charAt(0)}
                                     </div>
                                     <div>
                                         <p className="text-label-md font-bold text-text-primary">{selectedUser.name}</p>
                                         <p className="text-[11px] text-text-tertiary lowercase">{selectedUser.email}</p>
                                     </div>
                                </div>

                                <div className="space-y-6">
                                     <div>
                                         <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-2 block">Adjustment Amount (₹)</label>
                                         <div className="relative group">
                                             <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" size={18} />
                                             <input 
                                                type="number"
                                                placeholder="e.g., 50 or -50"
                                                value={amount || ''}
                                                onChange={(e) => setAmount(Number(e.target.value))}
                                                className="w-full pl-12 pr-4 py-4 bg-bg-secondary/50 border border-border rounded-2xl text-h4 font-black outline-none focus:border-brand transition-all italic text-text-primary"
                                             />
                                         </div>
                                         <p className="mt-2 text-[10px] text-text-tertiary uppercase font-medium">Use negative sign (-) to deduct balance</p>
                                     </div>

                                     <div>
                                         <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-2 block">Adjustment Reason (Audit Log)</label>
                                         <textarea 
                                            placeholder="Why are you adjusting this pet parent's balance?"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            rows={3}
                                            className="w-full px-5 py-4 bg-bg-secondary/50 border border-border rounded-2xl text-label-sm outline-none focus:border-brand transition-all resize-none"
                                         />
                                     </div>

                                     <div className="grid grid-cols-2 gap-3">
                                          <button 
                                            onClick={() => setAmount(50)}
                                            className="py-3 bg-bg-secondary border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-brand transition-all"
                                          >
                                              + ₹50 Reward
                                          </button>
                                          <button 
                                            onClick={() => setAmount(100)}
                                            className="py-3 bg-bg-secondary border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-brand transition-all"
                                          >
                                              + ₹100 Reward
                                          </button>
                                     </div>

                                     <button 
                                        onClick={adjustBalance}
                                        className="w-full py-5 bg-brand text-white rounded-2xl shadow-[0_12px_40px_rgba(255,122,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all text-label-md font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-4"
                                     >
                                         {amount > 0 ? <Gift size={18} /> : <CreditCard size={18} />}
                                         Deploy Adjustment
                                     </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="bg-bg-elevated border-2 border-dashed border-border rounded-[--radius-3xl] p-12 text-center opacity-60 flex flex-col items-center justify-center h-full min-h-[500px]">
                                <Send size={48} className="text-text-disabled mb-6 animate-bounce" />
                                <h3 className="text-h4 font-black uppercase tracking-tighter text-text-tertiary italic">Ready for Provisioning</h3>
                                <p className="text-body-sm text-text-disabled mt-2">Select a pet parent from the list to update their 'Pet Cash' balance or Provision rewards.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
