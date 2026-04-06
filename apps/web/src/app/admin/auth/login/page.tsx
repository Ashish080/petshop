'use client';

import { Suspense, useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Lock, LogIn, ArrowRight, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

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
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 relative overflow-hidden" data-theme="dark">
      <div className="absolute inset-0 opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-danger/5 rounded-full blur-[160px] animate-pulse"></div>

      <div className="w-full max-w-xl bg-bg-secondary border border-danger/20 rounded-[--radius-xl] p-12 md:p-20 relative z-10 shadow-lg overflow-hidden group">
        <div className="absolute top-0 right-0 p-8">
            <ShieldAlert size={48} className="text-danger/20" />
        </div>
        
        <div className="text-center mb-16 relative">
            <div className="inline-flex items-center gap-3 bg-danger/10 border border-danger/20 px-5 py-2 rounded-full mb-8">
                <div className="w-2 h-2 bg-danger rounded-full animate-ping"></div>
                <span className="text-label-sm font-semibold text-danger uppercase tracking-wider">Admin Command Node</span>
            </div>
            <h2 className="text-display text-text-primary tracking-tighter mb-4 italic">RESTRICTED</h2>
            <p className="text-overline">Secure Terminal Uplink Protocol</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
                <label className="text-overline ml-1">Admin Identifier</label>
                <div className="relative">
                    <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
                    <input 
                        type="email" required placeholder="admin@system.node"
                        className="w-full pl-16 pr-6 py-6 bg-bg-primary border border-border rounded-[--radius-xl] text-body-sm font-semibold text-text-primary focus:outline-none focus:border-danger focus:ring-2 focus:ring-danger/20 transition-all placeholder:text-text-disabled"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-overline ml-1">Encryption Key</label>
                <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-text-disabled" size={18} />
                    <input 
                        type="password" required placeholder="••••••••"
                        className="w-full pl-16 pr-6 py-6 bg-bg-primary border border-border rounded-[--radius-xl] text-body-sm font-semibold text-text-primary focus:outline-none focus:border-danger focus:ring-2 focus:ring-danger/20 transition-all placeholder:text-text-disabled"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
            </div>

            <div className="pt-6">
                <Button 
                    type="submit" 
                    disabled={loading}
                    variant="danger"
                    size="lg"
                    fullWidth
                    loading={loading}
                    iconRight={!loading ? <ArrowRight size={20} /> : undefined}
                >
                    {loading ? 'Decrypting...' : 'Establish Command Link'}
                </Button>
            </div>
        </form>

        <div className="mt-16 text-center">
            <Link href="/" className="text-overline text-text-disabled hover:text-text-secondary transition-colors inline-flex items-center justify-center gap-2">
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
