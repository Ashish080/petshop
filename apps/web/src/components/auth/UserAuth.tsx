'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, User, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motionPresets } from '@/lib/motion';
import { brandConfig } from '@/config/brand';

const trustPoints = [
  'Guest checkout flow',
  'Unified order + care history',
  'Fast human support',
];

export default function UserAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error('We could not match those details. Please try again.');
          return;
        }

        toast.success('Welcome back.');
        router.push(callbackUrl);
        router.refresh();
        return;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'user',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'We could not create your account yet.');
        return;
      }

      toast.success('Account created. You can sign in now.');
      setMode('login');
    } catch (error) {
      console.error(error);
      toast.error('Something unexpected happened. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 md:px-6 md:py-10">
      <div className="hero-aurora fixed inset-0 pointer-events-none opacity-80" />
      <div className="container-app relative z-10">
        <div className="premium-shell mx-auto grid max-w-6xl overflow-hidden rounded-[40px] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden bg-text-primary px-8 py-10 text-white md:px-10 md:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(63,124,255,0.22),transparent_30%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <Link href="/" className="inline-flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <p className="text-kicker text-white/60">Premium pet marketplace</p>
                    <p className="text-lg font-semibold">{brandConfig.name}</p>
                  </div>
                </Link>

                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-12 max-w-md"
                >
                  <p className="text-kicker text-white/65">Customer account</p>
                  <h1 className="mt-4 text-[clamp(2.6rem,5vw,4.5rem)] font-black leading-[0.95] tracking-[-0.05em]">
                    Sign in.
                    <br />
                    Keep moving.
                  </h1>
                  <p className="mt-5 text-base leading-7 text-white/72 md:text-lg">
                    Premium access without friction.
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 }}
                className="relative z-10 mt-12 space-y-3 rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl"
              >
                {trustPoints.map((point) => (
                  <motion.div key={point} whileHover={{ x: 2 }} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                      <ShieldCheck size={14} />
                    </div>
                    <p className="text-sm leading-6 text-white/78">{point}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          <div className="premium-panel flex flex-col justify-center px-6 py-8 md:px-10 md:py-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-wrap gap-2 rounded-full border border-border bg-bg-tertiary/80 p-1"
            >
              {[
                { id: 'login', label: 'Sign in' },
                { id: 'signup', label: 'Create account' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id as 'login' | 'signup')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    mode === item.id
                      ? 'bg-bg-elevated text-text-primary shadow-xs'
                      : 'text-text-secondary'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                {...motionPresets.fade}
                className="mt-8"
              >
                <div className="mb-8">
                  <p className="text-kicker text-brand">
                    {mode === 'login' ? 'Welcome back' : 'Create your account'}
                  </p>
                  <h2 className="mt-2 text-h2 font-extrabold text-text-primary tracking-tight">
                    {mode === 'login'
                      ? 'Continue in seconds.'
                      : 'Create your account.'}
                  </h2>
                </div>

                <form className="space-y-5" onSubmit={handleAuth}>
                  {mode === 'signup' && (
                    <Input
                      label="Full name"
                      placeholder="Enter your name"
                      iconLeft={<User />}
                      required
                      inputSize="lg"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  )}

                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    iconLeft={<Mail />}
                    required
                    inputSize="lg"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />

                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    iconLeft={<Lock />}
                    inputSize="lg"
                    iconRight={
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        className="text-text-tertiary transition-colors hover:text-text-primary"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    }
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />

                  <Button
                    type="submit"
                    loading={loading}
                    size="xl"
                    fullWidth
                    iconRight={!loading ? <ArrowRight size={18} /> : undefined}
                  >
                    {mode === 'login' ? 'Sign in' : 'Create account'}
                  </Button>
                </form>

                <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-border pt-6">
                  <Link href="/contact" className="text-label font-semibold uppercase tracking-[0.14em] text-brand">
                    Contact support
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
