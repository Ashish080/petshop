"use client";

import { themeConfig } from '@/config/theme';
import { brandConfig } from '@/config/brand';
import { Mail, Lock, ArrowRight, Github, Chrome, PawPrint, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function UserLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            // Save email to localStorage to simulate a "real" session
            localStorage.setItem('userEmail', email);
            router.push('/dashboard');
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-bg-page flex flex-col lg:flex-row transition-colors duration-300">
            {/* Visual Side (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-brand-primary relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-[120px] animate-blob"></div>
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-secondary rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
                </div>

                <div className="relative z-10 text-center p-16 max-w-xl">
                    <div className="relative w-64 h-64 mx-auto mb-12 rounded-[80px] overflow-hidden shadow-2xl rotate-3 border-8 border-white/20">
                        <Image
                            src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop"
                            alt="Happy Dog"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h2 className="text-5xl font-black text-white mb-6 leading-tight">Welcome to the <br />Fur-mily! 🐾</h2>
                    <p className="text-white/80 text-xl font-medium">Log in to track your pet's wellness, appointments, and all those tail-wagging moments.</p>
                </div>

                {/* Paw Print Patterns */}
                <div className="absolute bottom-10 left-10 text-white/10 rotate-12">
                    <PawPrint size={120} />
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-bg-page">
                <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700">
                    <div className="lg:hidden text-center mb-10">
                        <Link href="/" className="inline-block text-3xl font-black text-brand-primary tracking-tighter mb-4">
                            {brandConfig.name}
                        </Link>
                        <h1 className="text-3xl font-black text-text-primary">Welcome Back!</h1>
                    </div>

                    <div className="mb-10 hidden lg:block">
                        <h1 className="text-4xl font-black text-text-primary mb-3">Sign in to Wellness</h1>
                        <p className="text-text-light font-medium">Please enter your details to access your pet's dashboard.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl animate-in fade-in slide-in-from-top-2 border border-red-200 dark:border-red-900/50">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-light px-2">Account Email</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="hello@pawsomeuser.com"
                                    className="w-full pl-14 pr-6 py-4 bg-white dark:bg-card-bg border border-card-border rounded-2xl text-sm font-bold text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-light">Secret Password</label>
                                <a href="#" className="text-[10px] font-black text-brand-primary uppercase hover:underline">Forgot?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-6 py-4 bg-white dark:bg-card-bg border border-card-border rounded-2xl text-sm font-bold text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-black text-sm text-white transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/30 ${loading ? 'bg-brand-primary/70 translate-y-1' : 'bg-brand-primary hover:-translate-y-1 hover:shadow-2xl active:scale-95'}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Jump Back In 🐾
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10">
                        <div className="relative mb-10">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-card-border"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
                                <span className="bg-bg-page px-4 text-text-light">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-3 py-4 border-2 border-card-border rounded-2xl font-black text-xs text-text-primary hover:bg-brand-primary/5 transition-all active:scale-95">
                                <Chrome size={18} /> Google
                            </button>
                            <button className="flex items-center justify-center gap-3 py-4 border-2 border-card-border rounded-2xl font-black text-xs text-text-primary hover:bg-brand-primary/5 transition-all active:scale-95">
                                <Github size={18} /> GitHub
                            </button>
                        </div>
                    </div>

                    <p className="mt-12 text-center text-sm font-bold text-text-light">
                        New to the parade? {' '}
                        <Link href="/register" className="text-secondary hover:underline flex items-center justify-center gap-2 mt-2">
                            Create a new Pet Profile <UserPlus size={16} />
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
