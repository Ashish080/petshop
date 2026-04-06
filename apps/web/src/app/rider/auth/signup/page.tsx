'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Phone, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

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
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 relative overflow-hidden" data-theme="dark">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 opacity-20"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>

      <div className="w-full max-w-xl bg-bg-secondary/50 backdrop-blur-2xl rounded-[--radius-xl] border border-border p-12 relative z-10 shadow-lg">
        <div className="text-center mb-10">
            <div className="w-20 h-20 bg-accent rounded-[--radius-xl] flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
                <Truck size={36} className="text-white" />
            </div>
            <h2 className="text-h2 text-text-primary tracking-tight mb-2 italic">Join the Logistics Fleet</h2>
            <p className="text-overline">Secure Rider Identification & Onboarding</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 group">
                    <label className="text-overline ml-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-accent transition-colors" size={16} />
                        <input 
                            type="text" required placeholder="John Doe"
                            className="w-full pl-12 pr-4 py-4 bg-bg-primary/50 border border-border rounded-[--radius-lg] text-body-sm font-semibold text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-text-disabled"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-1.5 group">
                    <label className="text-overline ml-1">Fleet ID / Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-accent transition-colors" size={16} />
                        <input 
                            type="email" required placeholder="rider@fleet.com"
                            className="w-full pl-12 pr-4 py-4 bg-bg-primary/50 border border-border rounded-[--radius-lg] text-body-sm font-semibold text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-text-disabled"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 group">
                    <label className="text-overline ml-1">Contact Node / Phone</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-accent transition-colors" size={16} />
                        <input 
                            type="tel" required placeholder="+91..."
                            className="w-full pl-12 pr-4 py-4 bg-bg-primary/50 border border-border rounded-[--radius-lg] text-body-sm font-semibold text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-text-disabled"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-1.5 group">
                    <label className="text-overline ml-1">Access Key / Pass</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-disabled group-focus-within:text-accent transition-colors" size={16} />
                        <input 
                            type="password" required placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-4 bg-bg-primary/50 border border-border rounded-[--radius-lg] text-body-sm font-semibold text-text-primary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-text-disabled"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    iconRight={!loading ? <ArrowRight size={18} /> : undefined}
                    className="bg-accent hover:bg-accent-hover shadow-lg"
                >
                    {loading ? 'Syncing Identity...' : 'Complete Onboarding'}
                </Button>
            </div>
        </form>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 pt-10 border-t border-border">
            <div className="flex items-center gap-2 text-text-tertiary text-label-sm font-semibold uppercase tracking-wider">
                <ShieldCheck size={14} className="text-accent" /> Secure Protocol v4
            </div>
            <Link href="/rider/auth/login" className="text-label-sm font-semibold uppercase tracking-wider text-text-secondary hover:text-accent transition-colors">Already Enlisted? Execute Login</Link>
        </div>
      </div>
    </div>
  );
}
