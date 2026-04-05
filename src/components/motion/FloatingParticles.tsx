'use client';

import { motion, useReducedMotion } from 'framer-motion';

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  size: 3 + (i % 5) * 2,
  left: `${(i * 41) % 100}%`,
  top: `${(i * 67) % 100}%`,
  delay: i * 0.18,
  duration: 4.5 + (i % 7),
  xDrift: i % 2 === 0 ? 14 : -14,
  isPaw: i % 7 === 0,
  isStar: i % 11 === 0,
  color:
    i % 3 === 0
      ? 'var(--primary)'
      : i % 3 === 1
      ? 'var(--secondary)'
      : 'var(--accent)',
}));

export function FloatingParticles({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}
      aria-hidden
    >
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute select-none"
          style={{
            width: p.isPaw || p.isStar ? 'auto' : p.size,
            height: p.isPaw || p.isStar ? 'auto' : p.size,
            borderRadius: '50%',
            left: p.left,
            top: p.top,
            fontSize: p.isPaw ? '1rem' : p.isStar ? '0.75rem' : undefined,
            backgroundColor:
              p.isPaw || p.isStar
                ? undefined
                : `color-mix(in srgb, ${p.color} 20%, transparent)`,
          }}
          animate={{
            y: [0, -(16 + p.size * 1.5), 0],
            x: [0, p.xDrift, 0],
            opacity: [0.15, 0.45, 0.15],
            rotate: p.isPaw ? [0, 20, 0] : undefined,
            scale: p.isStar ? [1, 1.3, 1] : undefined,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        >
          {p.isPaw ? '🐾' : p.isStar ? '✦' : null}
        </motion.span>
      ))}
    </div>
  );
}
