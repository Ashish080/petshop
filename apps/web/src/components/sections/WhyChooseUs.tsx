'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Award, Heart, Stethoscope, Sparkles, CheckCircle2 } from 'lucide-react';
import { themeConfig } from '@/config/theme';

export default function WhyChooseUs() {
    return (
        <section className="py-24 md:py-32 bg-[#050505] text-white overflow-hidden relative">
            {/* Cinematic Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
            </div>

            <div className={themeConfig.spacing.container + " relative z-10"}>
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left: Power Heading */}
                    <motion.div 
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-brand-primary font-black text-[10px] uppercase tracking-[0.4em] mb-10 backdrop-blur-md">
                           <ShieldCheck size={16} /> 100% Authenticity Verified
                        </div>
                        
                        <h2 className="text-6xl md:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase mb-12 italic">
                            OUR HEALTH <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-orange-400 to-amber-500">GUARANTEE.</span>
                        </h2>
                        
                        <p className="text-xl text-white/40 font-bold max-w-lg leading-relaxed mb-16 border-l-4 border-brand-primary pl-8">
                            We don't just sell pets — we build lifelong bonds. Every companion at Kanha is ethically sourced, rigorously health-checked, and certified for a lifetime of joy in Lucknow.
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex flex-col gap-4">
                                <div className="text-4xl font-black text-brand-primary tracking-tighter leading-none">500+</div>
                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Happy Homes</div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="text-4xl font-black text-emerald-500 tracking-tighter leading-none">100%</div>
                                <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">Health Warranty</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Feature Matrix */}
                    <div className="grid gap-6">
                        {[
                            { 
                                icon: Award, 
                                title: "Breed Certificate", 
                                desc: "KCI / IKC certified papers ensuring 100% pure bloodline and lineage.",
                                color: "text-amber-500",
                                bg: "bg-amber-500/10"
                            },
                            { 
                                icon: Stethoscope, 
                                title: "Free Vet Consultation", 
                                desc: "Exclusive first health checkup by our expert veterinary panel.",
                                color: "text-blue-500",
                                bg: "bg-blue-500/10"
                            },
                            { 
                                icon: Heart, 
                                title: "Microchipped Security", 
                                desc: "International standard identification for your pet's global safety.",
                                color: "text-brand-primary",
                                bg: "bg-brand-primary/10"
                            },
                            { 
                                icon: Sparkles, 
                                title: "30-Day Nutrition Support", 
                                desc: "Custom-crafted survival and health kits for a thriving companion.",
                                color: "text-emerald-500",
                                bg: "bg-emerald-500/10"
                            }
                        ].map((feature, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative"
                            >
                                <div className="bg-white/[0.03] border border-white/5 backdrop-blur-3xl p-8 md:p-10 rounded-[40px] hover:bg-white/[0.08] transition-all duration-700 hover:border-brand-primary/20 flex gap-8 items-center cursor-pointer">
                                    <div className={`w-20 h-20 shrink-0 rounded-[28px] ${feature.bg} flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-6`}>
                                        <feature.icon className={`w-10 h-10 ${feature.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight flex items-center gap-2">
                                            {feature.title}
                                            <CheckCircle2 size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h3>
                                        <p className="text-white/40 font-bold leading-relaxed text-sm">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

