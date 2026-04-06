import { brandConfig } from '@/config/brand';
import { themeConfig } from '@/config/theme';
import { Phone, Mail, MapPin } from 'lucide-react';

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
    return (
        <div className="py-16 min-h-screen" style={{ backgroundColor: themeConfig.colors.background }}>
            <div className={themeConfig.spacing.container}>
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4" style={{ color: themeConfig.colors.primary }}>Contact Us</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We'd love to hear from you. Get in touch with us for any questions about our pets, products, or services.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6" style={{ color: themeConfig.colors.secondary }}>Get In Touch</h2>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg" style={{ color: themeConfig.colors.text }}>Phone & WhatsApp</h3>
                                    <p className="text-gray-600 mt-1">{brandConfig.phone}</p>
                                    <p className="text-gray-500 text-sm mt-1">Mon-Sat: 9am - 8pm</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-full">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg" style={{ color: themeConfig.colors.text }}>Email</h3>
                                    <p className="text-gray-600 mt-1">{brandConfig.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg" style={{ color: themeConfig.colors.text }}>Visit Us</h3>
                                    <p className="text-gray-600 mt-1 leading-relaxed">{brandConfig.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-6" style={{ color: themeConfig.colors.secondary }}>Send a Message</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" className="w-full px-4 py-3 border rounded-lg outline-none" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" className="w-full px-4 py-3 border rounded-lg outline-none" placeholder="your@email.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea rows={4} className="w-full px-4 py-3 border rounded-lg outline-none" placeholder="Write your message here..."></textarea>
                            </div>
                            <button type="button" className="w-full py-3 px-6 text-white font-bold rounded-lg transition-opacity hover:opacity-90" style={{ backgroundColor: themeConfig.colors.primary }}>
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
