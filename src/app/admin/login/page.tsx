"use client";

import { themeConfig } from '@/config/theme';
import { brandConfig } from '@/config/brand';
import { Lock, Mail, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('admin@petshop.com');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error('Invalid email or password');
                return;
            }

            // Session may not be readable in the same tick as signIn
            let session = await getSession();
            if (!session?.user) {
                await new Promise((r) => setTimeout(r, 150));
                session = await getSession();
            }
            const role = session?.user?.role;
            if (role !== 'admin') {
                toast.error('This account does not have admin access.');
                await signOut({ redirect: false });
                return;
            }

            toast.success('Welcome back');
            router.push('/admin');
            router.refresh();
        } catch {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-page flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-1/4 -left-12 w-64 h-64 bg-brand-primary rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-secondary rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-fade-in">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-[32px] bg-brand-primary/10 text-brand-primary mb-6 shadow-xl shadow-brand-primary/10 border border-brand-primary/20">
                        <ShieldCheck size={40} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-4xl font-black text-text-primary mb-2 tracking-tighter">Admin Portal</h1>
                    <p className="text-text-light font-medium uppercase tracking-widest text-[10px]">Security Gateway for {brandConfig.name}</p>
                </div>

                <div className="bg-nav-bg rounded-[40px] p-10 border border-card-border shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-[60px] -z-1"></div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-light px-2">Official Email</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@petshop.com"
                                    autoComplete="email"
                                    className="w-full pl-14 pr-6 py-4 bg-bg-page border border-card-border rounded-2xl text-sm font-bold text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-light px-2">Security Key</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-light" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full pl-14 pr-6 py-4 bg-bg-page border border-card-border rounded-2xl text-sm font-bold text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-5 rounded-2xl font-black text-sm text-white transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-primary/30 ${loading ? 'bg-brand-primary/70 scale-[0.98]' : 'bg-brand-primary hover:-translate-y-1 hover:shadow-2xl active:scale-95'}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Authorize Access <ArrowRight size={18} strokeWidth={3} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-[10px] text-text-light">
                        Demo: admin@petshop.com / admin123 (after <code className="text-text-primary">npm run seed</code>)
                    </p>

                    <div className="mt-10 pt-8 border-t border-card-border/50 text-center">
                        <Link href="/" className="text-xs font-black text-secondary hover:underline flex items-center justify-center gap-2">
                            ← Back to Public Website
                        </Link>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-light">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        System Secure
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-light">
                        <Heart size={12} className="text-brand-primary" fill="currentColor" />
                        Paws Protected
                    </div>
                </div>
            </div>
        </div>
    );
}
