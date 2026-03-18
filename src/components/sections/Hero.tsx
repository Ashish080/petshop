import Link from 'next/link';
import { siteContentConfig } from '@/config/site-content';

export function Hero() {
    const { hero } = siteContentConfig.homepage;

    return (
        <section className="relative bg-secondary/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-40 relative z-10">
                <div className="max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-primary leading-[1.1] tracking-tight mb-6">
                        {hero.headline}
                    </h1>
                    <p className="text-lg md:text-xl text-text-muted mb-10 max-w-xl leading-relaxed">
                        {hero.subheadline}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-text-inverse bg-primary hover:bg-primary/90 transition-all shadow-medium hover:shadow-lg transform hover:-translate-y-1"
                        >
                            {hero.primaryCta}
                        </Link>
                        <Link
                            href="/services"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-primary bg-background border-2 border-primary/20 hover:border-primary/50 transition-all shadow-soft"
                        >
                            {hero.secondaryCta}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative Image / Shape */}
            <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-l from-secondary/10 via-transparent to-transparent z-10 mix-blend-multiply opacity-50"></div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={hero.image}
                    alt="Hero background"
                    className="w-full h-full object-cover object-center rounded-l-[5rem] shadow-medium"
                />
            </div>
        </section>
    );
}
