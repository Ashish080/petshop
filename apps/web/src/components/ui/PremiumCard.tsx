'use client';

import { useRef, ReactNode, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function PremiumCard({ children, className = "", glowColor = "rgba(255, 122, 0, 0.15)" }: PremiumCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "relative rounded-3xl p-8 border border-white bg-white/40 backdrop-blur-xl shadow-lg transition-shadow duration-500",
        isHovered ? "shadow-2xl" : "shadow-lg",
        className
      )}
    >
      {/* Dynamic Glow */}
      <motion.div 
        animate={{ 
          opacity: isHovered ? 1 : 0,
        }}
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
        }}
        className="absolute inset-0 z-0 pointer-events-none rounded-3xl"
      />
      
      <div style={{ transform: "translateZ(30px)" }} className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}
