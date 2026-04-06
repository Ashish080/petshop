'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import PetCard from '@/components/cards/PetCard';
import { petsData } from '@/data/pets';
import { staggerVariants, staggerItemVariants, scrollRevealVariants } from '@/lib/motion';

export default function FeaturedPets() {
    const featuredPets = petsData.filter(pet => pet.isFeatured).slice(0, 4);

    return (
        <section className="section-padding bg-bg-primary overflow-hidden relative">
            {/* Mesh Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand/[0.03] rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-info/[0.03] rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
            </div>

            <div className="container-app relative z-10">
                {/* Section Header */}
                <div className="grid lg:grid-cols-12 gap-12 items-end mb-16 md:mb-24">
                    <motion.div 
                        variants={scrollRevealVariants}
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true }}
                        className="lg:col-span-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[--radius-full] bg-text-primary text-text-inverse text-label-sm uppercase tracking-wider mb-8 shadow-lg">
                           <Zap size={14} fill="currentColor" /> Premium Selection
                        </div>
                        
                        <h2 className="text-display md:text-[5rem] text-text-primary tracking-tighter leading-[0.85] uppercase mb-8">
                            MEET OUR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-orange-400 to-amber-500">FAVOURITE</span> <br />
                            FRIENDS.
                        </h2>
                        
                        <p className="text-h4 text-text-tertiary max-w-xl leading-relaxed border-l-4 border-brand pl-6 font-normal">
                            Discover the most <span className="text-text-primary font-semibold">Elite & Joyful</span> companions hand-picked for your modern lifestyle.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={scrollRevealVariants}
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true }}
                        className="lg:col-span-4 flex lg:justify-end"
                    >
                        <Link href="/pets">
                            <button className="group relative w-44 h-44 md:w-52 md:h-52 rounded-full bg-text-primary p-1 overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-lg">
                                <div className="absolute inset-0 bg-gradient-to-tr from-brand to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-[--duration-slow]" />
                                <div className="relative z-10 w-full h-full rounded-full border border-white/10 flex flex-col items-center justify-center text-text-inverse gap-3">
                                     <ArrowRight size={36} className="group-hover:translate-x-2 transition-transform duration-[--duration-slow]" />
                                     <span className="text-label-sm uppercase tracking-wider text-center">Full <br /> Directory</span>
                                </div>
                            </button>
                        </Link>
                    </motion.div>
                </div>

                {/* Pet Grid */}
                <motion.div 
                    variants={staggerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
                >
                    {featuredPets.map((pet, i) => (
                        <motion.div 
                            key={pet.id} 
                            variants={staggerItemVariants}
                            className={i % 2 === 0 ? "lg:-mt-8" : "lg:mt-8"}
                        >
                            <PetCard {...pet} />
                        </motion.div>
                    ))}
                </motion.div>
                
                {/* Stats Bar */}
                <motion.div 
                    variants={scrollRevealVariants}
                    initial="offscreen"
                    whileInView="onscreen"
                    viewport={{ once: true }}
                    className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 p-8 md:p-10 rounded-[--radius-xl] bg-bg-secondary border border-border relative"
                >
                   {[
                       { label: "KCI Certified Breeds", value: "Premium Standards", icon: ShieldCheck, color: "text-info" },
                       { label: "Lucknow Success Rate", value: "99.8% Happy Homes", icon: Star, color: "text-warning" },
                       { label: "Global Health Rating", value: "Vet-Approved A+", icon: ShieldCheck, color: "text-success" },
                   ].map((stat, i) => (
                       <div key={i} className="flex items-start gap-4 group">
                           <div className={`w-14 h-14 rounded-[--radius-lg] bg-bg-elevated flex items-center justify-center ${stat.color} shadow-sm group-hover:rotate-6 transition-transform duration-[--duration-slow]`}>
                               <stat.icon size={28} />
                           </div>
                           <div>
                               <div className="text-h5 text-text-primary mb-0.5">{stat.value}</div>
                               <div className="text-overline">{stat.label}</div>
                           </div>
                       </div>
                   ))}
                </motion.div>
            </div>
        </section>
    );
}
