'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Lock, LogIn, ArrowRight, ShieldCheck, Terminal, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

function AdminLoginForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (session?.user?.role === 'admin') router.push('/admin');
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
        toast.error('ACCESS DENIED: Unauthorized Credentials');
      } else {
        toast.success('ADMIN CLEARANCE GRANTED');
        router.push('/admin');
        router.refresh();
      }
    } catch (error) {
      toast.error('CRITICAL SYSTEM ERROR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-rose-500 selection:text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/60-lines.png')] opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-600/5 rounded-full blur-[160px] animate-pulse"></div>

      <div className="w-full max-w-xl bg-zinc-950 border border-rose-900/30 rounded-[40px] p-12 md:p-20 relative z-10 shadow-2xl shadow-rose-900/10 overflow-hidden group">
        <div className="absolute top-0 right-0 p-8">
            <ShieldAlert size={48} className="text-rose-900/20" />
        </div>
        
        <div className="text-center mb-16 relative">
            <div className="inline-flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 px-5 py-2 rounded-full mb-8">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Admin Command Node</span>
            </div>
            <h2 className="text-5xl font-black text-white tracking-tighter mb-4 italic">RESTRICTED</h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.5em] leading-loose">Secure Terminal Uplink Protocol</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Admin Identifier</label>
                <div className="relative">
                    <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                    <input 
                        type="email" required placeholder="admin@system.node"
                        className="w-full pl-16 pr-6 py-6 bg-black border border-zinc-800 rounded-3xl text-sm font-black text-white focus:outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-500/5 transition-all placeholder:text-zinc-800"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Encryption Key</label>
                <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
                    <input 
                        type="password" required placeholder="••••••••"
                        className="w-full pl-16 pr-6 py-6 bg-black border border-zinc-800 rounded-3xl text-sm font-black text-white focus:outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-500/5 transition-all placeholder:text-zinc-800"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
            </div>

            <div className="pt-6">
                <button 
                    type="submit" disabled={loading}
                    className="w-full bg-rose-600 text-white rounded-3xl py-6 font-black text-[11px] uppercase tracking-[0.5em] flex items-center justify-center gap-3 shadow-2xl shadow-rose-600/30 hover:bg-rose-500 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                    {loading ? "Decrypting..." : (
                        <>Establish Command Link <ArrowRight size={20} /></>
                    )}
                </button>
            </div>
        </form>

        <div className="mt-16 text-center">
            <Link href="/" className="text-[10px] font-black text-zinc-700 hover:text-zinc-500 uppercase tracking-[0.3em] transition-colors flex items-center justify-center gap-2">
                <LogIn size={14} /> Revert to Standard Interface
            </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div>Establishing Secure Connection...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
