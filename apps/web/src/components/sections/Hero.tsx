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
            className="absolute w-2 h-2 bg-brand rounded-full blur-[1px] opacity-20"
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-muted border border-brand/10 text-brand text-label-sm uppercase tracking-wider mb-8 shadow-sm"
            >
              <Sparkles size={14} className="animate-pulse" />
              {brandConfig.tagline}
            </motion.div>
            
            <h1 className="text-display md:text-[5rem] text-text-primary tracking-tighter leading-[0.9] mb-8">
              PREMIUM <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-warning to-amber-500">
                WELLNESS
              </span> <br />
              FOR PETS
            </h1>
            
            <p className="text-body-lg text-text-secondary font-medium max-w-lg mb-12 leading-relaxed">
              Experience the next generation of pet care. Lucknow's most advanced inventory and wellness system for professional breeders and loving owners.
            </p>
            
            <div className="flex flex-wrap gap-6 items-center">
              <Link href="/products">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 bg-text-primary text-text-inverse font-bold text-lg rounded-[--radius-xl] shadow-lg flex items-center gap-3 group"
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
                 <div className="flex items-center gap-4 text-text-primary font-bold">
                    <div className="w-14 h-14 rounded-[--radius-lg] bg-bg-elevated border border-border flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-transform">
                       <Phone size={24} className="text-brand" />
                    </div>
                    <div>
                       <span className="text-overline block">Connect Support</span>
                       <span className="block text-lg font-bold">{brandConfig.phone}</span>
                    </div>
                 </div>
              </a>
            </div>

            <div className="mt-16 flex flex-wrap gap-10 items-center opacity-70">
                <TrustItem icon={<CheckCircle2 className="text-success" />} text="Verified Breed Certificates" />
                <TrustItem icon={<ShieldCheck className="text-info" />} text="Health Guarantees" />
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
                <div className="relative aspect-square w-full rounded-[--radius-xl] overflow-hidden">
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
                    className="absolute bottom-10 right-10 bg-black/40 backdrop-blur-3xl border border-white/20 p-8 rounded-[--radius-xl] shadow-lg"
                   >
                      <div className="text-white">
                         <div className="text-label-sm uppercase tracking-wider opacity-90 mb-2">Premium Breed</div>
                         <div className="text-h2 font-bold mb-1">Retriever</div>
                         <div className="text-h3 text-stat text-brand">₹24,999</div>
                      </div>
                   </motion.div>
                </div>
             </PremiumCard>

             {/* Floating Mini Experience Bubbles */}
             <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 bg-bg-elevated p-6 rounded-[--radius-xl] shadow-md border border-border z-20 hidden md:block"
             >
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-success-muted flex items-center justify-center text-success">
                      <HeartPulse size={20} />
                   </div>
                   <div>
                      <div className="text-overline">Health Score</div>
                      <div className="text-h4 text-stat text-text-primary">98% A+</div>
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
            <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                {icon}
            </div>
            <span className="text-body-sm text-text-primary font-semibold tracking-tight">{text}</span>
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
