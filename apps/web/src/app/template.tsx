'use client';

import { motion } from 'framer-motion';

/**
 * Page transition wrapper — Next.js App Router pattern.
 *
 * template.tsx re-mounts on every navigation, making it the correct
 * location for AnimatePresence-driven page transitions (not Providers).
 *
 * Animation: directional slide + blur
 * • Enter: opacity 0→1, y 12→0, blur 6px→0  (smooth entrance)
 * • Exit:  opacity 1→0, y 0→−10, blur 0→4px (clean departure)
 *
 * Uses outExpo easing [0.16, 1, 0.3, 1] — snappy entrance, soft landing.
 * Exit is faster (0.18s) than entrance (0.32s) — users feel responsive UI.
 */
const variants = {
  initial: {
    opacity: 0,
    y: 12,
    filter: 'blur(6px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(4px)',
    transition: {
      duration: 0.18,
      ease: [0.65, 0, 0.35, 1],
    },
  },
};

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ willChange: 'opacity, transform, filter' }}
      className="flex-1 flex flex-col w-full"
    >
      {children}
    </motion.div>
  );
}
