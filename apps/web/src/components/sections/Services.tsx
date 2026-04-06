import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { ArrowRight, Scissors, Stethoscope, Home } from 'lucide-react';
import { siteContent } from '@/config/site-content';
import { servicesData } from '@/data/services';

const iconMap: Record<string, React.ReactNode> = {
    scissors: <Scissors size={22} />,
    stethoscope: <Stethoscope size={22} />,
    home: <Home size={22} />
};

export default function Services() {
    const { services: content } = siteContent;

    return (
        <section className="section-padding bg-bg-primary transition-colors duration-[--duration-normal]">
            <div className="container-app">
                <div className="text-center mb-12">
                    <h2 className="text-h1 mb-3">
                        {content.title}
                    </h2>
                    <p className="text-body-lg max-w-2xl mx-auto">
                        {content.subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {servicesData.map((service) => (
                        <div
                            key={service.id}
                            className="group overflow-hidden border border-border bg-bg-tertiary transition-all duration-[--duration-slow] ease-[--ease-out-expo] hover:-translate-y-1.5 hover:shadow-sm hover:border-border-hover rounded-[--radius-lg]"
                        >
                            <div className="relative h-52 w-full overflow-hidden">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-accent">
                                    {iconMap[service.icon]}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-h4 mb-2">{service.title}</h3>
                                <p className="text-body-sm mb-6 leading-relaxed">{service.description}</p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                                    <span className="text-label-lg text-accent">
                                        From ${service.priceStartingAt}
                                    </span>
                                    <Link
                                        href={`/services#${service.title.toLowerCase().replace(' ', '-')}`}
                                        className="flex items-center gap-1 text-label-lg text-brand hover:text-brand-hover transition-colors"
                                    >
                                        Book Now <ArrowRight size={14} />
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
