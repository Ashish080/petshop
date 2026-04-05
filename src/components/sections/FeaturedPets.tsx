'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import PetCard from '@/components/cards/PetCard';
import { petsData } from '@/data/pets';
import { themeConfig } from '@/config/theme';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

export default function FeaturedPets() {
  const featuredPets = petsData.filter((pet) => pet.isFeatured).slice(0, 8);

  return (
    <section className={`${themeConfig.spacing.section} relative overflow-hidden bg-[var(--cream)]/60 dark:bg-[#12151c]/50`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,122,0,0.08),transparent_55%)]" />

      <div className={themeConfig.spacing.container}>
        <ScrollReveal className="mb-[var(--space-f34)] flex flex-col gap-[var(--space-f21)] md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-[var(--space-f13)] text-caption font-semibold uppercase tracking-[0.2em] text-[var(--text-light)]">
              Featured companions
            </p>
            <h2 className="text-h2 mb-[var(--space-f13)] text-[var(--text-primary)]">Meet pets ready for a forever home</h2>
            <p className="text-lg text-[var(--text-light)]">
              Horizontal scroll on small screens, calm grid on large — same story, two rhythms.
            </p>
          </div>
          <Link
            href="/pets"
            className="group hidden items-center gap-2 text-sm font-semibold text-[var(--primary)] md:inline-flex"
          >
            View all
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
              <ArrowRight className="h-5 w-5" />
            </motion.span>
          </Link>
        </ScrollReveal>

        <div className="-mx-[var(--space-f21)] flex gap-[var(--space-f21)] overflow-x-auto overflow-y-visible pb-4 pt-2 snap-x snap-mandatory px-[var(--space-f21)] scrollbar-hide md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
          {featuredPets.map((pet, i) => (
            <motion.div
              key={pet.id}
              className="min-w-[min(88vw,320px)] shrink-0 snap-center md:min-w-0"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <PetCard {...pet} />
            </motion.div>
          ))}
        </div>

        <div className="mt-[var(--space-f34)] flex justify-center md:hidden">
          <Link
            href="/pets"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-sm"
          >
            View all pets
            <ChevronRight className="h-4 w-4 text-[var(--primary)]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
