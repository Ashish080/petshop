'use client';

import { motion } from 'framer-motion';
import { pageTransition, pageTransitionConfig } from '@/lib/motion';

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      transition={pageTransitionConfig}
      className="flex-1 flex flex-col w-full h-full"
    >
      {children}
    </motion.div>
  );
}
