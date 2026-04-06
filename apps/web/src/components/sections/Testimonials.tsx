'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Quote, ShieldCheck, MapPin } from 'lucide-react';
import { testimonialsData } from '@/data/testimonials';
import { staggerVariants, staggerItemVariants, scrollRevealVariants } from '@/lib/motion';

export default function Testimonials() {
    return (
        <section className="section-padding bg-bg-primary overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            
            <div className="container-app">
                {/* Section Header */}
                <div className="grid lg:grid-cols-2 gap-16 items-end mb-16 md:mb-24">
                    <motion.div 
                        variants={scrollRevealVariants}
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[--radius-full] bg-text-primary text-text-inverse text-label-sm uppercase tracking-wider mb-8 shadow-lg">
                           <ShieldCheck size={14} className="text-brand" /> Verified on Justdial
                        </div>
                        
                        <h2 className="text-display md:text-[5rem] text-text-primary tracking-tighter leading-[0.85] uppercase mb-8">
                            WHAT PET <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-orange-400 to-amber-500">PARENTS</span> <br />
                            SAY.
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={scrollRevealVariants}
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true }}
                        className="lg:col-span-1 border-l-4 border-brand pl-8"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="currentColor" className="text-brand" />)}
                        </div>
                        <p className="text-h4 text-text-tertiary max-w-sm leading-relaxed font-normal">
                            Don't just take our word for it — join Lucknow's <span className="text-text-primary font-semibold italic">most loved</span> pet community.
                        </p>
                    </motion.div>
                </div>

                {/* Testimonial Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {testimonialsData.map((testimonial, i) => (
                        <motion.div
                            key={testimonial.id}
                            variants={staggerItemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="break-inside-avoid relative group"
                        >
                            <div className="bg-bg-secondary border border-border p-8 md:p-10 rounded-[--radius-xl] transition-all duration-[--duration-slow] hover:bg-bg-tertiary hover:shadow-md hover:border-brand/20 cursor-default">
                                {/* Quote Mark */}
                                <div className="absolute top-8 right-8 opacity-5 group-hover:opacity-15 transition-opacity">
                                    <Quote size={60} className="text-brand rotate-180" />
                                </div>

                                {/* Stars */}
                                <div className="flex items-center gap-1.5 mb-6 text-brand">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill="currentColor" fillOpacity={i < testimonial.rating ? 1 : 0.2} />
                                    ))}
                                </div>
                                
                                <p className="text-h4 italic mb-8 relative z-10 text-text-primary leading-snug">
                                    "{testimonial.content}"
                                </p>

                                {/* Profile */}
                                <div className="flex items-center justify-between pt-6 border-t border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-bg-primary shadow-sm ring-2 ring-border">
                                            <Image
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-110 duration-700"
                                                sizes="48px"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-label-lg text-text-primary">{testimonial.name}</h4>
                                            <div className="flex items-center gap-1 text-overline">
                                                <MapPin size={10} className="text-brand" /> Lucknow, UP
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-9 h-9 rounded-[--radius-md] bg-bg-elevated flex items-center justify-center text-text-disabled group-hover:text-brand transition-colors">
                                        <ShieldCheck size={18} />
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
