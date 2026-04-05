"use client";
import { useState, useMemo, useEffect } from 'react';
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
    const [mounted, setMounted] = useState(false);
    const { data: session, status } = useSession();
    const cartCount = useCartStore((s) => s.itemCount);

    useEffect(() => {
        setMounted(true);
    }, []);

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
                                {mounted ? brandConfig.name : 'Kanha Pet Shop & Care'}
                            </span>
                        </Link>
                    </div>

                    <div className="hidden lg:flex items-center gap-x-6 xl:gap-x-8">
                        {navigationConfig.mainNav.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="font-bold text-sm xl:text-base transition-colors text-text-primary hover:text-brand-primary whitespace-nowrap"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-x-3 md:gap-x-4">
                        <div className="flex items-center gap-x-1 sm:gap-x-3">
                            <NightWalkToggle />
                            {navLabel ? (
                                <Link href="/admin" className="flex items-center gap-2 py-2 px-4 bg-brand-primary/10 rounded-full text-brand-primary hover:bg-brand-primary/20 transition-all group" aria-label="Go to Dashboard">
                                    <LayoutDashboard size={18} className="group-hover:rotate-12 transition-transform" />
                                    <span className="hidden sm:inline font-black text-xs uppercase tracking-widest">Dashboard ({navLabel})</span>
                                </Link>
                            ) : (
                                <Link href="/login" className="p-2 text-text-primary hover:text-brand-primary transition-colors hidden sm:block" aria-label="Sign in">
                                    <User size={22} />
                                </Link>
                            )}
                            <Link
                                href="/cart"
                                className="p-2 text-text-primary hover:text-brand-primary transition-colors relative"
                                aria-label="Shopping cart"
                            >
                                <ShoppingCart size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute top-1 right-1 min-w-[1.2rem] h-5 px-1 flex items-center justify-center text-white rounded-full bg-brand-primary text-[10px] font-black border-2 border-white dark:border-zinc-900 shadow-sm">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>

                        <div className="hidden md:block">
                            <Link href="/products">
                                <button
                                    className={`px-4 xl:px-8 py-3 bg-zinc-900 text-white font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1 hover:shadow-xl active:scale-95 whitespace-nowrap ${themeConfig.radius.full}`}
                                >
                                    Explore Shop
                                </button>
                            </Link>
                        </div>

                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-xl focus:outline-none text-zinc-900 transition-transform active:scale-90"
                                aria-expanded={isOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? <X size={26} aria-hidden="true" /> : <Menu size={26} aria-hidden="true" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-3xl border-t border-zinc-100 shadow-2xl animate-in slide-in-from-top duration-300">
                    <div className="px-6 pt-6 pb-10 space-y-3">
                        {navigationConfig.mainNav.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-4 rounded-2xl text-xl font-black text-zinc-900 hover:bg-zinc-50 transition-colors"
                            >
                                {item.title}
                            </Link>
                        ))}

                        {navLabel && (
                            <Link
                                href="/admin"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-4 rounded-2xl text-xl font-black text-brand-primary bg-brand-primary/5 border border-brand-primary/10 transition-colors"
                            >
                                Dashboard ({navLabel})
                            </Link>
                        )}
                        {!navLabel && (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-4 rounded-2xl text-xl font-black text-zinc-900 hover:bg-zinc-50 transition-colors"
                            >
                                Sign in
                            </Link>
                        )}

                        <div className="pt-8">
                            <Link href="/products" onClick={() => setIsOpen(false)}>
                                <button
                                    className={`w-full py-5 bg-zinc-900 text-white font-black text-xl transition-all active:scale-[0.98] shadow-2xl shadow-zinc-900/20 ${themeConfig.radius.lg}`}
                                >
                                    Explore Shop ⚡
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
