'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Scissors, Stethoscope, Home } from 'lucide-react';
import { siteContent } from '@/config/site-content';
import { servicesData } from '@/data/services';

const iconMap: Record<string, React.ReactNode> = {
  scissors: <Scissors size={22} />,
  stethoscope: <Stethoscope size={22} />,
  home: <Home size={22} />,
};

const accentColors = [
  { text: 'var(--primary)', bg: 'color-mix(in srgb, var(--primary) 12%, transparent)' },
  { text: 'var(--secondary)', bg: 'color-mix(in srgb, var(--secondary) 14%, transparent)' },
  { text: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
];

export default function Services() {
  const { services: content } = siteContent;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  return (
    <section ref={ref} className="py-[var(--space-f55)] relative overflow-hidden" aria-label="Services">
      {/* Background pattern */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent,color-mix(in_srgb,var(--cream)_60%,transparent),transparent)] dark:bg-[linear-gradient(to_bottom,transparent,color-mix(in_srgb,#12151c_50%,transparent),transparent)]" />

      <div className="mx-auto max-w-[110rem] px-[var(--space-f21)]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-[var(--space-f55)] max-w-2xl"
        >
          <p className="mb-3 text-caption font-semibold uppercase tracking-[0.2em] text-[var(--secondary)]">
            What we offer
          </p>
          <h2 className="text-h2 mb-4 text-[var(--text-primary)]">{content.title}</h2>
          <p className="text-lg text-[var(--text-light)]">{content.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-[var(--space-f21)]">
          {servicesData.map((service, idx) => {
            const accent = accentColors[idx % accentColors.length];
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[0_20px_50px_-25px_rgba(15,18,24,0.1)] transition-shadow hover:shadow-[0_30px_70px_-20px_rgba(15,18,24,0.18)]"
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-107"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-transparent to-transparent opacity-60" />

                  {/* Icon badge */}
                  <motion.div
                    className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 backdrop-blur-md"
                    style={{ background: accent.bg, color: accent.text }}
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ duration: 0.25 }}
                  >
                    {iconMap[service.icon]}
                  </motion.div>
                </div>

                <div className="p-7">
                  <h3 className="mb-2 text-xl font-bold text-[var(--text-primary)]">{service.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-[var(--text-light)]">{service.description}</p>
                  
                  <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-5">
                    <span className="font-bold" style={{ color: accent.text }}>
                      From ₹{service.priceStartingAt}
                    </span>
                    <Link
                      href={`/services#${service.title.toLowerCase().replace(' ', '-')}`}
                      className="group/btn inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all"
                      style={{ color: accent.text, background: accent.bg }}
                    >
                      Book Now
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover/btn:translate-x-1"
                        aria-hidden
                      />
                    </Link>
                  </div>
                </div>

                {/* Bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] origin-left rounded-full"
                  style={{ background: accent.text }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
