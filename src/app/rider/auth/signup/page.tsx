'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Phone, ArrowRight, Truck, ShieldCheck, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RiderSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: 'rider' }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Rider application submitted!');
        router.push('/rider/auth/login');
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>

      <div className="w-full max-w-xl bg-[#1e293b]/50 backdrop-blur-2xl rounded-[48px] border border-slate-800 p-12 relative z-10 shadow-2xl">
        <div className="text-center mb-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20 rotate-3">
                <Truck size={36} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-2 italic">Join the Logistics Fleet</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-loose">Secure Rider Identification & Onboarding</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 group">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                        <input 
                            type="text" required placeholder="John Doe"
                            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-1.5 group">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Fleet ID / Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                        <input 
                            type="email" required placeholder="rider@fleet.com"
                            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 group">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Contact Node / Phone</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                        <input 
                            type="tel" required placeholder="+91..."
                            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-1.5 group">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Key / Pass</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={16} />
                        <input 
                            type="password" required placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-sm font-bold text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <button 
                    type="submit" disabled={loading}
                    className="w-full bg-indigo-600 text-white rounded-2xl py-5 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50 group"
                >
                    {loading ? "Syncing Identity..." : (
                        <>Complete Onboarding <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                </button>
            </div>
        </form>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 pt-10 border-t border-slate-800/50 text-[9px] font-black uppercase tracking-widest leading-loose italic">
            <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck size={14} className="text-indigo-500" /> Secure Protocol v4
            </div>
            <Link href="/rider/auth/login" className="text-slate-400 hover:text-indigo-400 transition-colors">Already Enlisted? Execute Login</Link>
        </div>
      </div>
    </div>
  );
}
