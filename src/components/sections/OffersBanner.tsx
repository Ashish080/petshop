import Link from 'next/link';
import { themeConfig } from '@/config/theme';

export default function OffersBanner() {
    return (
        <section className={themeConfig.spacing.section} style={{ backgroundColor: themeConfig.colors.background }}>
            <div className={themeConfig.spacing.container}>
                <div
                    className={`relative overflow-hidden p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between ${themeConfig.radius.lg}`}
                    style={{ backgroundColor: themeConfig.colors.secondary }}
                >
                    {/* Decorative background circles */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-white opacity-10"></div>

                    <div className="relative z-10 md:max-w-xl text-center md:text-left mb-8 md:mb-0">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Get 20% Off Your First Grooming Session!
                        </h2>
                        <p className="text-white opacity-90 text-lg">
                            Treat your furry friend to a spa day. Book today and give them the royal treatment they deserve.
                        </p>
                    </div>

                    <div className="relative z-10 w-full md:w-auto">
                        <Link href="/services#grooming">
                            <button
                                className={`w-full md:w-auto px-8 py-4 font-bold text-lg bg-white transition-opacity hover:opacity-90 ${themeConfig.radius.md}`}
                                style={{ color: themeConfig.colors.secondary }}
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
