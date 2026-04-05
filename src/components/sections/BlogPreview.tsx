'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { blogData } from '@/data/blog';

export default function BlogPreview() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  const [featured, ...rest] = blogData;

  return (
    <section ref={ref} className="py-[var(--space-f55)]" aria-label="Blog preview">
      <div className="mx-auto max-w-[110rem] px-[var(--space-f21)]">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-[var(--space-f55)] flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-xl">
            <p className="mb-3 text-caption font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Expert insights
            </p>
            <h2 className="text-h2 mb-2 text-[var(--text-primary)]">Pet care tips & news</h2>
            <p className="text-lg text-[var(--text-light)]">
              Expert advice on keeping your pets healthy, happy, and thriving.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] hover:underline"
          >
            All articles <ArrowRight size={16} aria-hidden />
          </Link>
        </motion.div>

        {/* Asymmetric grid: 1 featured + 2 small */}
        <div className="grid gap-[var(--space-f21)] md:grid-cols-2 xl:grid-cols-3">
          
          {/* Featured card */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="xl:col-span-2"
            >
              <Link href={`/blog/${featured.id}`} className="group block">
                <div className="relative overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[0_20px_50px_-25px_rgba(15,18,24,0.12)] transition-shadow hover:shadow-[0_30px_70px_-20px_rgba(15,18,24,0.2)]">
                  <div className="relative h-72 w-full overflow-hidden">
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] via-[var(--card-bg)]/20 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-[var(--primary)] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
                      Featured
                    </span>
                  </div>
                  <div className="p-7">
                    <div className="mb-3 flex items-center gap-4 text-caption text-[var(--text-light)]">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} aria-hidden /> {featured.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} aria-hidden /> 5 min read
                      </span>
                    </div>
                    <h3 className="mb-3 text-xl font-bold leading-snug text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors md:text-2xl">
                      {featured.title}
                    </h3>
                    <p className="line-clamp-2 text-sm text-[var(--text-light)] leading-relaxed">
                      {featured.excerpt}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--primary)]">
                      Read article <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Small cards */}
          <div className="flex flex-col gap-[var(--space-f21)]">
            {rest.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: 24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/blog/${post.id}`} className="group flex gap-4 overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-sm transition-all hover:shadow-md hover:border-[color-mix(in_srgb,var(--primary)_30%,transparent)] hover:-translate-y-0.5">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-light)]">
                      {post.date}
                    </span>
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-3 text-sm font-semibold text-[var(--text-primary)] shadow-sm"
          >
            View all posts <ArrowRight size={14} className="text-[var(--primary)]" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
