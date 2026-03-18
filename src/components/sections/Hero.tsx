import Link from 'next/link';
import Image from 'next/image';
import { siteContent } from '@/config/site-content';
import { themeConfig } from '@/config/theme';

export default function Hero() {
    const { hero } = siteContent;

    return (
        <div className="relative bg-white overflow-hidden pb-12 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <div className={themeConfig.spacing.container + " pt-10 sm:pt-12 md:pt-16 lg:pt-20 xl:pt-28"}>
                <div className="lg:grid lg:grid-cols-12 lg:gap-8 animate-fade-in">
                    <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left z-10 relative">
                        <div
                            className="inline-block text-xs font-semibold tracking-wider uppercase rounded-full px-3 py-1 mb-4"
                            style={{ backgroundColor: `${themeConfig.colors.accent}20`, color: themeConfig.colors.accent }}
                        >
                            {hero.badge}
                        </div>
                        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                            <span className="block xl:inline leading-tight" style={{ color: themeConfig.colors.primary }}>
                                {hero.headline}
                            </span>
                        </h1>
                        <p className="mt-3 text-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0" style={{ color: themeConfig.colors.textLight }}>
                            {hero.subheadline}
                        </p>
                        <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                            <Link href={hero.primaryCta.href}>
                                <button
                                    className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium text-white transition-opacity hover:opacity-90 md:py-4 md:text-lg md:px-10 ${themeConfig.radius.md}`}
                                    style={{ backgroundColor: themeConfig.colors.primary }}
                                >
                                    {hero.primaryCta.label}
                                </button>
                            </Link>
                            <Link href={hero.secondaryCta.href}>
                                <button
                                    className={`w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium transition-colors hover:bg-gray-50 md:py-4 md:text-lg md:px-10 ${themeConfig.radius.md}`}
                                    style={{ color: themeConfig.colors.primary, backgroundColor: `${themeConfig.colors.primary}10` }}
                                >
                                    {hero.secondaryCta.label}
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                        <div className="relative mx-auto w-full rounded-2xl shadow-2xl lg:max-w-md overflow-hidden aspect-square transition-transform hover:scale-[1.02] duration-300">
                            <Image
                                src={hero.image}
                                alt="Happy pet"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
