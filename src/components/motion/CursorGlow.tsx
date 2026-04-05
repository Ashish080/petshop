'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CursorGlow() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const glowRef = useRef<HTMLDivElement>(null);

  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const slowSpringConfig = { damping: 35, stiffness: 300, mass: 1 };
  const glowX = useSpring(cursorX, slowSpringConfig);
  const glowY = useSpring(cursorY, slowSpringConfig);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsPointer(isClickable);
      setIsHovering(isClickable);
    };

    const leave = () => {
      cursorX.set(-100);
      cursorY.set(-100);
    };

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseleave', leave, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseleave', leave);
    };
  }, [cursorX, cursorY]);

  // Only show on non-touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null;
  }

  return (
    <>
      {/* Outer glow blob */}
      <motion.div
        ref={glowRef}
        className="fixed pointer-events-none z-[9998] rounded-full mix-blend-screen"
        style={{
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
          width: isHovering ? 120 : 80,
          height: isHovering ? 120 : 80,
          background: isHovering
            ? 'radial-gradient(circle, rgba(255,122,0,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,122,0,0.10) 0%, transparent 70%)',
          transition: 'width 0.3s ease, height 0.3s ease, background 0.3s ease',
        }}
      />

      {/* Core dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full border-2 border-[var(--primary)]"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          width: isPointer ? 36 : 10,
          height: isPointer ? 36 : 10,
          backgroundColor: isPointer ? 'transparent' : 'var(--primary)',
          opacity: isPointer ? 0.7 : 0.9,
          transition: 'width 0.2s cubic-bezier(0.22,1,0.36,1), height 0.2s cubic-bezier(0.22,1,0.36,1)',
        }}
      />
    </>
  );
}
