import Link from 'next/link';

export function OffersBanner() {
    return (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary rounded-3xl overflow-hidden relative shadow-medium">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 z-10"></div>

                {/* Decorative elements */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-20"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-20"></div>

                <div className="relative z-30 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-8">
                    <div className="max-w-2xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-bold text-sm tracking-widest uppercase mb-4 backdrop-blur-sm border border-accent/30">
                            Limited Time Offer
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-inverse mb-4">
                            Get 20% Off Your First Grooming Session
                        </h2>
                        <p className="text-text-inverse/80 text-lg max-w-xl">
                            Treat your pet to a spa day! Book now and use code <span className="font-bold text-accent">SPA20</span> at checkout.
                        </p>
                    </div>

                    <Link
                        href="/services#booking"
                        className="shrink-0 bg-text-inverse text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-background transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Book Appointment
                    </Link>
                </div>
            </div>
        </section>
    );
}
