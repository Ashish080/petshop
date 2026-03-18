import Image from 'next/image';
import { Star } from 'lucide-react';
import { testimonialsData } from '@/data/testimonials';
import { themeConfig } from '@/config/theme';

export default function Testimonials() {
    return (
        <section className={themeConfig.spacing.section} style={{ backgroundColor: themeConfig.colors.background }}>
            <div className={themeConfig.spacing.container}>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4" style={{ color: themeConfig.colors.text }}>
                        What Pet Parents Say
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg" style={{ color: themeConfig.colors.textLight }}>
                        Don't just take our word for it - hear from our happy community.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonialsData.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className={`bg-white p-8 relative ${themeConfig.radius.lg} ${themeConfig.shadows.medium}`}
                        >
                            <div className="flex items-center gap-1 mb-6 text-yellow-400">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={20} className="fill-yellow-400" />
                                ))}
                            </div>
                            <p className="text-lg italic mb-8 relative z-10" style={{ color: themeConfig.colors.text }}>
                                "{testimonial.content}"
                            </p>
                            <div className="flex items-center gap-4 mt-auto">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                                    <Image
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold" style={{ color: themeConfig.colors.text }}>{testimonial.name}</h4>
                                    <p className="text-sm" style={{ color: themeConfig.colors.textLight }}>{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
