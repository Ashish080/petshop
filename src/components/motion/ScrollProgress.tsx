'use client';

import { useScroll, useSpring, motion } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[9997] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #ff7a00, #ff9a3c, #5eb8a8)',
      }}
    />
  );
}
