import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { brandConfig } from '@/config/brand';
import { navigationConfig } from '@/config/navigation';
import { siteContent } from '@/config/site-content';

export default function Footer() {
    const { footer } = siteContent;

    return (
        <footer className="bg-bg-primary border-t border-border mt-auto transition-colors duration-[--duration-normal]">
            <div className="container-app pt-16 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-12 gap-10 xl:gap-16 mb-16">

                    <div className="xl:col-span-4">
                        <Link href="/" className="inline-block mb-6">
                            <span className="text-h2 tracking-tight text-brand">
                                {brandConfig.name}
                            </span>
                        </Link>
                        <p className="mb-6 max-w-sm text-body-sm">
                            {brandConfig.description}
                        </p>
                        <div className="flex space-x-5">
                            <a href={brandConfig.socialLinks.facebook} className="text-text-tertiary hover:text-accent transition-all hover:scale-110">
                                <span className="sr-only">Facebook</span>
                                <Facebook size={20} strokeWidth={2} />
                            </a>
                            <a href={brandConfig.socialLinks.instagram} className="text-text-tertiary hover:text-brand transition-all hover:scale-110">
                                <span className="sr-only">Instagram</span>
                                <Instagram size={20} strokeWidth={2} />
                            </a>
                            <a href={brandConfig.socialLinks.twitter} className="text-text-tertiary hover:text-accent transition-all hover:scale-110">
                                <span className="sr-only">Twitter</span>
                                <Twitter size={20} strokeWidth={2} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-label-sm uppercase tracking-wider text-text-primary mb-6">Shop</h3>
                        <ul className="space-y-3">
                            {navigationConfig.footerNav.shop.map((item) => (
                                <li key={item.title}>
                                    <Link href={item.href} className="text-body-sm hover:text-brand transition-colors">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-label-sm uppercase tracking-wider text-text-primary mb-6">Services</h3>
                        <ul className="space-y-3">
                            {navigationConfig.footerNav.services.map((item) => (
                                <li key={item.title}>
                                    <Link href={item.href} className="text-body-sm hover:text-brand transition-colors">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-label-sm uppercase tracking-wider text-text-primary mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-[--radius-md] bg-brand-muted flex items-center justify-center text-brand shrink-0">
                                    <MapPin size={16} />
                                </div>
                                <span className="text-body-sm leading-relaxed">{brandConfig.address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-[--radius-md] bg-accent-muted flex items-center justify-center text-accent shrink-0">
                                    <Phone size={16} />
                                </div>
                                <span className="text-body-sm">{brandConfig.phone}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-[--radius-md] bg-info-muted flex items-center justify-center text-info shrink-0">
                                    <Mail size={16} />
                                </div>
                                <span className="text-body-sm">{brandConfig.email}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="xl:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-overline mb-4">Logistics Fleet</h3>
                            <Link href="/rider/auth/signup" className="inline-flex items-center gap-2 text-label-sm text-accent hover:text-accent-hover transition-all uppercase tracking-wider bg-accent-muted px-3 py-2 rounded-[--radius-md] border border-accent/20">
                                Join as Rider 🛵
                            </Link>
                        </div>
                        <div>
                            <h3 className="text-overline mb-4">Administration</h3>
                            <Link href="/admin/login" className="inline-flex items-center gap-2 text-label-sm text-brand hover:text-brand-hover transition-all uppercase tracking-wider bg-brand-muted px-3 py-2 rounded-[--radius-md] border border-brand/20">
                                Admin CP 🔐
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-body-xs">
                        &copy; {new Date().getFullYear()} {brandConfig.name}. {footer.copyright}
                    </p>
                    <div className="flex gap-6">
                        {navigationConfig.footerNav.legal.map((item) => (
                            <Link key={item.title} href={item.href} className="text-body-xs hover:underline hover:text-brand transition-colors">
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
