"use client";
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User, LayoutDashboard, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { brandConfig } from '@/config/brand';
import { navigationConfig } from '@/config/navigation';
import NightWalkToggle from '@/components/ui/NightWalkToggle';
import { useCartStore } from '@/store/cartStore';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();
  const cartCount = useCartStore((s) => s.itemCount);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => setScrolled(v > 20));
    return () => unsub();
  }, [scrollY]);

  const immersiveAuth =
    pathname === '/auth/login' || pathname === '/auth/register';
  if (immersiveAuth) return null;

  const navLabel = useMemo(() => {
    if (status !== 'authenticated' || !session?.user) return null;
    const raw = session.user.name?.trim() || session.user.email?.split('@')[0] || 'Account';
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [status, session?.user]);

  return (
    <>
      <motion.nav
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-[color-mix(in_srgb,var(--card-border)_60%,transparent)] bg-[var(--nav-bg)] shadow-[0_8px_40px_-18px_rgba(15,18,24,0.18)] backdrop-blur-2xl'
            : 'border-b border-transparent bg-transparent'
        }`}
        initial={false}
      >
        {/* Animated gradient line when scrolled */}
        <motion.div
          className="absolute bottom-0 left-0 h-[1px] w-full origin-left"
          style={{
            background: 'linear-gradient(90deg, var(--primary), var(--secondary), var(--accent), transparent)',
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: scrolled ? 1 : 0, opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="mx-auto max-w-[110rem] px-[var(--space-f21)]">
          <div className="flex h-[4.75rem] items-center justify-between gap-4">

            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2.5 shrink-0">
              <motion.span
                className="relative flex h-10 w-10 items-center justify-center rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[#e86800]" />
                <span className="relative text-sm font-black text-white">K</span>
              </motion.span>
              <span className="text-xl font-semibold tracking-tight text-[var(--text-primary)] md:text-2xl">
                {brandConfig.name}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-x-1 xl:gap-x-2">
              {navigationConfig.mainNav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`relative whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'text-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]'
                        : 'text-[var(--text-body)] hover:text-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary)_6%,transparent)]'
                    }`}
                  >
                    {item.title}
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] -z-10"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-x-2 md:gap-x-3">
              <NightWalkToggle />

              {navLabel ? (
                <Link
                  href="/dashboard"
                  className="group hidden sm:flex items-center gap-2 py-2 px-3.5 bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] rounded-full text-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary)_18%,transparent)] transition-all"
                  aria-label="Go to Dashboard"
                >
                  <LayoutDashboard size={17} className="group-hover:rotate-12 transition-transform duration-300" />
                  <span className="hidden md:inline font-semibold text-xs uppercase tracking-widest">
                    {navLabel}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden sm:flex p-2 text-[var(--text-body)] hover:text-[var(--primary)] transition-colors"
                  aria-label="Sign in"
                >
                  <User size={20} />
                </Link>
              )}

              <Link
                href="/cart"
                className="relative p-2 text-[var(--text-body)] hover:text-[var(--primary)] transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={22} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-0.5 flex items-center justify-center text-white rounded-full bg-[var(--primary)] text-[9px] font-black"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <div className="hidden md:block">
                <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_-10px_rgba(255,122,0,0.6)] transition-shadow hover:shadow-[0_14px_34px_-8px_rgba(255,122,0,0.7)]"
                  >
                    <Sparkles size={14} aria-hidden />
                    Shop Now
                  </Link>
                </motion.div>
              </div>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-xl text-[var(--text-body)] hover:text-[var(--primary)] hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] transition-all"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {isOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden border-t border-[color-mix(in_srgb,var(--card-border)_60%,transparent)] bg-[var(--nav-bg)] backdrop-blur-2xl"
            >
              <div className="px-[var(--space-f21)] pt-4 pb-6 space-y-1">
                {navigationConfig.mainNav.map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        pathname === item.href
                          ? 'text-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]'
                          : 'text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] hover:text-[var(--primary)]'
                      }`}
                    >
                      {item.title}
                    </Link>
                  </motion.div>
                ))}

                {navLabel ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]"
                  >
                    My Dashboard ({navLabel})
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--primary)_6%,transparent)]"
                  >
                    Sign in
                  </Link>
                )}

                <div className="pt-4">
                  <Link href="/products" onClick={() => setIsOpen(false)}>
                    <button className="w-full py-3.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-base shadow-[0_10px_28px_-10px_rgba(255,122,0,0.5)]">
                      Shop Now
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
