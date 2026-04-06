'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { brandConfig } from '@/config/brand';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center pt-24 pb-20 overflow-hidden bg-[#050505]">
      {/* Structural Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-[#050505] to-transparent z-10" />
      
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand/5 blur-[120px] rounded-full pointer-events-none opacity-40" />
      
      <div className="container-app relative z-10 lg:px-12">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.4em] text-brand mb-8"
            >
              <Sparkles size={12} className="animate-pulse" />
              Elite Living Protocol
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-[clamp(4rem,10vw,8.5rem)] font-black leading-[0.85] tracking-[-0.06em] text-white italic uppercase"
            >
              CRAFTING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-brand/80">PURE JOY.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-10 text-xl md:text-2xl text-white/40 max-w-xl leading-relaxed italic font-medium"
            >
              Where elite companionship meets <br /> 
              unrivaled care and digital checkout.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-12 flex flex-col sm:flex-row gap-6"
            >
              <Link
                href="/products"
                className="group relative h-16 px-10 flex items-center justify-center bg-white text-black text-xs font-black uppercase italic tracking-[0.2em] rounded-2xl overflow-hidden transition-all active:scale-95"
              >
                <div className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors">
                  Explore Selection <ArrowRight size={16} />
                </span>
              </Link>

              <a
                href={`https://wa.me/${brandConfig.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="h-16 px-10 flex items-center justify-center border border-white/10 bg-white/[0.02] text-white text-xs font-black uppercase italic tracking-[0.2em] rounded-2xl hover:bg-white/[0.05] transition-all active:scale-95"
              >
                <MessageCircle size={16} className="mr-3" />
                Direct Link
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Single Epic Image */}
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[0.8] rounded-[48px] overflow-hidden border border-white/10 shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1200&auto=format&fit=crop"
                alt="Golden Retriever"
                fill
                priority
                className="object-cover transition-transform duration-[3s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              
              {/* Minimal Overlays */}
              <div className="absolute bottom-10 left-10 p-8 glass rounded-[32px] border-white/10 max-w-[280px]">
                <p className="text-[10px] font-black text-brand uppercase tracking-[0.4em] mb-2">Featured Parent</p>
                <p className="text-xl font-bold text-white italic uppercase tracking-tighter">Golden Retriever</p>
                <div className="mt-4 h-[1px] w-full bg-white/10" />
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/40 uppercase">Certified</span>
                    <span className="text-lg font-bold text-white tracking-tighter italic">KCI-GOLD</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/20 select-none group pointer-events-none"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-white/20 to-transparent relative overflow-hidden">
            <motion.div 
                animate={{ y: [0, 80] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-1/2 bg-white/60"
            />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.5em] -rotate-90 origin-center translate-y-8">Scroll</span>
      </motion.div>
    </section>
  );
}
