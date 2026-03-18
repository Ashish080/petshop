import Link from 'next/link';
import { themeConfig } from '@/config/theme';

export default function OffersBanner() {
    return (
        <section className={`${themeConfig.spacing.section} bg-bg-page transition-colors duration-300`}>
            <div className={themeConfig.spacing.container}>
                <div
                    className={`relative overflow-hidden p-8 md:p-12 lg:p-20 flex flex-col md:flex-row items-center justify-between ${themeConfig.radius.lg} bg-secondary shadow-2xl shadow-secondary/20 transition-all duration-500 hover:scale-[1.01]`}
                >
                    {/* Decorative background patterns */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-accent/20 blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>

                    <div className="relative z-10 md:max-w-xl text-center md:text-left mb-8 md:mb-0">
                        <span className="inline-block text-xs font-black tracking-widest text-white uppercase mb-4 bg-white/20 px-3 py-1 rounded-full">Limited Time Opportunity 🐾</span>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                            Get 20% Off Your <br />First Grooming!
                        </h2>
                        <p className="text-white/90 text-lg max-w-md font-medium">
                            Treat your furry friend to a premium spa day. Book today and give them the royal treatment.
                        </p>
                    </div>

                    <div className="relative z-10 w-full md:w-auto">
                        <Link href="/services#grooming">
                            <button
                                className={`w-full md:w-auto px-12 py-6 font-black text-xl bg-white text-secondary transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 ${themeConfig.radius.lg} shadow-xl shadow-black/10`}
                            >
                                Claim Offer Now
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
