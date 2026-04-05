'use client';

import { useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

interface ScrollStoryProps {
  children: ReactNode;
  parallaxOffset?: number;
  direction?: 'up' | 'down';
  className?: string;
}

export function ScrollStorySection({ children, parallaxOffset = 50, direction = 'up', className = "" }: ScrollStoryProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [direction === 'up' ? parallaxOffset : -parallaxOffset, direction === 'up' ? -parallaxOffset : parallaxOffset]),
    springConfig
  );

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  return (
    <motion.section
      ref={ref}
      style={{ y, opacity, scale }}
      className={`relative min-h-screen py-20 flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      {children}
    </motion.section>
  );
}
