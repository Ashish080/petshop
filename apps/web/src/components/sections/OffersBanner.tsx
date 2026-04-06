import Link from 'next/link';
import { themeConfig } from '@/config/theme';
import { Gift, ChevronRight } from 'lucide-react';

export default function OffersBanner() {
    return (
        <section className={`${themeConfig.spacing.section} bg-bg-page`}>
            <div className={themeConfig.spacing.container}>
                <div
                    className={`relative overflow-hidden p-10 md:p-16 lg:p-24 flex flex-col md:flex-row items-center justify-between ${themeConfig.radius.xl} bg-zinc-900 shadow-3xl group`}
                >
                    {/* Dynamic Gradient Orbs */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-primary opacity-20 blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-secondary opacity-10 blur-[120px]"></div>

                    <div className="relative z-10 md:max-w-2xl text-center md:text-left mb-12 md:mb-0">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-black text-xs uppercase tracking-[0.3em] mb-8">
                           <Gift size={16} /> Limited Time Member Offer
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                            UNLOCK <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-orange-300">20% VEDIC</span> <br />
                            GROOMING.
                        </h2>
                        <p className="text-zinc-400 text-xl max-w-md font-bold leading-relaxed mb-6">
                            Treat your companion to Lucknow's most premium spa experience. Valid for first-time bookings.
                        </p>
                    </div>

                    <div className="relative z-10 w-full md:w-auto">
                        <Link href="/services#grooming">
                            <button
                                className={`w-full md:w-auto px-16 py-8 font-black text-2xl bg-brand-primary text-white transition-all hover:scale-105 active:scale-95 ${themeConfig.radius.lg} shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-4`}
                            >
                                Claim Offer Now
                                <ChevronRight size={28} strokeWidth={3} />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
