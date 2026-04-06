import { brandConfig } from '@/config/brand';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
    return (
        <div className="py-16 min-h-screen bg-bg-primary">
            <div className="container-app">
                <div className="text-center mb-12">
                    <h1 className="text-h1 text-brand mb-4">Contact Us</h1>
                    <p className="text-body-lg max-w-2xl mx-auto">
                        We'd love to hear from you. Get in touch with us for any questions about our pets, products, or services.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div className="bg-bg-tertiary p-8 rounded-[--radius-lg] shadow-xs border border-border">
                        <h2 className="text-h3 text-accent mb-6">Get In Touch</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-info-muted text-info rounded-full">
                                    <Phone size={22} />
                                </div>
                                <div>
                                    <h3 className="text-h5">Phone & WhatsApp</h3>
                                    <p className="text-body-sm mt-1">{brandConfig.phone}</p>
                                    <p className="text-body-xs mt-0.5">Mon-Sat: 9am - 8pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-success-muted text-success rounded-full">
                                    <Mail size={22} />
                                </div>
                                <div>
                                    <h3 className="text-h5">Email</h3>
                                    <p className="text-body-sm mt-1">{brandConfig.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-brand-muted text-brand rounded-full">
                                    <MapPin size={22} />
                                </div>
                                <div>
                                    <h3 className="text-h5">Visit Us</h3>
                                    <p className="text-body-sm mt-1 leading-relaxed">{brandConfig.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-bg-tertiary p-8 rounded-[--radius-lg] shadow-xs border border-border">
                        <h2 className="text-h3 text-accent mb-6">Send a Message</h2>
                        <form className="space-y-4">
                            <Input label="Name" placeholder="Your Name" />
                            <Input label="Email" type="email" placeholder="your@email.com" />
                            <div className="space-y-1.5">
                                <label className="text-label-lg text-text-primary block">Message</label>
                                <textarea 
                                    rows={4} 
                                    className="w-full bg-bg-tertiary text-text-primary border border-border rounded-[--radius-md] px-4 py-3 text-sm placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-brand transition-all"
                                    placeholder="Write your message here..."
                                />
                            </div>
                            <Button type="button" variant="primary" fullWidth>
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
