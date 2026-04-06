"use client";

import Image from 'next/image';
import { Heart, Sparkles, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { brandConfig } from '@/config/brand';

interface PetCardProps {
    id: string;
    name: string;
    breed: string;
    age: string;
    image: string;
    healthStatus: string;
    price?: number;
}

export default function PetCard({ id, name, breed, price, image }: PetCardProps) {
    const waLink = `https://wa.me/${brandConfig.whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I am interested in ${name} (${breed}). Is it available?`;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative aspect-[0.8] rounded-[32px] overflow-hidden bg-white/[0.02] border border-white/5 transition-all duration-700 group-hover:border-brand/30">
                <Image
                    src={image}
                    alt={breed}
                    fill
                    className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <button className="absolute top-6 right-6 p-3 glass rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 hover:bg-brand/20">
                    <Heart size={18} className="text-white" />
                </button>

                {/* Primary Action Button (Reveal on Hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto">
                    <a 
                        href={waLink}
                        target="_blank"
                        className="h-14 px-8 bg-white text-black font-black uppercase italic tracking-[0.2em] text-[10px] rounded-2xl flex items-center gap-3 shadow-2xl hover:bg-brand hover:text-white transition-all transform active:scale-95"
                    >
                        Initiate Connection <ArrowUpRight size={14} />
                    </a>
                </div>
            </div>

            {/* Meta Content */}
            <div className="mt-6 px-4">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <p className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mb-1">{breed}</p>
                        <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{name}</h3>
                    </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                    <div className="text-lg font-bold text-white/40 tracking-tighter italic">From ₹{price?.toLocaleString('en-IN') || '25,000'}</div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Available</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
