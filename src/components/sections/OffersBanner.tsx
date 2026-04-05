'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Zap, Clock } from 'lucide-react';

export default function OffersBanner() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  return (
    <section ref={ref} className="py-[var(--space-f21)] mx-auto max-w-[110rem] px-[var(--space-f21)]">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[var(--space-f34)] bg-gradient-to-br from-[var(--secondary)] via-[#4aaa98] to-[#3d9488] p-10 md:p-16 shadow-[0_30px_80px_-20px_rgba(94,184,168,0.45)]"
      >
        {/* Animated background elements */}
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div aria-hidden className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-[var(--primary)]/15 blur-3xl" />
        
        {/* Animated dots grid */}
        <div aria-hidden className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Floating icons */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-8 top-8 hidden xl:text-6xl xl:block opacity-30"
          aria-hidden
        >
          🐾
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute right-32 bottom-8 hidden xl:text-4xl xl:block opacity-25"
          aria-hidden
        >
          ✨
        </motion.div>

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            {/* Pill badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
              <Zap size={11} aria-hidden className="fill-white" />
              Limited time offer
              <Clock size={11} aria-hidden />
            </div>

            <h2 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl">
              Get{' '}
              <span className="relative inline-block">
                <span className="relative z-10">20% off</span>
                <span className="absolute inset-0 -skew-x-3 rounded-lg bg-white/20" />
              </span>{' '}
              your first grooming!
            </h2>
            <p className="text-lg text-white/80 max-w-md">
              Treat your furry friend to a premium spa day. Book today and give them the royal treatment they deserve.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row md:items-start lg:items-center">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/services#grooming"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-[var(--secondary)] shadow-[0_12px_30px_-8px_rgba(0,0,0,0.2)] transition-shadow hover:shadow-[0_16px_40px_-6px_rgba(0,0,0,0.25)]"
              >
                Claim offer <ArrowRight size={16} aria-hidden />
              </Link>
            </motion.div>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              View all services
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
