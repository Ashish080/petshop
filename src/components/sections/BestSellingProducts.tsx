'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/cards/ProductCard';
import { productsData } from '@/data/products';
import { ScrollReveal } from '@/components/motion/ScrollReveal';

export default function BestSellingProducts() {
  const bestSellers = productsData.filter((product) => product.isBestSeller).slice(0, 8);

  return (
    <section className="py-[var(--space-f55)]">
      <div className="mx-auto max-w-[110rem] px-[var(--space-f21)]">
        <ScrollReveal className="mb-[var(--space-f34)] flex flex-col gap-[var(--space-f21)] md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-[var(--space-f13)] text-caption font-semibold uppercase tracking-[0.2em] text-[var(--text-light)]">
              Store bestsellers
            </p>
            <h2 className="text-h2 mb-[var(--space-f13)] text-[var(--text-primary)]">
              Products pets actually love
            </h2>
            <p className="text-lg text-[var(--text-light)]">
              Premium nutrition, cozy bedding, engaging toys — curated by our vets for happy, healthy pets.
            </p>
          </div>
          <Link
            href="/products"
            className="group hidden items-center gap-2 text-sm font-semibold text-[var(--primary)] md:inline-flex"
          >
            Shop catalog
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.span>
          </Link>
        </ScrollReveal>

        <div className="-mx-[var(--space-f21)] flex gap-[var(--space-f21)] overflow-x-auto overflow-y-visible pb-4 pt-2 snap-x snap-mandatory px-[var(--space-f21)] scrollbar-hide md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
          {bestSellers.map((product, i) => (
            <motion.div
              key={product.id}
              className="min-w-[min(88vw,300px)] shrink-0 snap-center md:min-w-0"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </div>

        <div className="mt-[var(--space-f34)] flex justify-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-sm"
          >
            Browse all products
            <ArrowRight className="h-4 w-4 text-[var(--primary)]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
