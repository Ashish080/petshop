'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

const points = [
  '7-Day health guarantee',
  'Pure breed certified',
  'Full vaccination records',
  'Lifetime breeder support',
];

export default function Guarantee() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8%' });

  return (
    <section
      ref={ref}
      className="py-[var(--space-f34)] mx-auto max-w-[110rem] px-[var(--space-f21)]"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-8 rounded-3xl border border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50 p-10 md:flex-row md:gap-12 md:p-14 dark:from-amber-900/10 dark:to-orange-900/10 dark:border-amber-800/20"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 200 }}
          className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-400 shadow-[0_20px_50px_-15px_rgba(245,158,11,0.55)]"
        >
          <ShieldCheck size={52} className="text-white" strokeWidth={1.5} />
        </motion.div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-h3 mb-3 font-bold text-[var(--text-primary)]">
            Our 100% health & authenticity guarantee
          </h2>
          <p className="mb-6 max-w-2xl text-[var(--text-light)]">
            Every pet from Kanha comes with a written health guarantee. If your pet shows any issues within 7 days, we cover the vet expenses — no questions asked.
          </p>

          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            {points.map((point, i) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                className="flex items-center gap-2 rounded-xl bg-amber-100/70 px-4 py-2 text-sm font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
              >
                <CheckCircle2 size={15} aria-hidden className="text-amber-600 dark:text-amber-400" />
                {point}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
