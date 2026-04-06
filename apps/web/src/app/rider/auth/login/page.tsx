'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, ArrowRight, Truck, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

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
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 relative overflow-hidden" data-theme="dark">
      <div className="absolute inset-0 opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] -ml-64 -mb-64"></div>

      <div className="w-full max-w-xl bg-bg-secondary/40 backdrop-blur-3xl rounded-[--radius-xl] border border-border p-12 md:p-20 relative z-10 shadow-lg overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        
        <div className="text-center mb-12">
            <div className="w-24 h-24 bg-bg-tertiary rounded-[--radius-xl] border border-border flex items-center justify-center mx-auto mb-8 backdrop-blur-3xl relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
                <Truck size={32} className="text-accent relative z-10" />
                <div className="absolute inset-0 bg-accent/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h2 className="text-h1 text-text-primary tracking-tighter italic mb-3">Clearance Portal</h2>
            <p className="text-overline">Tactical Rider Node Deployment</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group/input">
                <label className="text-overline transition-colors group-focus-within/input:text-accent">Tactical ID / Email</label>
                <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within/input:text-accent transition-colors" size={18} />
                    <input 
                        type="email" required placeholder="agent@petshop-fleet.com"
                        className="w-full pl-16 pr-6 py-5 bg-bg-primary/50 border border-border rounded-[--radius-xl] text-body-sm font-semibold text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-text-disabled"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2 group/input">
                <div className="flex justify-between items-end mb-1 px-1">
                    <label className="text-overline transition-colors group-focus-within/input:text-accent">Access Key / Pass</label>
                </div>
                <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within/input:text-accent transition-colors" size={18} />
                    <input 
                        type="password" required placeholder="••••••••"
                        className="w-full pl-16 pr-6 py-5 bg-bg-primary/50 border border-border rounded-[--radius-xl] text-body-sm font-semibold text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-text-disabled"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
            </div>

            <div className="pt-8">
                <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    iconRight={!loading ? <ArrowRight size={20} /> : undefined}
                    className="bg-accent hover:bg-accent-hover shadow-lg"
                >
                    {loading ? 'Establishing...' : 'Establish Secure Uplink'}
                </Button>
            </div>
        </form>

        <div className="mt-16 flex flex-col items-center gap-6 pt-12 border-t border-border">
            <div className="flex items-center gap-4 text-text-disabled">
                <div className="h-px w-12 bg-border"></div>
                <span className="text-label-sm font-semibold uppercase tracking-wider">Autonomous Hub Entrance</span>
                <div className="h-px w-12 bg-border"></div>
            </div>
            <p className="text-overline">
                No Deployment ID? <Link href="/rider/auth/signup" className="text-accent hover:text-accent-hover transition-colors ml-2 border-b border-accent/20">Apply for Fleet Clearance</Link>
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
