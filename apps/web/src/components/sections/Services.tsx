import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ArrowRight, Scissors, Stethoscope, Home } from 'lucide-react';
import { siteContent } from '@/config/site-content';
import { servicesData } from '@/data/services';
import { themeConfig } from '@/config/theme';

const iconMap: Record<string, React.ReactNode> = {
    scissors: <Scissors size={24} />,
    stethoscope: <Stethoscope size={24} />,
    home: <Home size={24} />
};

export default function Services() {
    const { services: content } = siteContent;

    return (
        <section className={`${themeConfig.spacing.section} bg-bg-page transition-colors duration-400`}>
            <div className={themeConfig.spacing.container}>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black tracking-tight sm:text-5xl mb-4 text-text-primary">
                        {content.title}
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-text-light font-medium">
                        {content.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {servicesData.map((service) => (
                        <div
                            key={service.id}
                            className={`group overflow-hidden border border-card-border bg-white dark:bg-card-bg transition-all duration-500 hover:-translate-y-2 ${themeConfig.radius.lg} ${themeConfig.shadows.soft} hover:${themeConfig.shadows.hover}`}
                        >
                            <div className="relative h-52 w-full overflow-hidden">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div
                                    className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg text-secondary border border-secondary/20"
                                >
                                    {iconMap[service.icon]}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-black mb-2 text-text-primary">{service.title}</h3>
                                <p className="mb-6 text-sm text-text-light font-medium leading-relaxed">{service.description}</p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-card-border/50">
                                    <span className="font-black text-secondary">
                                        From ${service.priceStartingAt}
                                    </span>
                                    <Link
                                        href={`/services#${service.title.toLowerCase().replace(' ', '-')}`}
                                        className="flex items-center gap-1 text-sm font-black hover:text-secondary transition-colors text-brand-primary"
                                    >
                                        Book Now <ArrowRight size={16} strokeWidth={3} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
