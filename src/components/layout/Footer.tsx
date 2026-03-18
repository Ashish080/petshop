import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { brandConfig } from '@/config/brand';
import { navigationConfig } from '@/config/navigation';
import { siteContent } from '@/config/site-content';
import { themeConfig } from '@/config/theme';

export default function Footer() {
    const { footer } = siteContent;

    return (
        <footer className="bg-bg-page border-t border-card-border mt-auto transition-colors duration-300">
            <div className={themeConfig.spacing.container + " pt-16 pb-8"}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 gap-10 xl:gap-16 mb-16">

                    <div className="xl:col-span-4">
                        <Link href="/" className="inline-block mb-6">
                            <span className="font-black text-4xl tracking-tighter text-brand-primary">
                                {brandConfig.name}
                            </span>
                        </Link>
                        <p className="mb-6 max-w-sm text-text-light font-medium">
                            {brandConfig.description}
                        </p>
                        <div className="flex space-x-5">
                            <a href={brandConfig.socialLinks.facebook} className="text-text-light hover:text-secondary transition-all hover:scale-110">
                                <span className="sr-only">Facebook</span>
                                <Facebook size={22} strokeWidth={2.5} />
                            </a>
                            <a href={brandConfig.socialLinks.instagram} className="text-text-light hover:text-brand-primary transition-all hover:scale-110">
                                <span className="sr-only">Instagram</span>
                                <Instagram size={22} strokeWidth={2.5} />
                            </a>
                            <a href={brandConfig.socialLinks.twitter} className="text-text-light hover:text-secondary transition-all hover:scale-110">
                                <span className="sr-only">Twitter</span>
                                <Twitter size={22} strokeWidth={2.5} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-black text-lg mb-6 text-text-primary uppercase tracking-wider text-sm">Shop</h3>
                        <ul className="space-y-4">
                            {navigationConfig.footerNav.shop.map((item) => (
                                <li key={item.title}>
                                    <Link href={item.href} className="text-sm font-medium transition-all text-text-light hover:text-brand-primary">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-lg mb-6 text-text-primary uppercase tracking-wider text-sm">Services</h3>
                        <ul className="space-y-4">
                            {navigationConfig.footerNav.services.map((item) => (
                                <li key={item.title}>
                                    <Link href={item.href} className="text-sm font-medium transition-all text-text-light hover:text-brand-primary">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-black text-lg mb-6 text-text-primary uppercase tracking-wider text-sm">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary shrink-0">
                                    <MapPin size={20} strokeWidth={2.5} />
                                </div>
                                <span className="text-sm text-text-light font-medium leading-relaxed">{brandConfig.address}</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary shrink-0">
                                    <Phone size={20} strokeWidth={2.5} />
                                </div>
                                <span className="text-sm text-text-light font-medium">{brandConfig.phone}</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent shrink-0">
                                    <Mail size={20} strokeWidth={2.5} />
                                </div>
                                <span className="text-sm text-text-light font-medium">{brandConfig.email}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="xl:col-span-2">
                        <h3 className="font-black text-text-primary uppercase tracking-[0.2em] text-[10px] mb-8">Administration</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/admin/login" className="inline-flex items-center gap-2 text-xs font-black text-brand-primary hover:text-secondary transition-all uppercase tracking-widest bg-brand-primary/10 px-4 py-2 rounded-xl">
                                    Admin CP 🔐
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-200 dark:border-[#0f3460] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm" style={{ color: themeConfig.colors.textLight }}>
                        &copy; {new Date().getFullYear()} {brandConfig.name}. {footer.copyright}
                    </p>
                    <div className="flex gap-6">
                        {navigationConfig.footerNav.legal.map((item) => (
                            <Link key={item.title} href={item.href} className="text-sm hover:underline text-text-light hover:text-brand-primary">
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
