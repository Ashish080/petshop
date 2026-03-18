import Link from 'next/link';
import { brandConfig } from '@/config/brand';
import { navigationConfig } from '@/config/navigation';
import { siteContentConfig } from '@/config/site-content';

export function Footer() {
    const { footer } = siteContentConfig;

    return (
        <footer className="bg-primary text-text-inverse pt-20 pb-10 mt-auto border-t border-primary/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

                    {/* Brand Info */}
                    <div className="space-y-6">
                        <h3 className="text-3xl font-bold text-accent tracking-tighter">
                            {brandConfig.name.split(' ')[0]}
                        </h3>
                        <p className="text-text-inverse/80 max-w-xs">{brandConfig.description}</p>
                        <div className="flex space-x-4">
                            {brandConfig.socialLinks.instagram && (
                                <a href={brandConfig.socialLinks.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-text-inverse/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">
                                    IG
                                </a>
                            )}
                            {brandConfig.socialLinks.facebook && (
                                <a href={brandConfig.socialLinks.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-text-inverse/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">
                                    FB
                                </a>
                            )}
                            {brandConfig.socialLinks.twitter && (
                                <a href={brandConfig.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-text-inverse/10 flex items-center justify-center hover:bg-accent hover:text-primary transition-colors">
                                    TW
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-text-inverse">Shop</h4>
                        <ul className="space-y-4">
                            {navigationConfig.footerNav.shop.map((link) => (
                                <li key={link.title}>
                                    <Link href={link.href} className="text-text-inverse/80 hover:text-accent transition-colors">
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-text-inverse">Support</h4>
                        <ul className="space-y-4">
                            {navigationConfig.footerNav.support.map((link) => (
                                <li key={link.title}>
                                    <Link href={link.href} className="text-text-inverse/80 hover:text-accent transition-colors">
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 text-text-inverse">{footer.newsletterTitle}</h4>
                        <p className="text-text-inverse/80 mb-4">{footer.newsletterDescription}</p>
                        <form className="flex mb-6" action="">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="bg-text-inverse/10 border border-text-inverse/20 text-text-inverse placeholder:text-text-inverse/50 rounded-l-full px-4 py-2 w-full focus:outline-none focus:border-accent"
                            />
                            <button
                                type="button"
                                className="bg-accent text-primary font-bold px-6 py-2 rounded-r-full hover:bg-text-inverse transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                        <div className="space-y-2 text-text-inverse/80">
                            <p className="flex items-center">
                                <span className="mr-2">📍</span> {brandConfig.address}
                            </p>
                            <p className="flex items-center">
                                <span className="mr-2">📞</span> {brandConfig.phone}
                            </p>
                            <p className="flex items-center">
                                <span className="mr-2">✉️</span> {brandConfig.email}
                            </p>
                        </div>
                    </div>

                </div>

                <div className="pt-8 border-t border-text-inverse/10 text-center text-text-inverse/60 text-sm flex flex-col md:flex-row justify-between items-center">
                    <p>{footer.copyright}</p>
                    <div className="mt-4 md:mt-0 flex space-x-6">
                        <Link href="/policies#privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
                        <Link href="/policies#terms" className="hover:text-accent transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
