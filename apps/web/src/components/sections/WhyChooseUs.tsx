'use client';

import { motion } from 'framer-motion';
import { Shield, Sparkles, Truck, Clock } from 'lucide-react';

const REASONS = [
  {
    icon: Shield,
    title: "Verified LINEAGE",
    description: "Every companion comes with certified health records and proven pedigree."
  },
  {
    icon: Truck,
    title: "ELITE LOGISTICS",
    description: "Climate-controlled delivery fleet ensures stress-free arrival at your doorstep."
  },
  {
    icon: Sparkles,
    title: "PREMIUM CARE",
    description: "Lifecycle support from birth to adulthood with expert veterinary guidance."
  },
  {
    icon: Clock,
    title: "ACTIVE SUPPORT",
    description: "Connect with our care specialists 24/7 for immediate behavioral advice."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-32 bg-[#050505]">
      <div className="container-app">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
            
            <div className="lg:w-1/3">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-6"
                >
                    <span className="w-12 h-[1px] bg-brand" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">Philosophy</span>
                </motion.div>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-none mb-8">
                    WHY <br />
                    <span className="text-white/20">KANHA</span>
                </h2>
                <p className="text-white/40 italic font-medium leading-relaxed">
                    We don't just sell pets. We curate lifelong bonds built on trust, transparency, and elite care protocols.
                </p>
            </div>

            <div className="lg:w-2/3 grid sm:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-[40px] overflow-hidden">
                {REASONS.map((reason, i) => (
                    <div key={i} className="bg-[#050505] p-12 group hover:bg-white/[0.02] transition-all">
                        <div className="mb-8 text-brand/40 group-hover:text-brand transition-colors transform group-hover:scale-110 duration-500">
                            <reason.icon size={32} strokeWidth={1} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 mb-4">{reason.title}</h4>
                        <p className="text-sm text-white/40 leading-relaxed font-medium italic">
                            {reason.description}
                        </p>
                    </div>
                ))}
            </div>

        </div>
      </div>
    </section>
  );
}
