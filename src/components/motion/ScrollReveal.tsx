'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

const defaultTransition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 34,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ ...defaultTransition, delay }}
    >
      {children}
    </motion.div>
  );
}
