/**
 * ═══════════════════════════════════════════════════════════
 * MOTION SYSTEM — Named animation presets for Framer Motion
 * ═══════════════════════════════════════════════════════════
 *
 * All animations MUST use these presets.
 * No inline `transition={{ duration: 0.5, ease: [0.22, 1, ...] }}`.
 *
 * Usage:
 *   import { motionPresets } from '@/lib/motion';
 *   <motion.div {...motionPresets.fadeUp}> ... </motion.div>
 */

import type { Transition, Variants } from 'framer-motion';

/* ── Easing Curves ── */
export const easing = {
  /** Snappy entrance, soft landing — default for all UI */
  outExpo: [0.16, 1, 0.3, 1] as const,
  /** Smooth bi-directional — layout shifts, resizing */
  inOut: [0.65, 0, 0.35, 1] as const,
  /** Slight overshoot — toasts, badges, toggles */
  spring: [0.34, 1.56, 0.64, 1] as const,
  /** Deceleration — elements entering view */
  outQuart: [0.25, 1, 0.5, 1] as const,
} as const;

/* ── Duration Tokens ── */
export const duration = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  deliberate: 0.6,
} as const;

/* ── Spring Configs ── */
export const springs = {
  /** Default UI spring — snappy */
  snappy: { type: 'spring' as const, stiffness: 300, damping: 30 },
  /** Gentle spring — modals, panels */
  gentle: { type: 'spring' as const, stiffness: 200, damping: 24 },
  /** Bouncy spring — toasts, notifications */
  bouncy: { type: 'spring' as const, stiffness: 500, damping: 25, mass: 0.8 },
  /** Smooth spring — page transitions */
  smooth: { type: 'spring' as const, stiffness: 150, damping: 20 },
} as const;

/* ══════════════════════════════════════════════════════════
   ANIMATION PRESETS — spread directly into <motion.div>
   ══════════════════════════════════════════════════════════ */

export const motionPresets = {
  /** Fade from below — default entrance */
  fadeUp: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: duration.normal, ease: easing.outExpo },
  },

  /** Fade from above */
  fadeDown: {
    initial: { opacity: 0, y: -12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: duration.normal, ease: easing.outExpo },
  },

  /** Simple opacity fade */
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: duration.fast },
  },

  /** Scale from center — modals, popovers, dropdowns */
  scaleIn: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
    transition: { duration: duration.normal, ease: easing.outExpo },
  },

  /** Slide from right — panels, drawers, sidebars */
  slideRight: {
    initial: { opacity: 0, x: '100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '100%' },
    transition: { duration: duration.slow, ease: easing.outExpo },
  },

  /** Slide from left */
  slideLeft: {
    initial: { opacity: 0, x: '-100%' },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-100%' },
    transition: { duration: duration.slow, ease: easing.outExpo },
  },

  /** Slide from bottom — mobile sheets, bottom drawers */
  slideUp: {
    initial: { opacity: 0, y: '100%' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '100%' },
    transition: { duration: duration.slow, ease: easing.outExpo },
  },
} as const;

/* ══════════════════════════════════════════════════════════
   INTERACTION PRESETS — for whileHover / whileTap
   ══════════════════════════════════════════════════════════ */

export const interactions = {
  /** Card hover lift — translateY(-4px) */
  hoverLift: {
    whileHover: { y: -4, transition: { duration: duration.fast, ease: easing.outExpo } },
  },

  /** Subtle hover lift — translateY(-2px) */
  hoverLiftSubtle: {
    whileHover: { y: -2, transition: { duration: duration.fast, ease: easing.outExpo } },
  },

  /** Button press — scale(0.97) */
  tapPress: {
    whileTap: { scale: 0.97 },
  },

  /** Gentle press — scale(0.99) */
  tapPressSubtle: {
    whileTap: { scale: 0.99 },
  },

  /** Scale up on hover — icons, small UI */
  hoverScale: {
    whileHover: { scale: 1.05, transition: { duration: duration.fast } },
    whileTap: { scale: 0.95 },
  },

  /** Card interactive — lift + shadow implied via CSS */
  cardInteractive: {
    whileHover: { y: -6, transition: { duration: duration.normal, ease: easing.outExpo } },
    whileTap: { y: -2 },
  },
} as const;

/* ══════════════════════════════════════════════════════════
   STAGGER PRESETS — for lists / grids via Variants
   ══════════════════════════════════════════════════════════ */

export const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easing.outExpo },
  },
};

/** Faster stagger for smaller lists (notifications, menu items) */
export const staggerFastVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export const staggerFastItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.normal, ease: easing.outExpo },
  },
};

/* ══════════════════════════════════════════════════════════
   PAGE TRANSITION — for AnimatePresence route wrappers
   ══════════════════════════════════════════════════════════ */

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

export const pageTransitionConfig: Transition = {
  duration: duration.normal,
  ease: easing.outExpo,
};

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL — for IntersectionObserver-triggered anims
   ══════════════════════════════════════════════════════════ */

export const scrollRevealVariants: Variants = {
  offscreen: {
    opacity: 0,
    y: 40,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.deliberate,
      ease: easing.outExpo,
    },
  },
};
