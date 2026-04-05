'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Truck, PawPrint } from 'lucide-react';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

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
        toast.error('Invalid email or password');
      } else {
        toast.success('Successfully signed in!');
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      <div className="w-full max-w-5xl bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row overflow-hidden border border-slate-100 relative z-10 transition-all">
        
        {/* Left Side: Visual/Context */}
        <div className="w-full md:w-[45%] bg-indigo-600 p-12 text-white relative flex flex-col justify-between overflow-hidden group">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] group-hover:scale-110 transition-transform duration-1000"></div>
            
            <div className="relative z-10">
                <Link href="/" className="flex items-center gap-2 mb-12">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-lg group-hover:rotate-12 transition-transform">
                        <PawPrint size={22} fill="currentColor" />
                    </div>
                    <span className="text-xl font-black tracking-tight">Kanha Pet Shop</span>
                </Link>

                <h1 className="text-4xl font-black leading-tight mb-6">
                    Professional Care <br />
                    <span className="text-indigo-200">Personalized Service</span>
                </h1>
                
                <div className="space-y-6">
                    {[
                        { icon: ShieldCheck, title: "Secure Portal", desc: "Enterprise-grade encryption for your data." },
                        { icon: Truck, title: "Smart Logistics", desc: "Real-time delivery tracking for efficiency." },
                        { icon: LogIn, title: "Unified Entry", desc: "One account for Customer, Admin & Rider." }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 items-start">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/10">
                                <item.icon size={18} />
                            </div>
                            <div>
                                <h3 className="font-black text-sm">{item.title}</h3>
                                <p className="text-indigo-100/70 text-xs font-bold leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">
                    © 2026 Kanha Logistics System
                </p>
                <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <p className="text-[9px] font-black text-indigo-100/40 uppercase tracking-widest mb-2">Sandbox Access:</p>
                    <p className="text-[10px] font-bold text-indigo-100/80">Admin: admin@petshop.com / admin123</p>
                    <p className="text-[10px] font-bold text-indigo-100/80 mt-1">User: user@example.com / user123</p>
                </div>
            </div>
        </div>

        {/* Right Side: Action Form */}
        <div className="flex-1 p-12 md:p-20 flex flex-col justify-center">
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Access Portal</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-loose">Secure verification protocol required</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-indigo-600">Identification / Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input 
                            type="email" 
                            required
                            placeholder="user@example.com"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all placeholder:text-slate-300"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1.5 group">
                    <div className="flex justify-between items-end mb-0.5 px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors group-focus-within:text-indigo-600">Access Key / Password</label>
                        <Link href="/auth/reset" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">Forgot Key?</Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input 
                            type="password" 
                            required
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all placeholder:text-slate-300"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-slate-900 text-white rounded-2xl py-4 font-black transition-all hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Authenticate Securely
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-12 pt-10 border-t border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    No clearance? <br className="md:hidden" /> 
                    <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-700 transition-colors ml-1">Request Identity</Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
