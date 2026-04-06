'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  MotionValue,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowUpRight } from 'lucide-react';

// ─── Data ───────────────────────────────────────────────────────────────────

const ITEMS = [
  {
    id: 1,
    title: 'Puppy Star Kit',
    price: '1,299',
    category: 'Essentials',
    // Source: Victor G on Unsplash — golden retriever portrait
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop',
    accent: '#FF7A00',
  },
  {
    id: 2,
    title: 'Premium Nutrition',
    price: '4,500',
    category: 'Nutrition',
    // Source: Unsplash — dog eating food bowl
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=800&auto=format&fit=crop',
    accent: '#E8C547',
  },
  {
    id: 3,
    title: 'Orthopedic Bed',
    price: '8,900',
    category: 'Comfort',
    // Source: Zach Wear on Unsplash — Bernese St Bernard on dog bed (2025)
    image: 'https://images.unsplash.com/photo-1742565954706-14f3b03c4938?q=80&w=800&auto=format&fit=crop',
    accent: '#6FD1A3',
  },
  {
    id: 4,
    title: 'Smart Pet Tech',
    price: '12,000',
    category: 'Innovation',
    // Source: charlesdeluvio on Unsplash — black dog in denim collar portrait
    image: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?q=80&w=800&auto=format&fit=crop',
    accent: '#78BEFF',
  },
  {
    id: 5,
    title: 'Grooming Set',
    price: '2,300',
    category: 'Care',
    // Source: J. Balla Photography on Unsplash — dog grooming with blow dryer
    image: 'https://images.unsplash.com/photo-1625794084867-8ddd239946b1?q=80&w=800&auto=format&fit=crop',
    accent: '#C78EFF',
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

type Item = (typeof ITEMS)[number];

interface ShowcaseItemProps {
  item: Item;
  index: number;
  scrollYProgress: MotionValue<number>;
  total: number;
}

// ─── Root export ─────────────────────────────────────────────────────────────
// Hydration-safe wrapper: renders a skeleton on the server, mounts real
// content only after the client has hydrated.

export function HorizontalShowcase() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[350vh] bg-black" aria-hidden />;
  }

  return <HorizontalScrollContent />;
}

// ─── Main scroll section ─────────────────────────────────────────────────────

function HorizontalScrollContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const total = ITEMS.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth spring wrapper — drives all child transforms
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    restDelta: 0.001,
  });

  // Integer progress label (0-100)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setProgress(Math.round(v * 100));
  });

  // ── Horizontal translate ──────────────────────────────────────────────────
  // Cards start off-right (120vw), travel left to end at -20vw so the last
  // card sits comfortably centred. Adjust endX if card count changes.
  const x = useTransform(smoothProgress, [0, 1], ['120vw', `-${(total - 1) * 52}vw`]);

  // ── Section fade-out at bottom ────────────────────────────────────────────
  const sectionOpacity = useTransform(smoothProgress, [0.92, 1], [1, 0]);
  const sectionScale = useTransform(smoothProgress, [0.92, 1], [1, 0.97]);

  // ── Heading fade + blur out ───────────────────────────────────────────────
  const headingOpacity = useTransform(smoothProgress, [0, 0.18], [1, 0]);
  const headingY = useTransform(smoothProgress, [0, 0.18], [0, -40]);

  // ── Watermark drift ───────────────────────────────────────────────────────
  const watermarkX = useTransform(smoothProgress, [0, 1], ['0%', '-8%']);
  const watermarkOpacity = useTransform(
    smoothProgress,
    [0, 0.3, 0.85, 1],
    [0.05, 0.08, 0.04, 0],
  );

  return (
    <section
      ref={containerRef}
      className="relative h-[350vh] bg-bg-primary"
      aria-label="Product showcase"
    >
      {/* ── Sticky viewport ── */}
      <motion.div
        style={{ opacity: sectionOpacity, scale: sectionScale }}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-bg-primary"
      >
        {/* ── Noise grain overlay ─────────────────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
          }}
        />

        {/* ── Watermark ───────────────────────────────────────────────────── */}
        <motion.p
          aria-hidden
          style={{ x: watermarkX, opacity: watermarkOpacity }}
          className="pointer-events-none select-none absolute inset-0 flex items-center justify-center text-text-primary font-bold italic uppercase tracking-tighter text-[22vw] whitespace-nowrap z-0"
        >
          KANHA
        </motion.p>

        {/* ── Heading ─────────────────────────────────────────────────────── */}
        <motion.header
          style={{ opacity: headingOpacity, y: headingY }}
          className="absolute left-[6%] top-1/2 -translate-y-1/2 z-20 pointer-events-none"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-bg-secondary/50 backdrop-blur-md text-label-sm font-bold uppercase tracking-overline text-brand mb-6">
            <Sparkles size={12} className="fill-current shrink-0" />
            Premium Curator
          </div>

          <h2 className="text-[clamp(3.5rem,10vw,11rem)] font-bold text-text-primary leading-[0.82] tracking-tighter uppercase italic">
            THE{' '}
            <span
              className="block"
              style={{
                WebkitTextStroke: '2px var(--color-brand)',
                color: 'transparent',
              }}
            >
              COLLECTION.
            </span>
          </h2>
        </motion.header>

        {/* ── Card strip ──────────────────────────────────────────────────── */}
        <motion.div
          style={{ x }}
          className="flex gap-6 lg:gap-10 items-center absolute left-0 z-10 will-change-transform"
        >
          {ITEMS.map((item, i) => (
            <ShowcaseItem
              key={item.id}
              item={item}
              index={i}
              scrollYProgress={smoothProgress}
              total={total}
            />
          ))}
        </motion.div>

        {/* ── Progress indicator ──────────────────────────────────────────── */}
        <footer className="absolute bottom-6 md:bottom-12 left-6 md:left-16 flex items-center gap-6 z-30">
          <div className="relative h-px w-24 md:w-64 bg-border overflow-hidden rounded-[--radius-full]">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="absolute inset-0 rounded-full origin-left"
              style={{ backgroundColor: 'var(--color-brand)', scaleX: scrollYProgress }}
            />
          </div>
          <span className="text-label-sm font-bold text-text-tertiary uppercase tracking-overline tabular-nums">
            {String(progress).padStart(2, '0')}
            <span className="hidden sm:inline"> / 100</span>
          </span>
        </footer>
      </motion.div>
    </section>
  );
}

// ─── Individual card ──────────────────────────────────────────────────────────
// All motion values are derived at the top of this component, never inside
// JSX — that was a rules-of-hooks violation in the original.

function ShowcaseItem({ item, index, scrollYProgress, total }: ShowcaseItemProps) {
  // Each card enters in a staggered window: [entryStart, entryEnd]
  const segmentSize = 1 / total;
  const entryStart = index * segmentSize * 0.6;
  const entryEnd = entryStart + segmentSize * 0.5;

  // Opacity: 0 → 1 as card enters the viewport band
  const opacity = useTransform(scrollYProgress, [entryStart, entryEnd], [0, 1]);

  // Subtle vertical bob — alternating up/down between cards
  const yBase = index % 2 === 0 ? -14 : 14;
  const y = useTransform(scrollYProgress, [0, 1], [yBase, -yBase]);

  // Gentle tilt: -3° → +3° across the whole scroll
  const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);

  // Scale: each card pops slightly as its window passes
  const scaleStart = Math.max(0, entryStart - 0.05);
  const scalePeak = (entryStart + entryEnd) / 2;
  const scaleEnd = Math.min(1, entryEnd + 0.2);
  const scale = useTransform(
    scrollYProgress,
    [scaleStart, scalePeak, scaleEnd],
    [0.88, 1.04, 0.97],
  );

  return (
    <motion.article
      style={{ opacity, y, rotate, scale }}
      className="flex-shrink-0 w-[260px] sm:w-[360px] md:w-[460px] lg:w-[600px] will-change-transform"
    >
      <div className="group relative rounded-[--radius-xl] overflow-hidden bg-bg-tertiary/50 border border-border transition-colors duration-700 hover:border-border-hover shadow-md">

        {/* ── Accent glow on hover ─────────────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[inherit] z-0"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${item.accent}22, transparent)`,
          }}
        />

        {/* ── Image ───────────────────────────────────────────────────── */}
        <div className="relative h-[340px] sm:h-[440px] md:h-[560px] overflow-hidden bg-black">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-105 brightness-75 group-hover:brightness-90"
            sizes="(max-width: 640px) 260px, (max-width: 768px) 360px, (max-width: 1024px) 460px, 600px"
            draggable={false}
          />

          {/* bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* ── Category + price chip ─────────────────────────────────── */}
          <div className="absolute bottom-5 md:bottom-10 right-5 md:right-10 z-10 text-right">
            <p
              className="text-label-sm font-bold uppercase tracking-[0.45em] mb-1"
              style={{ color: item.accent }}
            >
              {item.category}
            </p>
            <p className="text-3xl sm:text-4xl md:text-6xl font-bold text-text-primary italic leading-none tracking-tighter">
              ₹{item.price}
            </p>
          </div>

          {/* ── Index label ───────────────────────────────────────────── */}
          <div className="absolute top-5 md:top-8 left-5 md:left-8 w-8 h-8 md:w-10 md:h-10 rounded-[--radius-full] border border-border/20 flex items-center justify-center">
            <span className="text-label-sm font-bold text-text-primary/60 tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div className="relative z-10 px-6 md:px-12 pt-6 md:pt-10 pb-6 md:pb-10 flex items-end justify-between gap-4">
          <h3 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-text-primary uppercase italic tracking-tighter leading-[0.85] group-hover:translate-x-1.5 transition-transform duration-500 ease-out">
            {item.title}
          </h3>

          <Link
            href="/contact"
            aria-label={`Inquire about ${item.title}`}
            className="shrink-0"
          >
            <span
              className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-[--radius-lg] transition-all duration-500 group-hover:scale-110 group-hover:shadow-brand-lg"
              style={{ backgroundColor: item.accent }}
            >
              <ArrowUpRight className="w-5 h-5 md:w-7 md:h-7 text-white" strokeWidth={2.5} />
            </span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}