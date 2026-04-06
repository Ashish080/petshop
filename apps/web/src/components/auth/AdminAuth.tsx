'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Lock, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { brandConfig } from '@/config/brand';

export default function AdminAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('admin@petshop.com');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('We could not verify those admin credentials.');
        return;
      }

      const session = await getSession();
      if (session?.user?.role !== 'admin') {
        toast.error('Admin access is required for this workspace.');
        return;
      }

      toast.success('Admin access granted.');
      router.push('/admin');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-6 md:py-10">
      <div className="hero-aurora fixed inset-0 pointer-events-none opacity-55" />
      <div className="container-app relative z-10">
        <div className="premium-shell mx-auto grid max-w-6xl overflow-hidden rounded-[42px] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative overflow-hidden bg-[#111827] px-8 py-10 text-white md:px-10 md:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,107,0,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(63,124,255,0.18),transparent_30%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2">
                  <ShieldCheck size={16} />
                  <span className="text-kicker text-white/68">Admin dashboard</span>
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-10 text-[clamp(2.8rem,5vw,4.6rem)] font-black leading-[0.95] tracking-[-0.05em]"
                >
                  Control.
                  <br />
                  Clarity.
                  <br />
                  Speed.
                </motion.h1>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 }}
                className="grid gap-4 rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl sm:grid-cols-2"
              >
                <div>
                  <p className="text-kicker text-white/55">Workspace</p>
                  <p className="mt-2 text-xl font-bold">Operations cockpit</p>
                  <p className="mt-2 text-sm text-white/70">Orders, fleet, wallet, analytics.</p>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/6 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                      <BarChart3 size={18} />
                    </div>
                    <div>
                      <p className="text-kicker text-white/55">Demo credentials</p>
                      <p className="mt-1 text-sm font-semibold">admin@petshop.com</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-white/70">Password: admin123</p>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="premium-panel flex flex-col justify-center px-6 py-8 md:px-10 md:py-12">
            <div className="max-w-xl">
              <p className="text-kicker text-brand">Secure sign in</p>
              <h2 className="mt-2 text-h2 font-extrabold tracking-tight text-text-primary">
                Enter admin.
              </h2>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
              <Input
                label="Admin email"
                type="email"
                placeholder="admin@petshop.com"
                iconLeft={<Mail />}
                inputSize="lg"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                iconLeft={<Lock />}
                inputSize="lg"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              <Button
                type="submit"
                loading={loading}
                size="xl"
                fullWidth
                iconRight={!loading ? <ArrowRight size={18} /> : undefined}
              >
                Enter admin dashboard
              </Button>
            </form>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
              <Link href="/" className="text-body-xs text-text-tertiary hover:text-text-primary">
                Return to {brandConfig.name}
              </Link>
              <span className="text-label font-semibold uppercase tracking-[0.14em] text-brand">
                Protected workspace
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
