'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Quote, ShieldCheck, MapPin } from 'lucide-react';
import { testimonialsData } from '@/data/testimonials';
import { themeConfig } from '@/config/theme';

export default function Testimonials() {
    return (
        <section className="py-24 md:py-40 bg-white overflow-hidden relative">
            {/* Visual Accents */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-200 to-transparent opacity-20" />
            
            <div className={themeConfig.spacing.container}>
                {/* Section Branding: High Contrast */}
                <div className="grid lg:grid-cols-2 gap-20 items-end mb-24 md:mb-32">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-zinc-900 text-white font-black text-[10px] uppercase tracking-[0.4em] mb-10 shadow-2xl">
                           <ShieldCheck size={14} className="text-brand-primary" strokeWidth={3} /> Verified on Justdial
                        </div>
                        
                        <h2 className="text-7xl md:text-[8rem] font-black text-zinc-900 tracking-tighter leading-[0.75] mb-12 uppercase italic">
                            WHAT PET <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-orange-500 to-amber-500">PARENTS</span> <br />
                            SAY.
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-1 border-l-8 border-brand-primary pl-10"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="#FF7A00" className="text-brand-primary" />)}
                        </div>
                        <p className="text-2xl text-zinc-400 font-bold max-w-sm leading-relaxed uppercase tracking-tight">
                            Don't just take our word for it — join Lucknow's <span className="text-zinc-900 italic">most loved</span> pet community.
                        </p>
                    </motion.div>
                </div>

                {/* Bento Grid Gallery */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {testimonialsData.map((testimonial, i) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="break-inside-avoid relative group"
                        >
                            <div className="bg-zinc-50 border border-zinc-100 p-10 md:p-12 rounded-[50px] transition-all duration-700 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] hover:border-brand-primary/20 cursor-default">
                                {/* Floating Quote Mark */}
                                <div className="absolute top-10 right-10 opacity-5 group-hover:opacity-20 transition-opacity">
                                    <Quote size={80} className="text-brand-primary rotate-180" />
                                </div>

                                {/* Content: Emotional & Bold */}
                                <div className="flex items-center gap-2 mb-8 text-brand-primary">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill="currentColor" fillOpacity={i < testimonial.rating ? 1 : 0.2} />
                                    ))}
                                </div>
                                
                                <p className="text-2xl italic mb-12 relative z-10 text-zinc-900 font-black leading-[1.1] tracking-tight">
                                    "{testimonial.content}"
                                </p>

                                {/* Profile Bar */}
                                <div className="flex items-center justify-between pt-10 border-t border-zinc-100">
                                    <div className="flex items-center gap-5">
                                        <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-xl ring-2 ring-zinc-100">
                                            <Image
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-110 duration-700"
                                                sizes="56px"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-zinc-900 text-lg uppercase tracking-tight">{testimonial.name}</h4>
                                            <div className="flex items-center gap-1 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                                                <MapPin size={10} className="text-brand-primary" /> Lucknow, UP
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-zinc-300 group-hover:text-brand-primary transition-colors">
                                        <ShieldCheck size={20} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

