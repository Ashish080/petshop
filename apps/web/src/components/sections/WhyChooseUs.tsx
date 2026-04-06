'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Award, Heart, Stethoscope, Sparkles, CheckCircle2 } from 'lucide-react';
import { staggerVariants, staggerItemVariants, scrollRevealVariants } from '@/lib/motion';

export default function WhyChooseUs() {
    return (
        <section className="py-24 md:py-32 bg-bg-primary text-text-primary overflow-hidden relative">
            {/* Cinematic Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-success/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
            </div>

            <div className="container-app relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left: Power Heading */}
                    <motion.div 
                        variants={scrollRevealVariants}
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-bg-secondary border border-border text-brand text-label-sm uppercase tracking-overline mb-10 backdrop-blur-md">
                           <ShieldCheck size={16} /> 100% Authenticity Verified
                        </div>
                        
                        <h2 className="text-h1 md:text-display font-extrabold text-text-primary leading-[0.9] tracking-tighter uppercase mb-10">
                            OUR HEALTH <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent">GUARANTEE.</span>
                        </h2>
                        
                        <p className="text-body-lg text-text-secondary max-w-lg leading-relaxed mb-12 border-l-4 border-brand pl-6">
                            We don't just sell pets — we build lifelong bonds. Every companion at Kanha is ethically sourced, rigorously health-checked, and certified for a lifetime of joy.
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex flex-col gap-3">
                                <div className="text-h1 text-stat text-brand tracking-tight leading-none">500+</div>
                                <div className="text-overline text-text-tertiary">Happy Homes</div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="text-h1 text-stat text-success tracking-tight leading-none">100%</div>
                                <div className="text-overline text-text-tertiary">Health Warranty</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Feature Matrix */}
                    <motion.div 
                        variants={staggerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid gap-4"
                    >
                        {[
                            { 
                                icon: Award, 
                                title: "Breed Certificate", 
                                desc: "KCI / IKC certified papers ensuring 100% pure bloodline and lineage.",
                                color: "text-warning",
                                bg: "bg-warning/10"
                            },
                            { 
                                icon: Stethoscope, 
                                title: "Free Vet Consultation", 
                                desc: "Exclusive first health checkup by our expert veterinary panel.",
                                color: "text-info",
                                bg: "bg-info/10"
                            },
                            { 
                                icon: Heart, 
                                title: "Microchipped Security", 
                                desc: "International standard identification for your pet's global safety.",
                                color: "text-brand",
                                bg: "bg-brand/10"
                            },
                            { 
                                icon: Sparkles, 
                                title: "30-Day Nutrition Support", 
                                desc: "Custom-crafted survival and health kits for a thriving companion.",
                                color: "text-success",
                                bg: "bg-success/10"
                            }
                        ].map((feature, i) => (
                            <motion.div 
                                key={i}
                                variants={staggerItemVariants}
                                className="group relative"
                            >
                                <div className="bg-bg-tertiary/40 border border-border backdrop-blur-xl p-6 md:p-8 rounded-[--radius-xl] hover:bg-bg-tertiary transition-all duration-[--duration-slow] hover:border-border-hover flex gap-6 items-center cursor-pointer">
                                    <div className={`w-16 h-16 shrink-0 rounded-[--radius-lg] ${feature.bg} flex items-center justify-center transition-all duration-[--duration-slow] group-hover:scale-110 group-hover:rotate-6`}>
                                        <feature.icon className={`w-8 h-8 ${feature.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-h4 text-text-primary mb-1 flex items-center gap-2">
                                            {feature.title}
                                            <CheckCircle2 size={14} className="text-success opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h3>
                                        <p className="text-body-sm text-text-secondary leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
