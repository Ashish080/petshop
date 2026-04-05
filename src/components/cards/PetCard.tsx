"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Award, Heart, MessageCircle, Star, Sparkles } from 'lucide-react';
import { brandConfig } from '@/config/brand';
import { motion } from 'framer-motion';

interface PetCardProps {
    id: string;
    name: string;
    breed: string;
    age: string;
    image: string;
    healthStatus: string;
    price?: number;
}

export default function PetCard({ id, name, breed, age, image, healthStatus, price }: PetCardProps) {
    const waLink = `https://wa.me/${brandConfig.whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I am interested in ${name} (${breed}). Is it available?`;

    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className="bg-white dark:bg-card-bg border border-zinc-100 rounded-[40px] overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-all duration-500 group relative"
        >
            <div className="relative h-72 w-full overflow-hidden bg-zinc-50">
                <Image
                    src={image}
                    alt={`Photo of ${breed}`}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Status Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <div className="bg-white/90 backdrop-blur-md text-zinc-900 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl border border-white/20 flex items-center gap-2">
                        <Sparkles size={12} className="text-brand-primary" /> Premium
                    </div>
                </div>

                <button className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl text-zinc-400 hover:text-red-500 hover:scale-110 transition-all border border-white/20">
                    <Heart size={20} />
                </button>
            </div>

            <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-3xl font-black text-zinc-900 tracking-tighter leading-none mb-2">{name}</h3>
                        <p className="text-xs font-black text-brand-primary uppercase tracking-widest">{breed}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-zinc-50 px-3 py-1.5 rounded-2xl border border-zinc-100">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="text-sm font-black text-zinc-900">4.9</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                    {['Health OK', 'KCI Cert', 'Vaccinated'].map((tag) => (
                        <span key={tag} className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                    <div>
                        <div className="text-2xl font-black text-zinc-900 tracking-tight">₹{price?.toLocaleString('en-IN') || '25,000'}</div>
                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Live In Lucknow</div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Link href="/contact" className="p-4 bg-zinc-100 rounded-3xl text-zinc-900 hover:bg-zinc-200 transition-all">
                             <MessageCircle size={24} />
                        </Link>
                        <Link 
                            href={waLink}
                            target="_blank"
                            className="bg-zinc-900 text-white p-4 rounded-3xl hover:bg-brand-primary transition-all shadow-xl shadow-zinc-900/10 hover:scale-110 active:scale-95 group"
                        >
                            <span className="sr-only">Inquire via WhatsApp</span>
                            <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

