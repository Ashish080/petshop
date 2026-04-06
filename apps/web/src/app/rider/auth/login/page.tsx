'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Truck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

function RiderLoginForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (session?.user?.role === 'rider') router.push('/rider');
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Identity Verification Failed');
      } else {
        toast.success('Clearance Granted!');
        router.push('/rider');
        router.refresh();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      <div className="absolute inset-0  opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[140px] -ml-64 -mb-64"></div>

      <div className="w-full max-w-xl bg-slate-900/40 backdrop-blur-3xl rounded-[56px] border border-white/5 p-12 md:p-20 relative z-10 shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="text-center mb-12">
            <div className="w-24 h-24 bg-white/5 rounded-[32px] border border-white/10 flex items-center justify-center mx-auto mb-8 backdrop-blur-3xl relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                <Truck size={32} className="text-indigo-400 relative z-10" />
                <div className="absolute inset-0 bg-indigo-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter italic mb-3">Clearance Portal</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] leading-loose">Tactical Rider Node Deployment</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group/input">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 transition-colors group-focus-within/input:text-indigo-400">Tactical ID / Email</label>
                <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-indigo-400 transition-colors" size={18} />
                    <input 
                        type="email" required placeholder="agent@petshop-fleet.com"
                        className="w-full pl-16 pr-6 py-5 bg-slate-950/50 border border-white/10 rounded-[28px] text-[13px] font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-800"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2 group/input">
                <div className="flex justify-between items-end mb-1 px-1">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest transition-colors group-focus-within/input:text-indigo-400">Access Key / Pass</label>
                </div>
                <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/input:text-indigo-400 transition-colors" size={18} />
                    <input 
                        type="password" required placeholder="••••••••"
                        className="w-full pl-16 pr-6 py-5 bg-slate-950/50 border border-white/10 rounded-[28px] text-[13px] font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-800"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
            </div>

            <div className="pt-8">
                <button 
                    type="submit" disabled={loading}
                    className="w-full bg-indigo-600 text-white rounded-[28px] py-6 font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50 group/btn"
                >
                    {loading ? <Zap size={22} className="animate-spin" /> : (
                        <>Establish Secure Uplink <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" /></>
                    )}
                </button>
            </div>
        </form>

        <div className="mt-16 flex flex-col items-center gap-6 pt-12 border-t border-white/5">
            <div className="flex items-center gap-4 text-slate-700">
                <div className="h-[1px] w-12 bg-white/5"></div>
                <span className="text-[9px] font-black uppercase tracking-widest">Autonomous Hub Entrance</span>
                <div className="h-[1px] w-12 bg-white/5"></div>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                No Deployment ID? <Link href="/rider/auth/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors ml-2 border-b border-indigo-400/20">Apply for Fleet Clearance</Link>
            </p>
        </div>
      </div>
    </div>
  );
}

export default function RiderLoginPage() {
  return (
    <Suspense fallback={<div>Loading Deployment Portal...</div>}>
      <RiderLoginForm />
    </Suspense>
  );
}
