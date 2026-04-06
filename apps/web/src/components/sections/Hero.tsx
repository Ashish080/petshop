'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { brandConfig } from '@/config/brand';
import { Phone, Award, CheckCircle2, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const rotate = useTransform(scrollY, [0, 500], [0, 45]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [particles, setParticles] = useState<{ id: number, x: number, y: number, duration: number }[]>([]);

  useEffect(() => {
    setParticles([...Array(15)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 5 + Math.random() * 5
    })));
  }, []);

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[110vh] flex items-center pt-24 pb-32 overflow-hidden bg-bg-page"
    >
      {/* Interactive Spotlight Background */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
        animate={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 122, 0, 0.1), transparent 80%)`
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 bg-brand-primary rounded-full blur-[1px] opacity-20"
            animate={{ 
              x: [0, Math.random() * 50 - 25],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: p.duration, repeat: Infinity }}
            style={{
              y: p.id % 2 === 0 ? y1 : y2,
              left: `${p.x}%`,
              top: `${p.y}%`,
            } as any}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-50 border border-brand-primary/10 text-brand-primary font-black text-xs uppercase tracking-[0.2em] mb-8 shadow-sm"
            >
              <Sparkles size={14} className="animate-pulse" />
              {brandConfig.tagline}
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black text-text-primary tracking-tighter leading-[0.9] mb-8">
              PREMIUM <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-orange-400 to-amber-500">
                WELLNESS
              </span> <br />
              FOR PETS
            </h1>
            
            <p className="text-xl text-text-muted font-medium max-w-lg mb-12 leading-relaxed">
              Experience the next generation of pet care. Lucknow's most advanced inventory and wellness system for professional breeders and loving owners.
            </p>
            
            <div className="flex flex-wrap gap-6 items-center">
              <Link href="/products">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 bg-zinc-900 text-white font-black text-lg rounded-2xl shadow-2xl shadow-zinc-900/20 flex items-center gap-3 group"
                >
                  Start Exploring
                  <motion.div 
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowIcon />
                  </motion.div>
                </motion.button>
              </Link>
              
              <a href={`tel:${brandConfig.phone}`} className="group">
                 <div className="flex items-center gap-4 text-text-primary font-black">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-transform">
                       <Phone size={24} className="text-brand-primary" />
                    </div>
                    <div>
                       <span className="block text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Connect Support</span>
                       <span className="block text-lg font-black">{brandConfig.phone}</span>
                    </div>
                 </div>
              </a>
            </div>

            <div className="mt-16 flex flex-wrap gap-10 items-center opacity-70">
                <TrustItem icon={<CheckCircle2 className="text-green-500" />} text="Verified Breed Certificates" />
                <TrustItem icon={<ShieldCheck className="text-blue-500" />} text="Health Guarantees" />
            </div>
          </motion.div>

          {/* 3D Interaction Hero Card */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
             animate={{ opacity: 1, scale: 1, rotate: 0 }}
             transition={{ duration: 1, delay: 0.4, type: "spring" }}
             className="relative"
          >
             <PremiumCard className="p-4" glowColor="rgba(255, 122, 0, 0.4)">
                <div className="relative aspect-square w-full rounded-[40px] overflow-hidden">
                   <Image 
                     src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&auto=format&fit=crop" 
                     alt="Golden Retriever" 
                     fill 
                     className="object-cover"
                     priority
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                   />
                   <motion.div 
                    style={{ rotate }}
                    className="absolute bottom-10 right-10 bg-black/40 backdrop-blur-3xl border border-white/20 p-8 rounded-[40px] shadow-2xl"
                   >
                      <div className="text-white">
                         <div className="text-[10px] font-black uppercase tracking-widest opacity-90 mb-2 font-outfit">Premium Breed</div>
                         <div className="text-3xl font-black mb-1">Retriever</div>
                         <div className="text-2xl font-black text-brand-primary">₹24,999</div>
                      </div>
                   </motion.div>
                </div>
             </PremiumCard>

             {/* Floating Mini Experience Bubbles */}
             <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl border border-zinc-100 z-20 hidden md:block"
             >
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <HeartPulse size={20} />
                   </div>
                   <div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Health Score</div>
                      <div className="text-lg font-black text-zinc-900">98% A+</div>
                   </div>
                </div>
             </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function TrustItem({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center gap-3 group pointer-events-none">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-zinc-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                {icon}
            </div>
            <span className="text-sm font-black text-text-primary tracking-tight">{text}</span>
        </div>
    );
}

function ArrowIcon() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}
