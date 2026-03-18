import { testimonialsData } from '@/data/testimonials';

export function TestimonialsSection() {
    return (
        <section className="py-16 md:py-24 bg-secondary/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm">Happy Parents</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-text-main mt-2">What Our Customers Say</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonialsData.map((testimonial) => (
                        <div key={testimonial.id} className="bg-background rounded-3xl p-8 shadow-soft relative">
                            <div className="absolute top-8 right-8 text-accent/20">
                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                                </svg>
                            </div>

                            <div className="flex text-accent mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-accent' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            <p className="text-text-muted mb-8 text-lg font-medium italic relative z-10">&quot;{testimonial.content}&quot;</p>

                            <div className="flex items-center gap-4 mt-auto">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                                />
                                <div>
                                    <h4 className="font-bold text-text-main">{testimonial.name}</h4>
                                    <p className="text-sm text-text-muted">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
