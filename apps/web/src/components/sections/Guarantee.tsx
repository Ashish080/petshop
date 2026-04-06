'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Award, HeartHandshake } from 'lucide-react';

export default function Guarantee() {
  return (
    <section className="py-40 bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-0 bg-brand/[0.01] pointer-events-none" />
      
      <div className="container-app text-center relative z-10">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
        >
            <div className="w-20 h-20 bg-brand/10 border border-brand/20 rounded-full flex items-center justify-center mx-auto mb-10">
                <Award size={32} className="text-brand" />
            </div>

            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black leading-[0.85] tracking-[-0.04em] text-white italic uppercase mb-10">
                THE SEAL OF <br />
                <span className="text-brand">EXCELLENCE.</span>
            </h2>

            <p className="text-xl md:text-2xl text-white/40 italic font-medium leading-relaxed max-w-2xl mx-auto mb-16">
                Every connection is backed by a lifetime of commitment. <br />
                Your joy is our only metric of success.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-12 pt-16 border-t border-white/5">
                {[
                    { icon: ShieldCheck, label: "Identity Verified" },
                    { icon: HeartHandshake, label: "Ethics First" },
                    { icon: Award, label: "Certified Lineage" }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 opacity-30 hover:opacity-100 transition-opacity">
                        <item.icon size={18} className="text-brand" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">{item.label}</span>
                    </div>
                ))}
            </div>
        </motion.div>
      </div>
    </section>
  );
}
