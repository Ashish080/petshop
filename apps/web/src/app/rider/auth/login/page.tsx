'use client';

import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Lock, Mail, ShieldCheck, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function RiderLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('We could not verify those rider credentials.');
        return;
      }

      toast.success('Signed in.');
      router.push('/rider');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-6 md:py-10" data-theme="dark">
      <div className="hero-aurora fixed inset-0 pointer-events-none opacity-60" />
      <div className="container-app relative z-10">
        <div className="premium-shell mx-auto grid max-w-5xl overflow-hidden rounded-[40px] lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative overflow-hidden bg-[#0F172A] px-8 py-10 text-white md:px-10 md:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(63,124,255,0.28),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,107,0,0.16),transparent_30%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  <Truck size={16} />
                  <span className="text-kicker text-white/70">Rider workspace</span>
                </div>

                <motion.h1
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-10 text-[clamp(2.6rem,5vw,4.2rem)] font-black leading-[0.95] tracking-[-0.05em]"
                >
                  Next stop.
                  <br />
                  Zero friction.
                </motion.h1>
              </div>

              <div className="space-y-3 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                {[
                  'One-handed rider flow',
                  'Offline-safe sync',
                  'Lightweight order context',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                      <ShieldCheck size={14} />
                    </div>
                    <p className="text-sm leading-6 text-white/76">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="premium-panel flex flex-col justify-center px-6 py-8 md:px-10 md:py-12">
            <div className="max-w-xl">
              <p className="text-kicker text-accent">Rider sign in</p>
              <h2 className="mt-2 text-h2 font-extrabold tracking-tight text-text-primary">
                Start your shift.
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="rider@petshop.com"
                inputSize="lg"
                iconLeft={<Mail />}
                required
                value={formData.email}
                onChange={(event) =>
                  setFormData({ ...formData, email: event.target.value })
                }
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                inputSize="lg"
                iconLeft={<Lock />}
                required
                value={formData.password}
                onChange={(event) =>
                  setFormData({ ...formData, password: event.target.value })
                }
              />

              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                size="xl"
                fullWidth
                iconRight={!loading ? <ArrowRight size={18} /> : undefined}
              >
                Sign in to rider app
              </Button>
            </form>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
              <Link
                href="/rider/auth/signup"
                className="text-label font-semibold uppercase tracking-[0.14em] text-accent"
              >
                New rider? Create account
              </Link>
              <Link
                href="/"
                className="text-body-xs text-text-tertiary transition-colors hover:text-text-primary"
              >
                Back to storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RiderLoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-text-secondary">Loading rider sign in…</div>}>
      <RiderLoginForm />
    </Suspense>
  );
}
