'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Truck, PawPrint, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.success('Password reset link sent to your registered email (Demo mode active)');
  };

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
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>

      <div className="w-full max-w-5xl bg-bg-elevated rounded-[--radius-xl] shadow-lg flex flex-col md:flex-row overflow-hidden border border-border relative z-10 transition-all">
        
        {/* Left Side: Visual/Context */}
        <div className="w-full md:w-[45%] bg-accent p-12 text-white relative flex flex-col justify-between overflow-hidden group">
            <div className="absolute inset-0 opacity-10  group-hover:scale-110 transition-transform duration-1000"></div>
            
            <div className="relative z-10">
                <Link href="/" className="flex items-center gap-2 mb-12">
                    <div className="w-10 h-10 bg-white rounded-[--radius-md] flex items-center justify-center text-accent shadow-sm group-hover:rotate-12 transition-transform">
                        <PawPrint size={22} fill="currentColor" />
                    </div>
                    <span className="text-h4 tracking-tight">Kanha Pet Shop</span>
                </Link>

                <h1 className="text-h1 leading-tight mb-6">
                    Professional Care <br />
                    <span className="text-white/60">Personalized Service</span>
                </h1>
                
                <div className="space-y-6">
                    {[
                        { icon: ShieldCheck, title: "Secure Portal", desc: "Enterprise-grade encryption for your data." },
                        { icon: Truck, title: "Smart Logistics", desc: "Real-time delivery tracking for efficiency." },
                        { icon: LogIn, title: "Unified Entry", desc: "One account for Customer, Admin & Rider." }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-4 items-start">
                            <div className="w-10 h-10 bg-white/10 rounded-[--radius-md] flex items-center justify-center shrink-0 border border-white/10">
                                <item.icon size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-body-sm">{item.title}</h3>
                                <p className="text-white/60 text-body-xs font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-overline text-white/40">
                    © 2026 Kanha Logistics System
                </p>
                <div className="mt-4 p-4 bg-white/5 rounded-[--radius-lg] border border-white/5 backdrop-blur-sm">
                    <p className="text-label-sm text-white/40 uppercase tracking-wider mb-2">Sandbox Access:</p>
                    <p className="text-label text-white/70">Admin: admin@petshop.com / admin123</p>
                    <p className="text-label text-white/70 mt-1">User: user@example.com / user123</p>
                </div>
            </div>
        </div>

        {/* Right Side: Action Form */}
        <div className="flex-1 p-12 md:p-20 flex flex-col justify-center">
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-h2 text-text-primary tracking-tight mb-2">Access Portal</h2>
                <p className="text-overline">Secure verification protocol required</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5 group">
                    <label className="text-overline transition-colors group-focus-within:text-accent">Identification / Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-accent transition-colors" size={18} />
                        <input 
                            type="email" 
                            required
                            placeholder="user@example.com"
                            className="w-full pl-12 pr-4 py-4 bg-bg-secondary border border-border rounded-[--radius-lg] text-body-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-text-disabled"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1.5 group">
                    <div className="flex justify-between items-end mb-0.5 px-1">
                        <label className="text-overline transition-colors group-focus-within:text-accent">Access Key / Password</label>
                        <button onClick={handleForgotPassword} className="text-label-sm font-semibold text-accent uppercase tracking-wider hover:text-accent-hover transition-colors">Forgot Key?</button>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-accent transition-colors" size={18} />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            required
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-4 bg-bg-secondary border border-border rounded-[--radius-lg] text-body-sm font-semibold text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-text-disabled"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-disabled hover:text-accent transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="pt-4">
                    <Button 
                        type="submit" 
                        disabled={loading}
                        variant="brand"
                        size="lg"
                        fullWidth
                        iconRight={!loading ? <ArrowRight size={18} /> : undefined}
                        loading={loading}
                    >
                        {loading ? 'Authenticating...' : 'Authenticate Securely'}
                    </Button>
                </div>
            </form>

            <div className="mt-12 pt-10 border-t border-border text-center">
                <p className="text-overline">
                    No clearance? <br className="md:hidden" /> 
                    <Link href="/auth/register" className="text-accent hover:text-accent-hover transition-colors ml-1">Request Identity</Link>
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
