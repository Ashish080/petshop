'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "The care protocol for our Golden Retriever was beyond anything we expected. Elite service.",
    author: "Arjun Verma",
    role: "Premium Parent",
    rating: 5
  },
  {
    quote: "Connecting with our Persian kitten was seamless. The digital checkout is frictionless.",
    author: "Priya Sharma",
    role: "Elite Member",
    rating: 5
  },
  {
    quote: "KCI records were verified in minutes. Safe, transparent, and truly high-end.",
    author: "Rohan Das",
    role: "Strategic Partner",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-[#050505]">
      <div className="container-app">
        
        <div className="flex items-center gap-4 mb-24">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">Voices</span>
            <div className="h-[1px] flex-1 bg-white/5" />
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
            {TESTIMONIALS.map((t, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                >
                    <div className="mb-8 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className="text-brand fill-brand" />
                        ))}
                    </div>
                    
                    <p className="text-2xl font-bold text-white italic leading-tight tracking-tight mb-10">
                        "{t.quote}"
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <span className="text-[10px] font-black text-brand uppercase">{t.author[0]}</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white uppercase tracking-widest">{t.author}</p>
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">{t.role}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>

      </div>
    </section>
  );
}
