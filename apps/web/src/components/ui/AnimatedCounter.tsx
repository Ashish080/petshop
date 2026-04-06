'use client';
import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useTransform, animate, motion } from 'framer-motion';

export function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return prefix + Math.round(latest).toLocaleString('en-IN') + suffix;
  });

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
}
