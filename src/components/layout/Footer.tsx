import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { brandConfig } from '@/config/brand';
import { navigationConfig } from '@/config/navigation';
import { siteContent } from '@/config/site-content';
import { themeConfig } from '@/config/theme';

export default function Footer() {
    const { footer } = siteContent;

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className={themeConfig.spacing.container + " pt-16 pb-8"}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-6">
                            <span className="font-bold text-3xl tracking-tighter" style={{ color: themeConfig.colors.primary }}>
                                {brandConfig.name}
                            </span>
                        </Link>
                        <p className="mb-6 max-w-sm" style={{ color: themeConfig.colors.textLight }}>
                            {brandConfig.description}
                        </p>
                        <div className="flex space-x-4">
                            <a href={brandConfig.socialLinks.facebook} className="text-gray-400 hover:text-blue-600 transition-colors">
                                <span className="sr-only">Facebook</span>
                                <Facebook size={20} />
                            </a>
                            <a href={brandConfig.socialLinks.instagram} className="text-gray-400 hover:text-pink-600 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <Instagram size={20} />
                            </a>
                            <a href={brandConfig.socialLinks.twitter} className="text-gray-400 hover:text-blue-400 transition-colors">
                                <span className="sr-only">Twitter</span>
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6" style={{ color: themeConfig.colors.text }}>Shop</h3>
                        <ul className="space-y-4">
                            {navigationConfig.footerNav.shop.map((item) => (
                                <li key={item.title}>
                                    <Link href={item.href} className="text-sm hover:underline transition-all" style={{ color: themeConfig.colors.textLight }}>
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6" style={{ color: themeConfig.colors.text }}>Services</h3>
                        <ul className="space-y-4">
                            {navigationConfig.footerNav.services.map((item) => (
                                <li key={item.title}>
                                    <Link href={item.href} className="text-sm hover:underline transition-all" style={{ color: themeConfig.colors.textLight }}>
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-6" style={{ color: themeConfig.colors.text }}>Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm" style={{ color: themeConfig.colors.textLight }}>
                                <MapPin size={18} className="shrink-0 mt-0.5" />
                                <span>{brandConfig.address}</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm" style={{ color: themeConfig.colors.textLight }}>
                                <Phone size={18} className="shrink-0" />
                                <span>{brandConfig.phone}</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm" style={{ color: themeConfig.colors.textLight }}>
                                <Mail size={18} className="shrink-0" />
                                <span>{brandConfig.email}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm" style={{ color: themeConfig.colors.textLight }}>
                        &copy; {new Date().getFullYear()} {brandConfig.name}. {footer.copyright}
                    </p>
                    <div className="flex gap-6">
                        {navigationConfig.footerNav.legal.map((item) => (
                            <Link key={item.title} href={item.href} className="text-sm hover:underline" style={{ color: themeConfig.colors.textLight }}>
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
