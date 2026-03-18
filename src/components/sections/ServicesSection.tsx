import Link from 'next/link';
import { servicesData } from '@/data/services';
import { siteContentConfig } from '@/config/site-content';

export function ServicesSection() {
    const { title, subtitle } = siteContentConfig.homepage.services;

    return (
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">{title}</h2>
                <p className="text-text-muted max-w-2xl mx-auto text-lg">{subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {servicesData.map((service) => (
                    <div key={service.id} className="group bg-background rounded-3xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border border-primary/5 flex flex-col h-full">
                        <div className="relative aspect-video w-full overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 w-12 h-12 bg-background/95 backdrop-blur-sm rounded-2xl flex items-center justify-center text-accent shadow-sm">
                                {/* Dynamically render icon based on service.icon */}
                                {service.icon === 'scissors' && <span>✂️</span>}
                                {service.icon === 'stethoscope' && <span>🩺</span>}
                                {service.icon === 'home' && <span>🏠</span>}
                            </div>
                        </div>

                        <div className="p-8 flex flex-col flex-grow text-center">
                            <h3 className="text-2xl font-bold text-text-main mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
                            <p className="text-text-muted mb-8 text-center flex-grow">{service.description}</p>
                            <Link
                                href={`/services#${service.id}`}
                                className="mt-auto inline-flex items-center justify-center text-primary font-bold hover:text-accent transition-colors"
                            >
                                Learn More
                                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
