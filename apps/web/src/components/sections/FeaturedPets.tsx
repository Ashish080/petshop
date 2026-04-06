'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Star, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import PetCard from '@/components/cards/PetCard';
import { petsData } from '@/data/pets';
import { themeConfig } from '@/config/theme';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 60, opacity: 0, scale: 0.9 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
    }
  }
} as const;

export default function FeaturedPets() {
    const featuredPets = petsData.filter(pet => pet.isFeatured).slice(0, 4);

    return (
        <section className="py-32 md:py-48 bg-white overflow-hidden relative">
            {/* Artistic Mesh Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/[0.03] rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-400/[0.03] rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
            </div>

            <div className={themeConfig.spacing.container + " relative z-10"}>
                {/* Section Header: Luxury Layout */}
                <div className="grid lg:grid-cols-12 gap-12 items-end mb-24 md:mb-32">
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-8"
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white font-black text-[10px] uppercase tracking-[0.4em] mb-10 shadow-2xl">
                           <Zap size={14} fill="currentColor" /> Premium Selection 2024
                        </div>
                        
                        <h2 className="text-7xl md:text-[8rem] font-black text-zinc-900 tracking-tighter leading-[0.75] mb-12 uppercase italic">
                            MEET OUR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-orange-500 to-amber-500">FAVOURITE</span> <br />
                            FRIENDS.
                        </h2>
                        
                        <p className="text-2xl text-zinc-400 font-bold max-w-xl leading-relaxed border-l-8 border-brand-primary pl-10 uppercase tracking-tight">
                            Discover the most <span className="text-zinc-900">Elite & Joyful</span> companions <br /> hand-picked for your modern lifestyle.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="lg:col-span-4 flex lg:justify-end"
                    >
                        <Link href="/pets">
                            <button className="group relative w-56 h-56 rounded-full bg-zinc-900 p-1 overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]">
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10 w-full h-full rounded-full border border-white/10 flex flex-col items-center justify-center text-white gap-4">
                                     <ArrowRight size={40} className="group-hover:translate-x-3 transition-transform duration-500" />
                                     <span className="text-[10px] font-black uppercase tracking-[0.3em]">Full <br /> Directory</span>
                                </div>
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* Staggered Grid Reveal */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
                >
                    {featuredPets.map((pet, i) => (
                        <motion.div 
                            key={pet.id} 
                            variants={itemVariants}
                            className={i % 2 === 0 ? "lg:-mt-12" : "lg:mt-12"}
                        >
                            <PetCard {...pet} />
                        </motion.div>
                    ))}
                </motion.div>
                
                {/* Luxury Stat Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8 p-12 rounded-[50px] bg-zinc-50 border border-zinc-100 shadow-sm relative"
                >
                   {[
                       { label: "KCI Certified Breeds", value: "Premium Standards", icon: ShieldCheck, color: "text-blue-500" },
                       { label: "Lucknow Success Rate", value: "99.8% Happy Homes", icon: Star, color: "text-amber-500" },
                       { label: "Global Health Rating", value: "Vet-Approved A+", icon: ShieldCheck, color: "text-emerald-500" },
                   ].map((stat, i) => (
                       <div key={i} className="flex items-start gap-6 group">
                           <div className={`w-16 h-16 rounded-[28px] bg-white flex items-center justify-center ${stat.color} shadow-xl shadow-zinc-200/50 group-hover:rotate-12 transition-transform`}>
                               <stat.icon size={32} />
                           </div>
                           <div>
                               <div className="text-lg font-black text-zinc-900 tracking-tight leading-tight mb-1">{stat.value}</div>
                               <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</div>
                           </div>
                           {i < 2 && <div className="hidden md:block absolute h-16 w-px bg-zinc-200 right-[33%] top-1/2 -translate-y-1/2" style={{ right: `${(2-i)*33.3}%` }} />}
                       </div>
                   ))}
                </motion.div>
            </div>
        </section>
    );
}
