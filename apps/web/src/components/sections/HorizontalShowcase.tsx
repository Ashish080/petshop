'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

const ITEMS = [
  { id: 1, title: "Puppy Star Kit", price: "1,299", category: "Essentials", image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800&auto=format&fit=crop" },
  { id: 2, title: "Premium Nutrition", price: "4,500", category: "Nutrition", image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop" },
  { id: 3, title: "Orthopedic Bed", price: "8,900", category: "Comfort", image: "https://images.unsplash.com/photo-1541599540903-217a22cc566a?q=80&w=800&auto=format&fit=crop" },
  { id: 4, title: "Smart Pet Tech", price: "12,000", category: "Innovation", image: "https://images.unsplash.com/photo-1518914781460-a3adb461dfec?q=80&w=800&auto=format&fit=crop" },
  { id: 5, title: "Grooming Set", price: "2,300", category: "Care", image: "https://images.unsplash.com/photo-1591338676645-fa669389f464?q=80&w=800&auto=format&fit=crop" },
];

export function HorizontalShowcase() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[250vh] bg-black" />;

  return <HorizontalScrollContent />;
}

function HorizontalScrollContent() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(Math.round(latest * 100));
  });

  // LEFT-TO-RIGHT Motion: Responsive range based on item count and sizes
  const x = useTransform(scrollYProgress, [0, 1], ["-120%", "85%"]);
  const springX = useSpring(x, { stiffness: 45, damping: 20, restDelta: 0.001 });

  // Fade out section reveal
  const sectionOpacity = useTransform(scrollYProgress, [0.96, 1], [1, 0]);
  const sectionScale = useTransform(scrollYProgress, [0.96, 1], [1, 0.98]);

  // Heading Animation
  const headingOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headingBlur = useTransform(scrollYProgress, [0, 0.2], ["blur(0px)", "blur(20px)"]);

  return (
    <section ref={targetRef} className="relative h-[350vh] bg-[#050505] overflow-visible">
      <motion.div 
        style={{ opacity: sectionOpacity, scale: sectionScale }}
        className="sticky top-0 h-screen w-full flex items-center overflow-hidden bg-black"
      >
        
        {/* Backdrop Graphic - Properly Responsive sizing */}
        <motion.div 
            style={{ 
                x: useTransform(scrollYProgress, [0, 1], [-50, 50]),
                opacity: useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.02, 0.04, 0.02, 0])
            }}
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
        >
            <span className="text-[10rem] sm:text-[18rem] md:text-[30rem] lg:text-[45rem] font-black italic uppercase tracking-tighter text-white select-none whitespace-nowrap opacity-10">
                KANHA
            </span>
        </motion.div>

        {/* Scaled Responsive Heading */}
        <motion.div 
            style={{ opacity: headingOpacity, filter: headingBlur }}
            className="absolute left-[8%] z-20 pointer-events-none"
        >
            <div className="inline-flex items-center gap-3 px-4 md:px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-brand-primary text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-4 md:mb-10">
               <Sparkles size={14} className="fill-current" /> Premium Curator
            </div>
            
            <h2 className="text-4xl sm:text-6xl md:text-9xl lg:text-[12rem] xl:text-[14rem] font-black text-white leading-[0.8] tracking-tighter uppercase italic">
                THE <br /> <span className="text-brand-primary">COLLECTION.</span>
            </h2>
        </motion.div>

        {/* Dynamic Card Container */}
        <motion.div 
            style={{ x: springX }} 
            className="flex gap-8 md:gap-32 px-10 md:px-40 items-center z-10 pl-[85vw]"
        >
          {ITEMS.map((item, i) => (
            <ShowcaseItem key={item.id} item={item} index={i} scrollYProgress={scrollYProgress} />
          ))}
        </motion.div>

        {/* Minimal Progress Scrubber */}
        <div className="absolute bottom-6 md:bottom-20 left-6 md:left-24 flex items-center gap-4 md:gap-10 z-30">
            <div className="w-24 md:w-80 h-[1.5px] bg-white/10 relative rounded-full overflow-hidden">
                <motion.div 
                   style={{ scaleX: scrollYProgress }} 
                   className="absolute inset-0 bg-brand-primary origin-left"
                />
            </div>
            <span className="text-[8px] md:text-[11px] font-black text-white/50 uppercase tracking-[0.5em] tabular-nums">
                {progress}% <span className="hidden sm:inline">EXPLORED</span>
            </span>
        </div>
      </motion.div>
    </section>
  );
}

function ShowcaseItem({ item, index, scrollYProgress }: any) {
    const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
    const yOffset = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -20 : 20, index % 2 === 0 ? 20 : -20]);
    const itemScale = useTransform(scrollYProgress, [index * 0.12, index * 0.12 + 0.3], [0.85, 1.05]);
    const opac = useTransform(scrollYProgress, [index * 0.12, index * 0.12 + 0.15], [0, 1]);

    return (
        <motion.div 
            style={{ rotate, y: yOffset, scale: itemScale, opacity: opac }}
            className="flex-shrink-0 w-[260px] sm:w-[400px] md:w-[500px] lg:w-[700px]"
        >
            <div className="relative group bg-zinc-900/40 backdrop-blur-3xl rounded-[30px] md:rounded-[70px] overflow-hidden border border-white/5 transition-all duration-1000 hover:border-brand-primary/40 shadow-2xl">
                {/* Responsive Media Container */}
                <div className="relative h-[350px] sm:h-[450px] md:h-[600px] w-full overflow-hidden bg-black">
                    <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover transition-transform duration-[3s] group-hover:scale-110 ease-out brightness-90 group-hover:brightness-100" 
                        sizes="(max-width: 640px) 260px, (max-width: 768px) 400px, (max-width: 1024px) 500px, 700px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                    
                    {/* Floating Pricing */}
                    <div className="absolute bottom-6 md:bottom-12 right-6 md:right-16 z-10 text-right">
                        <div className="text-[9px] font-black text-white/50 uppercase tracking-[0.4em] mb-1">{item.category}</div>
                        <div className="text-3xl sm:text-4xl md:text-7xl font-black text-white tracking-tighter italic leading-none">
                           ₹{item.price}
                        </div>
                    </div>
                </div>

                {/* Content Overlay with Scaled Type */}
                <div className="p-6 md:p-16 relative z-10 mt-[-20px] md:mt-[-45px]">
                    <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black text-white leading-[0.8] tracking-tighter uppercase mb-6 md:mb-16 group-hover:translate-x-2 transition-transform duration-700 ease-out">
                        {item.title}
                    </h3>
                    
                    <Link href="/contact" className="inline-block transform active:scale-95 transition-transform">
                        <button className="flex items-center gap-3 md:gap-6 group/btn cursor-pointer">
                            <div className="w-10 h-10 md:w-16 md:h-16 rounded-[18px] md:rounded-[30px] bg-brand-primary text-white flex items-center justify-center transition-all duration-500 group-hover/btn:scale-110 group-hover/btn:shadow-[0_0_40px_rgba(255,122,0,0.4)]">
                                <ArrowRight className="w-5 h-5 md:w-8 md:h-8" />
                            </div>
                            <span className="text-white/40 font-black text-[9px] md:text-[12px] uppercase tracking-[0.6em] group-hover/btn:text-white transition-colors duration-500">
                               Inquire Now
                            </span>
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

