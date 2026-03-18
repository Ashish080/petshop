import Image from 'next/image';
import { Star } from 'lucide-react';
import { testimonialsData } from '@/data/testimonials';
import { themeConfig } from '@/config/theme';

export default function Testimonials() {
    return (
        <section className={`${themeConfig.spacing.section} bg-bg-page transition-colors duration-300`}>
            <div className={themeConfig.spacing.container}>
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black tracking-tight sm:text-5xl mb-4 text-text-primary">
                        What Pet Parents Say
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-text-light">
                        Don't just take our word for it - hear from our happy community.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonialsData.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className={`bg-white dark:bg-card-bg p-8 relative border border-card-border ${themeConfig.radius.lg} ${themeConfig.shadows.soft} hover:${themeConfig.shadows.hover} transition-all duration-500 hover:-translate-y-2`}
                        >
                            <div className="flex items-center gap-1 mb-6 text-accent">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={20} className="fill-accent" />
                                ))}
                            </div>
                            <p className="text-lg italic mb-8 relative z-10 text-text-primary font-medium">
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
                                    <h4 className="font-black text-text-primary">{testimonial.name}</h4>
                                    <p className="text-sm text-text-light font-medium">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
