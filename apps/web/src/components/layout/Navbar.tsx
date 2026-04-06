"use client";
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingCart, User, LayoutDashboard, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { brandConfig } from '@/config/brand';
import { navigationConfig } from '@/config/navigation';
import NightWalkToggle from '@/components/ui/NightWalkToggle';
import { useCartStore, useCartUIStore } from '@/store/cartStore';
import SearchModal from '@/components/layout/SearchModal';
import { Button } from '@/components/ui/Button';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { data: session, status } = useSession();
    const cartCount = useCartStore((s) => s.itemCount);
    const { openCart } = useCartUIStore();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = () => {
        if (!session) {
            toast.error('Login to access search', {
                style: {
                    background: 'var(--color-bg-elevated)',
                    color: 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-lg)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    border: '1px solid var(--color-border)',
                },
                icon: '🔒'
            });
            router.push('/auth/login?callbackUrl=/products');
            return;
        }
        setIsSearchOpen(true);
    };

    const navLabel = useMemo(() => {
        if (status !== 'authenticated' || !session?.user) return null;
        const raw = session.user.name?.trim() || session.user.email?.split('@')[0] || 'Account';
        return raw.charAt(0).toUpperCase() + raw.slice(1);
    }, [status, session?.user]);

    return (
        <nav className="bg-bg-primary/80 backdrop-blur-xl sticky top-0 z-50 shadow-xs border-b border-border transition-all duration-[--duration-fast]">
            <div className="container-app">
                <div className="flex justify-between items-center h-16 md:h-18 gap-4">
                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <span className="text-h4 text-brand tracking-tight">
                                {mounted ? brandConfig.name : 'Kanha Pet Shop & Care'}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center gap-x-6 xl:gap-x-8">
                        {navigationConfig.mainNav.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="text-label-lg text-text-secondary hover:text-text-primary transition-colors duration-[--duration-fast] whitespace-nowrap"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-x-2 md:gap-x-3">
                        {/* Search */}
                        <button 
                            onClick={handleSearch}
                            className="p-2 text-text-secondary hover:text-text-primary transition-colors group"
                            aria-label="Search items"
                        >
                            <Search size={20} className="group-hover:scale-105 transition-transform" />
                        </button>

                        {/* Theme Toggle */}
                        <NightWalkToggle />

                        {/* Auth */}
                        {status === 'authenticated' ? (
                            <Link
                                href={session.user.role === 'admin' ? '/admin' : session.user.role === 'rider' ? '/rider' : '/dashboard'} 
                                className="flex items-center gap-2 py-2 px-4 bg-brand-muted rounded-[--radius-full] text-brand hover:bg-brand/10 transition-all border border-brand/10 group"
                                aria-label="Dashboard"
                            >
                                <LayoutDashboard size={16} />
                                <span className="text-label-sm uppercase tracking-wider hidden sm:inline">
                                    {navLabel || 'Dashboard'}
                                </span>
                            </Link>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="flex items-center gap-2 py-2 px-4 bg-text-primary text-text-inverse rounded-[--radius-full] hover:opacity-90 transition-all group shadow-xs"
                                aria-label="Sign in"
                            >
                                <User size={16} className="group-hover:scale-105 transition-transform" />
                                <span className="text-label-sm uppercase tracking-wider hidden sm:inline">Login</span>
                            </Link>
                        )}

                        {/* Cart */}
                        <button
                            onClick={openCart}
                            className="p-2 text-text-secondary hover:text-text-primary transition-colors relative"
                            aria-label="Shopping cart"
                        >
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-1 flex items-center justify-center text-white rounded-full bg-brand text-[10px] font-semibold border-2 border-bg-primary">
                                    {cartCount > 99 ? '99+' : cartCount}
                                </span>
                            )}
                        </button>

                        {/* CTA Button — Desktop */}
                        <div className="hidden md:block">
                            <Link href="/products">
                                <Button variant="brand" size="sm">
                                    Explore Shop
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="flex items-center lg:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-[--radius-md] text-text-primary transition-transform active:scale-90"
                                aria-expanded={isOpen}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="lg:hidden bg-bg-primary/95 backdrop-blur-xl border-t border-border shadow-lg animate-slide-up">
                    <div className="px-6 pt-6 pb-8 space-y-2">
                        {navigationConfig.mainNav.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3.5 rounded-[--radius-lg] text-h5 text-text-primary hover:bg-bg-secondary transition-colors"
                            >
                                {item.title}
                            </Link>
                        ))}

                        {navLabel && (
                            <Link
                                href="/admin"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3.5 rounded-[--radius-lg] text-h5 text-brand bg-brand-muted border border-brand/10 transition-colors"
                            >
                                Dashboard ({navLabel})
                            </Link>
                        )}
                        {!navLabel && (
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3.5 rounded-[--radius-lg] text-h5 text-text-primary hover:bg-bg-secondary transition-colors"
                            >
                                Sign in
                            </Link>
                        )}

                        <div className="pt-6">
                            <Link href="/products" onClick={() => setIsOpen(false)}>
                                <Button variant="brand" size="lg" fullWidth>
                                    Explore Shop
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <SearchModal 
                isOpen={isSearchOpen} 
                onClose={() => setIsSearchOpen(false)} 
            />
        </nav>
    );
}
