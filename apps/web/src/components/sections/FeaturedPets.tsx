'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import PetCard from '@/components/cards/PetCard';
import { petsData } from '@/data/pets';

export default function FeaturedPets() {
    const featuredPets = petsData.slice(0, 4);

    return (
        <section className="py-32 bg-[#050505] overflow-hidden relative">
            {/* Elegant Mesh Flow */}
            <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-brand/[0.02] blur-[120px] rounded-full pointer-events-none" />
            
            <div className="container-app relative z-10">
                {/* Minimalist Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10">
                    <div className="max-w-3xl">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <span className="w-12 h-[1px] bg-brand" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">Exclusive Companions</span>
                        </motion.div>
                        
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.9] tracking-[-0.04em] text-white italic uppercase"
                        >
                            THE <span className="text-white/20">CURATED</span> <br />
                            SELECTION.
                        </motion.h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/pets" className="group flex items-center gap-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 group-hover:text-brand transition-colors">See the full directory</span>
                            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand/40 group-hover:bg-brand/5 transition-all">
                                <ArrowRight size={20} className="text-white group-hover:text-brand group-hover:translate-x-1 transition-all" />
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Staggered Precision Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {featuredPets.map((pet, i) => (
                        <motion.div 
                            key={pet.id} 
                            style={{ marginTop: i % 2 === 0 ? '0' : '80px' }}
                            className="relative"
                        >
                            <PetCard {...pet} />
                        </motion.div>
                    ))}
                </div>
                
                {/* Minimalist Trust Bar */}
                <div className="mt-40 pt-20 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-12">
                    {[
                        { label: "KCI GOLD", value: "Verified Genetics" },
                        { label: "VET-ALIGNED", value: "Health Protocol" },
                        { label: "ELITE FLEET", value: "Precision Delivery" },
                        { label: "CARE+ PLUS", value: "Post-Connection" }
                    ].map((item, i) => (
                        <div key={i} className="group">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-3 group-hover:text-brand transition-colors">{item.label}</p>
                            <p className="text-lg font-bold text-white italic uppercase tracking-tighter">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
