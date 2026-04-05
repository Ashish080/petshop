'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { brandConfig } from '@/config/brand';
import { Phone, ShieldCheck, Sparkles, ArrowRight, Star } from 'lucide-react';
import { FloatingParticles } from '@/components/motion/FloatingParticles';
import { Magnetic } from '@/components/motion/Magnetic';

const HeroPetCanvas = dynamic(() => import('@/components/three/HeroPetScene'), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[min(55vh,420px)] w-full items-center justify-center rounded-[var(--space-f34)] bg-gradient-to-br from-[var(--cream)] to-white md:h-[min(62vh,520px)] dark:from-[#1a1d24] dark:to-[#0e1014]"
      aria-hidden
    >
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-[var(--primary)]/30 border-t-[var(--primary)] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-[var(--primary)] text-xl">🐾</div>
      </div>
    </div>
  ),
});

const trustStats = [
  { value: '500+', label: 'Pet families' },
  { value: '15yr', label: 'In business' },
  { value: '4.9', label: 'Avg rating', icon: Star },
];

export default function Hero() {
  const { scrollY } = useScroll();
  const rawBgY = useTransform(scrollY, [0, 500], [0, 100]);
  const bgY = useSpring(rawBgY, { stiffness: 200, damping: 40 });
  const textY = useTransform(scrollY, [0, 300], [0, 40]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.4]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' as const } },
  };

  return (
    <section className="relative overflow-hidden pt-[var(--space-f34)] pb-[var(--space-f55)]" aria-label="Hero">
      {/* Parallax radial blobs */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ y: bgY }}>
        <div className="absolute -left-[15%] -top-[10%] h-[min(100vh,800px)] w-[65%] rounded-full bg-[color-mix(in_srgb,var(--primary)_13%,transparent)] blur-[120px]" />
        <div className="absolute -right-[5%] bottom-0 h-[60%] w-[40%] rounded-full bg-[color-mix(in_srgb,var(--secondary)_15%,transparent)] blur-[100px]" />
        <div className="absolute left-[40%] top-[20%] h-[35%] w-[30%] rounded-full bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] blur-[80px]" />
      </motion.div>

      {/* Subtle noise/grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5] opacity-[0.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: '200px' }}
      />

      <FloatingParticles />

      <div className="mx-auto flex max-w-[110rem] flex-col gap-[var(--space-f34)] px-[var(--space-f21)] lg:grid lg:grid-cols-[1fr_1.618fr] lg:items-center lg:gap-[var(--space-f55)]">
        
        {/* Left: Text */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          style={{ y: textY, opacity }}
        >
          <motion.div variants={item} className="mb-[var(--space-f21)] inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] px-[var(--space-f13)] py-2 text-caption font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {brandConfig.tagline}
          </motion.div>

          <motion.h1 variants={item} className="text-display mb-[var(--space-f21)] text-[var(--text-primary)]">
            Where every pet{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[var(--primary)] via-[#ff9a3c] to-[var(--secondary)] bg-clip-text text-transparent">
                finds a family
              </span>
              {/* Animated underline */}
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>{' '}
            they deserve.
          </motion.h1>

          <motion.p variants={item} className="mb-[var(--space-f34)] max-w-xl text-lg leading-relaxed text-[var(--text-light)] md:text-xl">
            Premium pets, verified breeds, and expert care — all in one beautifully designed experience. Trusted by{' '}
            <span className="font-semibold text-[var(--text-body)]">500+ families</span> in Lucknow.
          </motion.p>

          <motion.div variants={item} className="mb-[var(--space-f34)] flex flex-col gap-[var(--space-f13)] sm:flex-row sm:items-center">
            <Magnetic strength={0.28}>
              <Link
                href="/pets"
                className="gpu group inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-[var(--space-f34)] text-base font-semibold text-white shadow-[0_18px_40px_-12px_rgba(255,122,0,0.55)] transition-shadow hover:shadow-[0_24px_50px_-10px_rgba(255,122,0,0.65)]"
              >
                Browse pets
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}>
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </motion.span>
              </Link>
            </Magnetic>
            <a href={`tel:${brandConfig.phone.replace(/[^0-9]/g, '')}`}>
              <motion.span
                className="gpu inline-flex min-h-[3.25rem] cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-[var(--space-f34)] text-base font-semibold text-[var(--text-primary)] backdrop-blur-md transition-colors hover:border-[color-mix(in_srgb,var(--primary)_45%,transparent)] hover:bg-[color-mix(in_srgb,var(--primary)_4%,transparent)]"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone className="h-4 w-4 text-[var(--secondary)]" aria-hidden />
                Call the shop
              </motion.span>
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-x-[var(--space-f21)] gap-y-3">
            {trustStats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2">
                {Icon && <Icon className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />}
                {!Icon && <ShieldCheck className="h-4 w-4 text-[var(--secondary)]" aria-hidden />}
                <span className="text-sm font-bold text-[var(--text-primary)]">{value}</span>
                <span className="text-caption text-[var(--text-light)]">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: 3D Canvas */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Decorative rings */}
          <div aria-hidden className="absolute -inset-4 rounded-[calc(var(--space-f34)+1rem)] border border-dashed border-[color-mix(in_srgb,var(--primary)_18%,transparent)] animate-[spin_30s_linear_infinite]" />
          <div aria-hidden className="absolute -inset-8 rounded-[calc(var(--space-f34)+2rem)] border border-dashed border-[color-mix(in_srgb,var(--secondary)_12%,transparent)] animate-[spin_45s_linear_infinite_reverse]" />

          <div className="relative rounded-[var(--space-f34)] border border-[var(--card-border)] bg-gradient-to-br from-[var(--card-bg)] to-[color-mix(in_srgb,var(--cream)_80%,white)] p-[var(--space-f21)] shadow-[0_40px_100px_-30px_rgba(15,18,24,0.22)] dark:from-[var(--card-bg)] dark:to-[#12151c] dark:shadow-[0_50px_120px_-40px_rgba(0,0,0,0.65)]">
            {/* Glowing orb inside card */}
            <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[60%] w-[60%] rounded-full bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] blur-[60px]" />
            
            <p className="mb-[var(--space-f13)] text-caption font-semibold uppercase tracking-[0.2em] text-[var(--text-light)]">
              Live 3D companion · scroll & hover
            </p>
            <HeroPetCanvas />
            <p className="mt-[var(--space-f13)] text-center text-caption text-[var(--text-light)]">
              Interactive Three.js scene · GPU-accelerated
            </p>
          </div>

          {/* Floating badge */}
          <motion.div
            className="absolute -bottom-4 -left-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 shadow-xl backdrop-blur-xl"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2">
              <div className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-emerald-600">
                Pets in stock
              </span>
            </div>
          </motion.div>

          <motion.div
            className="absolute -top-4 -right-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 shadow-xl backdrop-blur-xl"
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🐾</span>
              <span className="text-[11px] font-semibold text-[var(--text-body)]">Health verified</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
