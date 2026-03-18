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
            className={themeConfig.spacing.section}
            style={{ backgroundColor: `${themeConfig.colors.secondary}0D` }}
        >
            <div className={themeConfig.spacing.container}>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4" style={{ color: themeConfig.colors.primary }}>
                        {whyChooseUs.title}
                    </h2>
                    <p className="max-w-2xl mx-auto text-xl" style={{ color: themeConfig.colors.textLight }}>
                        {whyChooseUs.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {whyChooseUs.reasons.map((reason, index) => (
                        <div
                            key={index}
                            className={`bg-white p-8 text-center transition-transform hover:-translate-y-2 ${themeConfig.radius.lg} ${themeConfig.shadows.medium}`}
                        >
                            <div
                                className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
                                style={{ backgroundColor: `${themeConfig.colors.accent}20`, color: themeConfig.colors.accent }}
                            >
                                {iconMap[reason.icon] || <Star size={32} />}
                            </div>
                            <h3 className="text-xl font-bold mb-3" style={{ color: themeConfig.colors.text }}>{reason.title}</h3>
                            <p style={{ color: themeConfig.colors.textLight }}>{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
