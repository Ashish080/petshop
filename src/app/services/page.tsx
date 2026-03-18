import { servicesData } from "@/data/services";
import { siteContentConfig } from "@/config/site-content";

export const metadata = {
    title: "Our Services - Grooming, Vet Care & Boarding",
    description: "Explore our premium pet care services tailored to your pet's needs.",
};

export default function ServicesPage() {
    const { title, subtitle } = siteContentConfig.homepage.services;

    return (
        <div className="bg-background min-h-screen py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {servicesData.map((service) => (
                        <div key={service.id} className="bg-white rounded-[2rem] overflow-hidden shadow-soft border border-primary/5 hover:shadow-medium transition-all duration-300 group hover:-translate-y-1">
                            <div className="relative h-64 w-full">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-text-main mb-3 group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-text-muted leading-relaxed mb-8">
                                    {service.description}
                                </p>
                                <button className="text-primary font-bold hover:text-primary/80 transition-colors flex items-center gap-2">
                                    Learn More
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
