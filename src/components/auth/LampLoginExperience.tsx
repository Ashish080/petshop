'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

type Props = {
  onSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  loading: boolean;
};

export function LampLoginExperience({
  onSubmit,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  loading,
}: Props) {
  const [pull, setPull] = useState(0);
  const [lit, setLit] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setPull(110);
      setLit(true);
    }
  }, [reduce]);

  const onPull = (v: number) => {
    setPull(v);
    if (v > 72) setLit(true);
    if (v <= 72) setLit(false);
  };

  const lightProgress = pull / 110; // 0–1

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: lit
            ? 'linear-gradient(165deg, #fef9f5 0%, #ffffff 40%, #f0f7ff 100%)'
            : 'linear-gradient(180deg, #080a0e 0%, #0e1117 50%, #131821 100%)',
        }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Glow blobs */}
      <div className="pointer-events-none absolute inset-0 -z-[5]">
        <motion.div
          className="absolute left-[10%] top-[15%] h-80 w-80 rounded-full blur-[120px]"
          animate={{ opacity: lit ? 0.55 : 0.08, scale: lit ? 1.1 : 0.9 }}
          style={{ background: '#ff7a00' }}
          transition={{ duration: 0.85 }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[8%] h-96 w-96 rounded-full blur-[140px]"
          animate={{ opacity: lit ? 0.35 : 0.06 }}
          style={{ background: '#5eb8a8' }}
          transition={{ duration: 0.85 }}
        />
        {/* Animated light cone from lamp when lit */}
        <motion.div
          className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-full"
          animate={{
            height: lit ? '55vh' : '20vh',
            width: lit ? '80vw' : '20vw',
            opacity: lit ? 0.12 : 0,
          }}
          style={{ background: 'conic-gradient(from 180deg at 50% 0%, transparent, #ff7a00, transparent)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-16">
        {/* Lamp SVG */}
        <div className="mb-10 w-full max-w-[280px] flex flex-col items-center gap-5">
          <svg width="220" height="200" viewBox="0 0 220 200" className="overflow-visible drop-shadow-lg" aria-hidden>
            <defs>
              <linearGradient id="shade-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={lit ? '#ffe5c8' : '#c8bfb5'} />
                <stop offset="100%" stopColor={lit ? '#f0c890' : '#b0a898'} />
              </linearGradient>
              <radialGradient id="bulb-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff7a00" stopOpacity={lit ? 1 : 0.4} />
                <stop offset="100%" stopColor="#ff7a00" stopOpacity={0} />
              </radialGradient>
              <filter id="lamp-glow">
                <feGaussianBlur stdDeviation={lit ? '4' : '1'} result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Ceiling mount */}
            <rect x="101" y="0" width="18" height="10" rx="4" fill="#b0a090" />
            
            {/* Cord from ceiling */}
            <line x1="110" y1="10" x2="110" y2="42" stroke="#c0b0a0" strokeWidth="5" strokeLinecap="round" />
            
            {/* Bulb */}
            <motion.g filter={lit ? 'url(#lamp-glow)' : undefined}>
              <circle cx="110" cy="46" r="14" fill="#ff7a00" opacity={0.3 + lightProgress * 0.7} />
              <circle cx="110" cy="46" r="8" fill={lit ? '#fff7e0' : '#ff7a00'} />
            </motion.g>

            {/* Lamp shade — moves down with pull */}
            <motion.g animate={{ y: pull * 0.82 }} transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
              <path
                d="M80 58 Q110 38 140 58 L130 116 Q110 108 90 116 Z"
                fill="url(#shade-grad)"
                stroke={lit ? '#e8c880' : '#c0b8b0'}
                strokeWidth="2"
              />
              {/* Inner shade */}
              <path
                d="M88 68 Q110 52 132 68 L126 108 Q110 102 94 108 Z"
                fill={lit ? 'rgba(255,220,120,0.35)' : 'rgba(0,0,0,0.12)'}
              />
              {/* Shade bottom glow when lit */}
              {lit && (
                <ellipse cx="110" cy="116" rx="30" ry="10" fill="#ff7a00" opacity={0.15 + lightProgress * 0.2} />
              )}
              {/* Pull cord */}
              <motion.line
                x1="110"
                y1="118"
                x2="110"
                y2={175 + pull * 0.3}
                stroke={lit ? '#c8a870' : '#b0a898'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />
              {/* Pull handle */}
              <motion.circle
                cx="110"
                cy={192 + pull * 0.38}
                r="16"
                fill="#ff7a00"
                animate={{ scale: 1 + lightProgress * 0.15 }}
                transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                style={{ filter: lit ? 'drop-shadow(0 4px 12px rgba(255,122,0,0.7))' : undefined }}
              />
              <circle cx="110" cy={192 + pull * 0.38} r="7" fill="white" opacity={0.4} />
            </motion.g>
          </svg>

          {/* Slider */}
          <div className="flex w-full flex-col items-center gap-2">
            <label
              htmlFor="lamp-pull"
              className="text-caption font-semibold uppercase tracking-[0.2em]"
              style={{ color: lit ? '#ff7a00' : '#a09888' }}
            >
              {pull < 40 ? 'Pull the cord ↓' : pull < 73 ? 'Almost there…' : '✓ Room lit!'}
            </label>
            <input
              id="lamp-pull"
              type="range"
              min={0}
              max={110}
              value={pull}
              onChange={(e) => onPull(Number(e.target.value))}
              className="lamp-range h-3 w-full max-w-[220px] cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, #ff7a00 ${(pull / 110) * 100}%, ${lit ? '#fff0e0' : '#2a2e38'} 0%)`,
              }}
              aria-valuetext={lit ? 'Room lit' : 'Dim'}
            />
          </div>
        </div>

        {/* Login card */}
        <motion.div
          animate={{
            opacity: lit ? 1 : 0.3,
            y: lit ? 0 : 18,
            scale: lit ? 1 : 0.97,
            filter: lit ? 'blur(0px)' : 'blur(2px)',
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md overflow-hidden rounded-[var(--space-f21)] border border-[var(--card-border)] bg-[var(--card-bg)]/97 shadow-[0_32px_80px_-24px_rgba(15,18,24,0.3)] backdrop-blur-2xl"
        >
          {/* Card top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[var(--primary)] via-[#ff9a3c] to-[var(--secondary)]" />

          <div className="p-[var(--space-f34)]">
            <div className="mb-[var(--space-f21)] text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[var(--primary)]">
                <Sparkles size={22} />
              </div>
              <h1 className="text-h2 text-[var(--text-primary)]">Welcome back</h1>
              <p className="mt-1.5 text-caption uppercase tracking-[0.14em] text-[var(--text-light)]">
                Sign in to continue your journey
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-[var(--space-f21)]">
              <div>
                <label className="mb-1.5 block text-caption font-semibold uppercase tracking-[0.08em] text-[var(--text-light)]">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--text-light)]" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-caption font-semibold uppercase tracking-[0.08em] text-[var(--text-light)]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-[var(--text-light)]" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-light)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <motion.div
                animate={{ opacity: lit ? 1 : 0.3, y: lit ? 0 : 8 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  type="submit"
                  disabled={loading || !lit}
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={loading}
                >
                  {lit ? 'Sign in to Kanha' : 'Pull the lamp first 🔦'}
                </Button>
              </motion.div>
            </form>

            <p className="mt-[var(--space-f21)] text-center text-sm text-[var(--text-light)]">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="font-semibold text-[var(--primary)] hover:underline">
                Register free
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Demo credentials */}
        <motion.div
          animate={{ opacity: lit ? 1 : 0.45 }}
          className="mt-6 w-full max-w-md rounded-2xl border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] p-4 text-sm text-[var(--text-body)]"
        >
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-light)]">
            Demo credentials
          </p>
          <p className="text-xs">🔑 Admin: <code className="font-mono text-[var(--primary)]">admin@petshop.com</code> / admin123</p>
          <p className="text-xs">🐾 User: <code className="font-mono text-[var(--secondary)]">user@example.com</code> / user123</p>
        </motion.div>
      </div>
    </div>
  );
}
