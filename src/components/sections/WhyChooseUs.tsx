import { siteContent } from '@/config/site-content';
import { themeConfig } from '@/config/theme';
import { Star, Heart, Clock, ShieldCheck } from 'lucide-react';
import React from 'react';

const iconMap: Record<string, React.ReactNode> = {
    star: <Star size={32} />,
    heart: <Heart size={32} />,
    clock: <Clock size={32} />,
    shield: <ShieldCheck size={32} />
};

export default function WhyChooseUs() {
    const { whyChooseUs } = siteContent;

    return (
        <section
            className={`${themeConfig.spacing.section} bg-bg-page transition-colors duration-300`}
        >
            <div className={themeConfig.spacing.container}>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black tracking-tight sm:text-5xl mb-4 text-brand-primary">
                        {whyChooseUs.title}
                    </h2>
                    <p className="max-w-2xl mx-auto text-xl text-text-light font-medium">
                        {whyChooseUs.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {whyChooseUs.reasons.map((reason, index) => (
                        <div
                            key={index}
                            className={`bg-white dark:bg-card-bg p-8 text-center transition-all duration-500 hover:-translate-y-2 border border-card-border ${themeConfig.radius.lg} ${themeConfig.shadows.soft} hover:${themeConfig.shadows.hover}`}
                        >
                            <div
                                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 bg-accent/10 text-accent border border-accent/20"
                            >
                                {iconMap[reason.icon] || <Star size={32} />}
                            </div>
                            <h3 className="text-xl font-black mb-3 text-text-primary">{reason.title}</h3>
                            <p className="text-text-light font-medium text-sm leading-relaxed">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
