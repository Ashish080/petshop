import Link from 'next/link';
import { brandConfig } from '@/config/brand';
import { navigationConfig } from '@/config/navigation';

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full bg-background border-b border-primary/10 shadow-soft">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary tracking-tight">
                            {brandConfig.name.split(' ')[0]}
                        </span>
                        <span className="text-xl font-medium text-text-muted hidden sm:inline-block">
                            {brandConfig.name.split(' ').slice(1).join(' ')}
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navigationConfig.mainNav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-text-main hover:text-primary font-medium transition-colors"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>

                    {/* Contact / CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-sm text-text-muted">
                            Call us: <span className="font-semibold text-primary">{brandConfig.phone}</span>
                        </span>
                        <a
                            href={`https://wa.me/${brandConfig.whatsapp.replace(/\\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary text-text-inverse px-5 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-soft hover:shadow-medium transform hover:-translate-y-0.5 duration-200"
                        >
                            WhatsApp Us
                        </a>
                    </div>

                    {/* Mobile menu button (Simplified for now) */}
                    <div className="md:hidden flex items-center">
                        <button className="text-text-main hover:text-primary p-2">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
