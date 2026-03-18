import { brandConfig } from "@/config/brand";

export const metadata = {
    title: "Contact Us",
    description: "Get in touch with us for any inquiries or support.",
};

export default function ContactPage() {
    return (
        <div className="bg-background min-h-screen py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
                        Get In Touch
                    </h1>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
                        We love hearing from pet parents. Reach out to us for any questions about our pets, products, or services.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto">
                    {/* Contact Details */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-primary/5">
                            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-text-main mb-2">Visit Us</h3>
                            <p className="text-text-muted">{brandConfig.address}</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-primary/5">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-text-main mb-2">Call Us</h3>
                            <p className="text-text-muted">{brandConfig.phone}</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-primary/5">
                            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-6">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-text-main mb-2">Email Us</h3>
                            <p className="text-text-muted">{brandConfig.email}</p>
                        </div>
                    </div>

                    {/* Contact Form Placeholder */}
                    <div className="w-full lg:w-2/3 h-full">
                        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-soft border border-primary/5 h-full">
                            <h3 className="text-2xl font-bold text-text-main mb-6">Send us a Message</h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-2">First Name</label>
                                        <input type="text" className="w-full px-5 py-4 rounded-xl border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-muted mb-2">Last Name</label>
                                        <input type="text" className="w-full px-5 py-4 rounded-xl border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans" placeholder="Doe" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
                                    <input type="email" className="w-full px-5 py-4 rounded-xl border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">Message</label>
                                    <textarea rows={5} className="w-full px-5 py-4 rounded-xl border border-primary/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none font-sans" placeholder="How can we help you?"></textarea>
                                </div>
                                <button type="button" className="w-full bg-primary text-text-inverse py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-medium hover:-translate-y-1 mt-4">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
