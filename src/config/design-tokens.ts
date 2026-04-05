/** Golden ratio & Fibonacci layout system — use for spacing, grids, and type rhythm. */
export const PHI = 1.618;

export const fibonacci = [8, 13, 21, 34, 55, 89, 144] as const;

export type FibonacciSpace = (typeof fibonacci)[number];

export const space = {
  f8: 8,
  f13: 13,
  f21: 21,
  f34: 34,
  f55: 55,
  f89: 89,
} as const;

/** Typographic scale ratio (approximates golden for headlines) */
export const typeScale = {
  h1: 'clamp(2.5rem, 4vw + 1rem, 4.5rem)',
  h2: 'clamp(1.875rem, 2.5vw + 0.75rem, 3rem)',
  h3: 'clamp(1.375rem, 1.2vw + 1rem, 1.75rem)',
  body: '1.0625rem',
  caption: '0.8125rem',
} as const;

export const motionEasing = [0.22, 1, 0.36, 1] as const;
