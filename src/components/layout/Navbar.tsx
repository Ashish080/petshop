"use client";
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, LayoutDashboard } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { brandConfig } from '@/config/brand';
import { navigationConfig } from '@/config/navigation';
import { themeConfig } from '@/config/theme';
import NightWalkToggle from '@/components/ui/NightWalkToggle';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    const cartCount = useCartStore((s) => s.itemCount);

    const navLabel = useMemo(() => {
        if (status !== 'authenticated' || !session?.user) return null;
        const raw = session.user.name?.trim() || session.user.email?.split('@')[0] || 'Account';
        return raw.charAt(0).toUpperCase() + raw.slice(1);
    }, [status, session?.user]);

    return (
        <nav className="bg-nav-bg/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-card-border transition-all duration-300">
            <div className={themeConfig.spacing.container}>
                <div className="flex justify-between items-center h-22 gap-4">
                    <div className="flex items-center flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <span className="font-black text-xl md:text-2xl tracking-tighter text-brand-primary">
                                {brandConfig.name}
                            </span>
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center gap-x-6 xl:gap-x-8">
                        {navigationConfig.mainNav.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="font-bold text-sm xl:text-base transition-colors text-text-body hover:text-brand-primary whitespace-nowrap"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-x-3 md:gap-x-4">
                        <div className="flex items-center gap-x-1 sm:gap-x-3">
                            <NightWalkToggle />
                            {navLabel ? (
                                <Link href="/dashboard" className="flex items-center gap-2 py-2 px-3 bg-brand-primary/10 rounded-full text-brand-primary hover:bg-brand-primary/20 transition-all group" aria-label="Go to Dashboard">
                                    <LayoutDashboard size={18} className="group-hover:rotate-12 transition-transform" />
                                    <span className="hidden sm:inline font-black text-xs uppercase tracking-widest">Dashboard ({navLabel})</span>
                                </Link>
                            ) : (
                                <Link href="/auth/login" className="p-2 text-text-body hover:text-brand-primary transition-colors hidden sm:block" aria-label="Sign in">
                                    <User size={20} />
                                </Link>
                            )}
                            <Link
                                href="/cart"
                                className="p-2 text-text-body hover:text-brand-primary transition-colors relative"
                                aria-label="Shopping cart"
                            >
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 min-w-[1rem] h-4 px-0.5 flex items-center justify-center text-white rounded-full bg-secondary text-[10px] font-black border-2 border-white dark:border-nav-bg">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>

                        <div className="hidden md:block">
                            <Link href="/products">
                                <button
                                    className={`px-4 xl:px-6 py-2.5 bg-brand-primary text-white font-black text-sm transition-all hover:opacity-90 hover:scale-105 active:scale-95 whitespace-nowrap shadow-lg shadow-brand-primary/20 ${themeConfig.radius.full}`}
                                >
                                    Shop Now
                                </button>
                            </Link>
                        </div>

                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-md focus:outline-none text-brand-primary transition-transform active:scale-90"
                                aria-expanded={isOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-nav-bg border-t border-card-border shadow-2xl animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {navigationConfig.mainNav.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-3 rounded-xl text-lg font-bold text-text-primary hover:bg-brand-primary/5 transition-colors"
                            >
                                {item.title}
                            </Link>
                        ))}

                        {navLabel && (
                            <Link
                                href="/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-3 rounded-xl text-lg font-bold text-brand-primary bg-brand-primary/5 border border-brand-primary/10 transition-colors"
                            >
                                My Dashboard ({navLabel})
                            </Link>
                        )}
                        {!navLabel && (
                            <Link
                                href="/auth/login"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-3 rounded-xl text-lg font-bold text-text-body hover:bg-brand-primary/5 transition-colors"
                            >
                                Sign in
                            </Link>
                        )}

                        <div className="pt-6">
                            <Link href="/products" onClick={() => setIsOpen(false)}>
                                <button
                                    className={`w-full py-4 bg-brand-primary text-white font-black text-lg transition-all active:scale-[0.98] shadow-lg shadow-brand-primary/20 ${themeConfig.radius.lg}`}
                                >
                                    Shop Now
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
