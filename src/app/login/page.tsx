"use client";

import { themeConfig } from '@/config/theme';
import { brandConfig } from '@/config/brand';
import { Mail, Lock, ArrowRight, Github, Chrome, PawPrint, UserPlus, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function UserLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isGoogleSelecting, setIsGoogleSelecting] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleGoogleLogin = () => {
        setIsGoogleSelecting(true);
    };

    const finalizeGoogleLogin = (selectedEmail: string) => {
        setIsGoogleSelecting(false);
        setLoading(true);
        setTimeout(() => {
            localStorage.setItem('userEmail', selectedEmail);
            router.push('/dashboard');
        }, 1500);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Account security requires a minimum of 6 characters.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            if (typeof window !== 'undefined') {
                const usersRaw = localStorage.getItem('registeredUsers');
                let users = usersRaw ? JSON.parse(usersRaw) : {};

                // If user exists, check password
                if (users[email] && users[email] !== password) {
                    setError('Incorrect security password for this account.');
                    setLoading(false);
                    return;
                }

                // Register or update session
                users[email] = password;
                localStorage.setItem('registeredUsers', JSON.stringify(users));
                localStorage.setItem('userEmail', email);

                router.push('/dashboard');
            }
        }, 1200);
    };

    return (
        <div className="relative flex flex-col lg:flex-row min-h-screen bg-bg-page overflow-hidden font-outfit">
            {/* Google Account Selector Overlay */}
            {isGoogleSelecting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-card-bg w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden border border-card-border">
                        <div className="p-8 text-center border-b border-card-border bg-bg-page/30">
                            <div className="w-16 h-16 bg-white dark:bg-black rounded-full shadow-lg mx-auto mb-4 flex items-center justify-center overflow-hidden">
                                <Chrome size={32} className="text-red-500" />
                            </div>
                            <h3 className="text-xl font-black text-text-primary">Choose an account</h3>
                            <p className="text-xs font-medium text-text-light mt-1">to continue to {brandConfig.name}</p>
                        </div>
                        <div className="p-4 space-y-2">
                            {[
                                { name: "Ashish Singh", email: "ashish.dev@gmail.com", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop" },
                                { name: "Kanha Demo", email: "demo.user@kanha.in", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop" }
                            ].map((acc, i) => (
                                <button
                                    key={i}
                                    onClick={() => finalizeGoogleLogin(acc.email)}
                                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-bg-page transition-all text-left group"
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden relative border-2 border-white shadow-sm">
                                        <Image src={acc.img} alt={acc.name} fill className="object-cover" sizes="40px" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-black text-text-primary line-clamp-1 group-hover:text-brand-primary">{acc.name}</p>
                                        <p className="text-[10px] font-medium text-text-light truncate">{acc.email}</p>
                                    </div>
                                    <div className="w-4 h-4 rounded-full border border-card-border group-hover:border-brand-primary group-hover:bg-brand-primary/5 transition-all"></div>
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    const customEmail = prompt("Enter your Google Account email:");
                                    if (customEmail) finalizeGoogleLogin(customEmail);
                                }}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-bg-page transition-all text-left text-brand-primary text-xs font-black uppercase tracking-widest mt-2"
                            >
                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                                    <UserPlus size={18} />
                                </div>
                                Use another account
                            </button>
                        </div>
                        <div className="p-6 bg-bg-page/30 flex justify-end">
                            <button
                                onClick={() => setIsGoogleSelecting(false)}
                                className="text-[10px] font-black uppercase tracking-[0.2em] text-text-light hover:text-text-primary px-4 py-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Visual Side (Hidden on Mobile) */}
            <div className="hidden lg:flex w-1/2 p-20 flex-col justify-center relative bg-brand-primary overflow-hidden">
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
                            sizes="256px"
                            priority
                        />
                    </div>
                    <h2 className="text-5xl font-black text-white mb-6 leading-tight">Welcome to the <br />Fur-mily! 🐾</h2>
                    <p className="text-white/90 text-xl font-medium">Log in to track your pet's wellness, appointments, and all those tail-wagging moments.</p>
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
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-light transition-colors group-focus-within:text-brand-primary" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-14 pr-14 py-4 bg-white dark:bg-card-bg border border-card-border rounded-2xl text-sm font-bold text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-text-light hover:text-brand-primary transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-brand-primary text-white font-black text-xl rounded-2xl shadow-xl shadow-brand-primary/25 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    Jump Back In 🐾
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-card-border"></div>
                            </div>
                            <div className="relative flex justify-center text-xs font-black uppercase tracking-widest">
                                <span className="bg-white dark:bg-card-bg px-4 text-text-light">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Link
                                href="/login/google"
                                className="flex items-center justify-center gap-3 px-6 py-4 border border-card-border rounded-2xl font-black text-sm hover:bg-bg-page transition-all active:scale-95"
                            >
                                <Chrome size={20} className="text-red-500" />
                                Google
                            </Link>
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
