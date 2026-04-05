'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { brandConfig } from '@/config/brand';
import { Mail, Lock, ArrowRight, User, Heart, Sparkles, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function UserAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        if (isLogin) {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error('Invalid credentials. New here? Switch to Sign Up!');
                return;
            }

            toast.success('Welcome back to the family! 🐾');
            router.push('/');
        } else {
            // Simulated Sign up
            toast.success('Account created! Now you can login.');
            setIsLogin(true);
        }
    } catch {
        toast.error('Something went wrong. Let\'s try again.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#FDFDFD] relative overflow-hidden transition-all">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
           animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
           transition={{ duration: 20, repeat: Infinity }}
           className="absolute -top-[10%] -left-[5%] w-[40%] aspect-square bg-orange-50 rounded-full blur-[120px]" 
        />
        <motion.div 
           animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
           transition={{ duration: 25, repeat: Infinity }}
           className="absolute -bottom-[10%] -right-[5%] w-[40%] aspect-square bg-amber-50 rounded-full blur-[120px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-[60px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.06)] border border-white bg-white/40 backdrop-blur-3xl z-10"
      >
        {/* Left Side: Welcoming Visuals */}
        <div className="hidden lg:block lg:col-span-12 p-1 relative overflow-hidden flex flex-col justify-between">
           <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                
                <div className="lg:col-span-5 bg-brand-primary p-16 flex flex-col justify-between relative overflow-hidden text-white">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-brand-secondary)_0%,_transparent_70%)]" />
                    </div>

                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center gap-3 mb-10 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Heart size={24} fill="currentColor" />
                            </div>
                            <span className="text-xl font-black tracking-tighter">{brandConfig.name}</span>
                        </Link>

                        <h1 className="text-6xl font-black leading-[0.9] tracking-tighter mb-8">
                           BRING <br />
                           JOY <br />
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-amber-200">
                             HOME.
                           </span>
                        </h1>
                        <p className="text-white/80 font-medium text-lg leading-relaxed max-w-xs">
                           Join Lucknow's most premium pet community and experience next-gen care.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        {[
                            { icon: Sparkles, text: "Exclusive Member Benefits" },
                            { icon: ShoppingBag, text: "Waitlist for Premium Breeds" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                                    <item.icon size={18} />
                                </div>
                                <span className="text-sm font-black uppercase tracking-widest">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-7 bg-white p-12 lg:p-20 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="mb-12">
                                <h2 className="text-4xl font-black text-zinc-900 tracking-tighter mb-3">
                                    {isLogin ? "Welcome Back!" : "Join the Pack."}
                                </h2>
                                <p className="text-zinc-500 font-bold text-lg">
                                    {isLogin ? "Enter your core details to resume your journey." : "Create an account to start your premium experience."}
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleAuth}>
                                {!isLogin && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-brand-primary transition-colors" size={20} />
                                            <input 
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="w-full pl-16 pr-8 py-5 bg-zinc-50 border border-zinc-100 rounded-[30px] focus:ring-[12px] focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all outline-none font-bold text-zinc-900 placeholder:text-zinc-300" 
                                                placeholder="Enter full name" 
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Email ID</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-brand-primary transition-colors" size={20} />
                                        <input 
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full pl-16 pr-8 py-5 bg-zinc-50 border border-zinc-100 rounded-[30px] focus:ring-[12px] focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all outline-none font-bold text-zinc-900 placeholder:text-zinc-300" 
                                            placeholder="your@email.com" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-4">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-brand-primary transition-colors" size={20} />
                                        <input 
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            className="w-full pl-16 pr-16 py-5 bg-zinc-50 border border-zinc-100 rounded-[30px] focus:ring-[12px] focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all outline-none font-bold text-zinc-900 placeholder:text-zinc-300" 
                                            placeholder="••••••••" 
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 transition-colors">
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <button disabled={loading} className="w-full py-6 bg-zinc-900 text-white rounded-[30px] font-black text-lg shadow-xl shadow-zinc-900/10 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4">
                                    {loading ? (
                                        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {isLogin ? "Start Exploring ⚡" : "Create Account 🐾"}
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-10 pt-10 border-t border-zinc-50 text-center">
                                <button 
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-sm font-black text-zinc-500 uppercase tracking-widest hover:text-brand-primary transition-colors"
                                >
                                    {isLogin ? "New to the family? Create Account" : "Already a member? Sign In"}
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
           </div>
        </div>

        {/* Mobile View Placeholder (visible on small screens) */}
        <div className="lg:hidden p-12 bg-white">
            <h2 className="text-3xl font-black text-zinc-900 mb-8">{isLogin ? "Sign In" : "Sign Up"}</h2>
            <form className="space-y-6" onSubmit={handleAuth}>
                <input className="w-full px-6 py-4 bg-zinc-50 rounded-2xl outline-none font-bold text-zinc-900" placeholder="Email" />
                <input type="password" className="w-full px-6 py-4 bg-zinc-50 rounded-2xl outline-none font-bold text-zinc-900" placeholder="Password" />
                <button className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black">{isLogin ? "Login" : "Sign Up"}</button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-8 text-xs font-black text-zinc-500 uppercase tracking-widest text-center">
                {isLogin ? "Switch to Sign Up" : "Switch to Login"}
            </button>
        </div>
      </motion.div>
    </div>
  );
}
