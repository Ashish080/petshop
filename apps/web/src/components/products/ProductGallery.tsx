'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductGallery({ images, name }: { images: string[], name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 w-full">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto w-full lg:w-20 shrink-0 scrollbar-hide py-1 lg:py-0">
        {images.slice(0, 4).map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative w-16 h-16 lg:w-full lg:h-20 shrink-0 rounded-[--radius-lg] overflow-hidden border-2 transition-all ${
              activeIndex === i 
                ? 'border-brand scale-[1.02] shadow-md' 
                : 'border-transparent hover:border-border cursor-pointer opacity-70 hover:opacity-100'
            }`}
          >
            <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>

      {/* Main Hero Gallery Image */}
      <div className="relative w-full aspect-square bg-bg-elevated rounded-[--radius-2xl] overflow-hidden border border-border group cursor-zoom-in">
        <AnimatePresence mode="popLayout">
          {images[activeIndex] ? (
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full relative"
            >
              <Image 
                src={images[activeIndex]} 
                alt={name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-[8s] ease-out" 
                priority 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🐾</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
