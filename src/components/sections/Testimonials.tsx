'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
import { testimonialsData } from '@/data/testimonials';

// Duplicate for infinite marquee
const doubledTestimonials = [...testimonialsData, ...testimonialsData];

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonialsData[0]; index: number }) {
  return (
    <motion.div
      className="group relative flex w-[min(86vw,340px)] flex-shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-[0_20px_50px_-25px_rgba(15,18,24,0.12)]"
      whileHover={{ y: -4, scale: 1.01, borderColor: 'color-mix(in srgb, var(--primary) 35%, transparent)' }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        {/* Quote icon */}
        <Quote className="mb-4 h-8 w-8 text-[var(--primary)]/30" aria-hidden />

        {/* Stars */}
        <div className="mb-4 flex gap-1">
          {Array.from({ length: testimonial.rating ?? 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
          ))}
        </div>

        <p className="text-[var(--text-body)] leading-relaxed italic">
          "{testimonial.content}"
        </p>
      </div>

      <div className="relative z-10 mt-6 flex items-center gap-3 border-t border-[var(--card-border)] pt-6">
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div>
          <h4 className="font-bold text-[var(--text-primary)]">{testimonial.name}</h4>
          <p className="text-caption text-[var(--text-light)]">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  return (
    <section ref={ref} className="overflow-hidden py-[var(--space-f55)]" aria-label="Testimonials">
      <div className="mx-auto max-w-[110rem] px-[var(--space-f21)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-[var(--space-f55)] max-w-2xl"
        >
          <p className="mb-3 text-caption font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Happy pet parents
          </p>
          <h2 className="text-h2 mb-4 text-[var(--text-primary)]">
            Loved by families across Lucknow
          </h2>
          <p className="text-lg text-[var(--text-light)]">
            Over 500 families have found their perfect companion through Kanha. Here's what they say.
          </p>
        </motion.div>
      </div>

      {/* Infinite marquee row 1 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-[var(--space-f21)]"
      >
        <div
          className="flex gap-[var(--space-f21)]"
          style={{
            animation: 'marquee-left 40s linear infinite',
            width: 'max-content',
          }}
        >
          {doubledTestimonials.map((t, i) => (
            <TestimonialCard key={`row1-${i}`} testimonial={t} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Infinite marquee row 2 (reversed) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        <div
          className="flex gap-[var(--space-f21)]"
          style={{
            animation: 'marquee-right 50s linear infinite',
            width: 'max-content',
          }}
        >
          {[...doubledTestimonials].reverse().map((t, i) => (
            <TestimonialCard key={`row2-${i}`} testimonial={t} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
