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
        <section className={`${themeConfig.spacing.section} bg-white`}>
            <div className={themeConfig.spacing.container}>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4" style={{ color: themeConfig.colors.text }}>
                        {content.title}
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg" style={{ color: themeConfig.colors.textLight }}>
                        {content.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {servicesData.map((service) => (
                        <div
                            key={service.id}
                            className={`group overflow-hidden border border-gray-100 transition-all hover:${themeConfig.shadows.hover} ${themeConfig.radius.lg}`}
                        >
                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div
                                    className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md text-primary"
                                    style={{ color: themeConfig.colors.primary }}
                                >
                                    {iconMap[service.icon]}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                                <h3 className="text-xl font-bold mb-2" style={{ color: themeConfig.colors.text }}>{service.title}</h3>
                                <p className="mb-4 text-sm flex-grow" style={{ color: themeConfig.colors.textLight }}>{service.description}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="font-semibold" style={{ color: themeConfig.colors.secondary }}>
                                        From ${service.priceStartingAt}
                                    </span>
                                    <Link
                                        href={`/services#${service.title.toLowerCase().replace(' ', '-')}`}
                                        className="flex items-center gap-1 text-sm font-semibold hover:opacity-80 transition-opacity"
                                        style={{ color: themeConfig.colors.primary }}
                                    >
                                        Book Now <ArrowRight size={16} />
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
