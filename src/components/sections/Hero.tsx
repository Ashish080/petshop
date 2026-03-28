import Link from 'next/link';
import Image from 'next/image';
import { siteContent } from '@/config/site-content';
import { themeConfig } from '@/config/theme';
import { Star, Heart } from 'lucide-react';

export default function Hero() {
    const { hero } = siteContent;

    return (
        <div className="relative bg-bg-page overflow-hidden pb-12 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32 transition-colors duration-300">
            {/* Animated Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40 dark:opacity-20">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-brand-primary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 -right-20 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className={themeConfig.spacing.container + " pt-16 sm:pt-20 md:pt-24 lg:pt-32 xl:pt-40 relative z-10"}>
                <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

                    <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-12 xl:col-span-7 lg:text-left">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/50 dark:bg-card-bg/50 backdrop-blur-md border border-card-border/50 mb-10 shadow-sm animate-fade-in">
                            <div className="flex -space-x-3">
                                {[
                                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
                                ].map((url, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-nav-bg bg-gray-200 overflow-hidden relative">
                                        <Image src={url} alt="Customer" fill className="object-cover" sizes="32px" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex text-accent">
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                    <Star size={16} fill="currentColor" />
                                </div>
                                <span className="text-sm font-black text-text-primary">4.9/5 Rating</span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black mb-8 text-text-primary leading-[1.05] tracking-tight">
                            The Best Care for <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary via-secondary to-accent">Your Best Friend</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-text-light max-w-2xl mb-12 leading-relaxed font-medium">
                            Discover premium products, expert care services, and lovely companions waiting for a forever home. Let's make their paws happy!
                        </p>

                        <div className="flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-6">
                            <Link href="/products" className="group">
                                <button className={`w-full sm:w-auto px-10 py-5 bg-brand-primary text-white font-black text-xl transition-all hover:-translate-y-2 hover:shadow-2xl active:scale-95 ${themeConfig.radius.lg} shadow-xl shadow-brand-primary/30 flex items-center justify-center gap-3`}>
                                    Shop Now
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                            </Link>
                            <Link href="/pets">
                                <button className={`w-full sm:w-auto px-10 py-5 border-4 border-secondary text-secondary font-black text-xl transition-all hover:-translate-y-2 hover:bg-secondary hover:text-white active:scale-95 ${themeConfig.radius.lg} flex items-center justify-center`}>
                                    Meet Our Pets
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-20 xl:mt-0 xl:col-span-5 relative group">
                        <div className="relative mx-auto w-full max-w-md lg:max-w-xl aspect-square">
                            {/* Glowing effect behind */}
                            <div className="absolute inset-0 bg-brand-primary/20 blur-[80px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000"></div>

                            <div className="relative h-full w-full rounded-[60px] md:rounded-[100px] overflow-hidden shadow-2xl transition-transform duration-1000 group-hover:scale-[1.03] group-hover:-rotate-1 border-8 border-white/50 dark:border-card-bg/50 backdrop-blur-sm z-10">
                                <Image
                                    src={hero.image}
                                    alt="Happy pet"
                                    fill
                                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                            </div>

                            {/* Floating Card */}
                            <div className="absolute -bottom-10 -left-10 md:-left-20 bg-white dark:bg-card-bg p-6 rounded-[32px] shadow-2xl border border-card-border z-20 animate-bounce-slow max-w-[200px]">
                                <div className="flex flex-col gap-2">
                                    <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white">
                                        <Heart size={24} fill="currentColor" />
                                    </div>
                                    <p className="text-sm font-black text-text-primary leading-tight">100+ Pets Adopted This Month</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
