'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const MOCK_PETS = [
  {
    id: 1,
    name: 'Luna',
    breed: 'Persian Cat',
    image: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&q=80&w=800',
    color: '#ffc107',
  },
  {
    id: 2,
    name: 'Max',
    breed: 'Golden Retriever',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800',
    color: '#ff7a00',
  },
  {
    id: 3,
    name: 'Bella',
    breed: 'French Bulldog',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800',
    color: '#5eb8a8',
  },
  {
    id: 4,
    name: 'Oliver',
    breed: 'British Shorthair',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800',
    color: '#8ec5ff',
  },
  {
    id: 5,
    name: 'Charlie',
    breed: 'Cavalier King',
    image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&q=80&w=800',
    color: '#e83e8c',
  },
];

export function PerspectiveCarousel() {
  const [index, setIndex] = useState(2);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % MOCK_PETS.length);
  };

  const prev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + MOCK_PETS.length) % MOCK_PETS.length);
  };

  const getPosition = (i: number) => {
    const diff = (i - index + MOCK_PETS.length) % MOCK_PETS.length;
    if (diff === 0) return 0; // Center
    if (diff === 1 || diff === - (MOCK_PETS.length - 1)) return 1; // Right 1
    if (diff === 2 || diff === - (MOCK_PETS.length - 2)) return 2; // Right 2 (hidden)
    return -1; // Left 1
  };

  return (
    <div className="relative w-full py-20 overflow-hidden bg-[var(--bg-page)] perspective-[1200px]">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-light)] tracking-tight">
          Meet Our Stars
        </h2>
        <p className="text-[var(--text-light)] mt-4 font-medium tracking-wide">
          Swipe through our most loved companions in 3D
        </p>
      </div>

      <div className="relative h-[400px] w-full max-w-5xl mx-auto flex items-center justify-center transform-style-[preserve-3d]">
        <AnimatePresence initial={false} mode="popLayout">
          {MOCK_PETS.map((pet, i) => {
            const pos = getPosition(i);
            const isCenter = pos === 0;
            const isLeft = pos === -1;
            const isRight = pos === 1;

            if (Math.abs(pos) > 1 && !isCenter) return null; // Only show 3 items
            
            return (
              <motion.div
                key={pet.id}
                className="absolute w-[280px] md:w-[350px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl cursor-pointer ring-1 ring-[var(--card-border)] bg-[var(--card-bg)] flex flex-col will-change-transform"
                style={{ zIndex: isCenter ? 10 : 5 }}
                initial={{ 
                  opacity: 0, 
                  scale: 0.8, 
                  x: direction > 0 ? 300 : -300, 
                  rotateY: direction > 0 ? -45 : 45 
                }}
                animate={{
                  opacity: 1,
                  scale: isCenter ? 1 : 0.85,
                  x: isCenter ? 0 : isLeft ? -220 : 220,
                  z: isCenter ? 100 : -100,
                  rotateY: isCenter ? 0 : isLeft ? 25 : -25,
                  rotateZ: isCenter ? 0 : isLeft ? -2 : 2,
                  boxShadow: isCenter 
                    ? `0 30px 60px -12px color-mix(in srgb, ${pet.color} 40%, transparent)` 
                    : '0 20px 40px -10px rgba(0,0,0,0.1)',
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8, 
                  x: direction > 0 ? -300 : 300, 
                  rotateY: direction > 0 ? 45 : -45 
                }}
                transition={{
                  type: 'spring',
                  stiffness: 250,
                  damping: 25,
                  mass: 0.9,
                }}
                onClick={() => {
                  if (isLeft) prev();
                  if (isRight) next();
                }}
              >
                <div className="relative w-full h-[70%]">
                  <Image
                    src={pet.image}
                    alt={pet.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--card-bg)] to-transparent via-transparent" />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-end bg-[var(--card-bg)]">
                  <motion.h3 
                    className="text-2xl font-black text-[var(--text-primary)]"
                    animate={{ color: isCenter ? pet.color : 'var(--text-primary)' }}
                  >
                    {pet.name}
                  </motion.h3>
                  <p className="text-[var(--text-light)] font-medium text-sm mt-1">{pet.breed}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-6 mt-12">
        <button
          onClick={prev}
          className="w-14 h-14 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--primary)] hover:text-white transition-all hover:scale-110 active:scale-95 z-20"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={next}
          className="w-14 h-14 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)] flex items-center justify-center text-[var(--text-primary)] hover:bg-[var(--primary)] hover:text-white transition-all hover:scale-110 active:scale-95 z-20"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
