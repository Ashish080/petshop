import Link from 'next/link';
import Image from 'next/image';
import { themeConfig } from '@/config/theme';
import { brandConfig } from '@/config/brand';
import { Star, ShieldCheck, Phone, CheckCircle2, Award, HeartPulse } from 'lucide-react';

export default function Hero() {
    return (
        <div className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-white dark:bg-bg-page transition-colors duration-300">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className={themeConfig.spacing.container + " relative z-10"}>
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    
                    <div className="lg:col-span-7">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 dark:bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold text-sm mb-6 shadow-sm">
                            <Award size={16} />
                            {brandConfig.tagline}
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-text-primary tracking-tight leading-[1.1] mb-6">
                            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-orange-400">Perfect</span> Furry Companion
                        </h1>
                        
                        <p className="text-lg md:text-xl text-text-light font-medium max-w-2xl mb-8 leading-relaxed">
                            Premium quality pets with verified breed certificates, health guarantees, and lifetime support. Join over 500+ happy families in Lucknow who trust Kanha Pet Shop.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <Link href="/pets">
                                <button className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white font-black text-lg rounded-xl shadow-xl shadow-brand-primary/25 hover:-translate-y-1 hover:shadow-2xl transition-all flex items-center justify-center gap-2">
                                    🐶 Browse Pets
                                </button>
                            </Link>
                            <a href={`tel:${brandConfig.phone.replace(/[^0-9]/g, '')}`}>
                                <button className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-card-bg border-2 border-card-border text-text-primary font-black text-lg rounded-xl hover:border-brand-primary hover:text-brand-primary transition-all flex items-center justify-center gap-2">
                                    <Phone size={20} /> Request Custom Pet
                                </button>
                            </a>
                        </div>
                        
                        {/* Trust Pills */}
                        <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
                            <div className="flex items-center gap-2 font-bold text-sm text-text-primary">
                                <CheckCircle2 size={18} className="text-green-500" />
                                500+ Happy Families
                            </div>
                            <div className="flex items-center gap-2 font-bold text-sm text-text-primary">
                                <ShieldCheck size={18} className="text-blue-500" />
                                Breed Certified
                            </div>
                            <div className="flex items-center gap-2 font-bold text-sm text-text-primary">
                                <HeartPulse size={18} className="text-red-500" />
                                Health Guaranteed
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-5 relative">
                        {/* Premium Hero Pet Card Showcase */}
                        <div className="relative mx-auto max-w-md w-full bg-white dark:bg-card-bg rounded-[32px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-card-border z-10 transform lg:-rotate-2 hover:rotate-0 transition-transform duration-500 group">
                            
                            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                                <Image 
                                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop" 
                                    alt="Golden Retriever" 
                                    fill 
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 400px"
                                    priority
                                />
                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                    <div className="bg-green-100 text-green-800 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Verified Seller
                                    </div>
                                    <div className="bg-amber-100 text-amber-800 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm items-center gap-1 inline-flex w-fit ml-auto">
                                        KCI Certified
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h3 className="text-2xl font-black text-text-primary mb-1">Golden Retriever</h3>
                                        <p className="text-sm font-bold text-text-light">45 Days Old • Male • Lucknow</p>
                                    </div>
                                    <div className="text-2xl font-black text-brand-primary">
                                        ₹28,000
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-card-border">
                                    <div className="text-center">
                                        <div className="text-xs text-text-light font-bold mb-1">Diet Plan</div>
                                        <div className="text-xs font-black text-green-600 bg-green-50 rounded-lg py-1">Free</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-text-light font-bold mb-1">Vaccinated</div>
                                        <div className="text-xs font-black text-text-primary bg-bg-page rounded-lg py-1">All Shots</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-text-light font-bold mb-1">Vet Visit</div>
                                        <div className="text-xs font-black text-green-600 bg-green-50 rounded-lg py-1">Free</div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        
                        {/* Decorative background blob for image */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-tr from-brand-primary/20 to-orange-400/20 blur-3xl -z-10 rounded-full"></div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}
