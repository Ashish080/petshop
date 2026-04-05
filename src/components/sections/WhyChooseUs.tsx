'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, Stethoscope, Utensils, Syringe, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCountUp } from '@/components/motion/useCountUp';

const features = [
  {
    icon: Award,
    title: 'Breed Certificate',
    desc: 'Every pet comes with KCI / IKC certified breed papers proving authenticity and lineage.',
    color: 'var(--primary)',
  },
  {
    icon: Stethoscope,
    title: 'Free Vet Consultation',
    desc: 'First vet visit is on us. Your pet gets a complete health check on arrival.',
    color: 'var(--secondary)',
  },
  {
    icon: Utensils,
    title: 'Free Diet Plan',
    desc: 'Customized 30-day nutrition plan prepared by our in-house vet nutritionist.',
    color: '#f59e0b',
  },
  {
    icon: Syringe,
    title: 'Fully Vaccinated',
    desc: 'All pets are vaccinated, dewormed, and health-checked before going home.',
    color: '#10b981',
  },
];

function StatCount({ end, suffix = '', duration = 1200 }: { end: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(inView ? end : 0, duration, 0, 0);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function WhyChooseUs() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  };
  const cardItem = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
  };

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-[var(--space-f55)]"
      aria-label="Why choose us"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] via-[#e86800] to-[#c85c00]" />
      
      {/* Mesh overlay */}
      <div aria-hidden className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />
      
      {/* Abstract shapes */}
      <div aria-hidden className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div aria-hidden className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-[var(--secondary)]/25 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[110rem] px-[var(--space-f21)]">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-[var(--space-f55)] text-center"
        >
          <p className="mb-3 text-caption font-semibold uppercase tracking-[0.2em] text-white/60">
            Our promise
          </p>
          <h2 className="text-h2 mb-4 text-white">
            Why 500+ families choose Kanha
          </h2>
          <p className="mx-auto max-w-xl text-lg text-white/75">
            We don't just sell pets — we build lifelong bonds. Every companion is ethically raised and strictly vetted.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-[var(--space-f55)] grid grid-cols-3 gap-4 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm md:gap-8 md:p-8"
        >
          {[
            { end: 500, suffix: '+', label: 'Happy families' },
            { end: 15, suffix: 'yr', label: 'In business' },
            { end: 98, suffix: '%', label: 'Success rate' },
          ].map(({ end, suffix, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-white md:text-4xl">
                <StatCount end={end} suffix={suffix} />
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-white/60">
                {label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="mb-[var(--space-f34)] grid grid-cols-1 gap-[var(--space-f21)] sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={cardItem}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-8 backdrop-blur-sm"
            >
              {/* Card glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle at 50% 0%, ${feature.color}25, transparent 70%)` }}
              />

              <div
                className="relative z-10 mb-[var(--space-f21)] flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-sm"
                style={{ boxShadow: `0 8px 24px -8px ${feature.color}50` }}
              >
                <feature.icon size={28} className="text-white" strokeWidth={1.75} />
              </div>
              <h3 className="relative z-10 mb-3 text-lg font-bold text-white">{feature.title}</h3>
              <p className="relative z-10 text-sm leading-relaxed text-white/70">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <Link
            href="/pets"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/15 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/25 hover:border-white/40 hover:-translate-y-0.5"
          >
            Meet our pets <ArrowRight size={16} aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
