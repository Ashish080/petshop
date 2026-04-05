'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { brandConfig } from '@/config/brand';
import { navigationConfig } from '@/config/navigation';
import { siteContent } from '@/config/site-content';

export default function Footer() {
  const pathname = usePathname();
  const { footer } = siteContent;

  if (pathname === '/auth/login' || pathname === '/auth/register') {
    return null;
  }

  const socialLinks = [
    { href: brandConfig.socialLinks.facebook, label: 'Facebook', icon: Facebook, color: '#1877f2' },
    { href: brandConfig.socialLinks.instagram, label: 'Instagram', icon: Instagram, color: '#e1306c' },
    { href: brandConfig.socialLinks.twitter, label: 'Twitter', icon: Twitter, color: '#1da1f2' },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[var(--card-border)] bg-[var(--bg-page)]" aria-label="Site footer">
      {/* Subtle gradient at top */}
      <div aria-hidden className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/30 to-transparent" />
      
      {/* Background blob */}
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-[color-mix(in_srgb,var(--primary)_4%,transparent)] blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[110rem] px-[var(--space-f21)]">
        {/* CTA band */}
        <div className="py-[var(--space-f34)] border-b border-[var(--card-border)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-h3 mb-2 text-[var(--text-primary)]">Ready to find your perfect companion?</h3>
              <p className="text-[var(--text-light)]">Visit us in Lucknow or browse online — we're here for you.</p>
            </div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/pets"
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_-10px_rgba(255,122,0,0.55)] whitespace-nowrap"
              >
                Explore pets <ArrowUpRight size={16} aria-hidden />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-1 gap-[var(--space-f34)] py-[var(--space-f34)] md:grid-cols-2 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="group mb-[var(--space-f21)] inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[#e86800] text-sm font-black text-white">
                K
              </span>
              <span className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
                {brandConfig.name}
              </span>
            </Link>
            <p className="mb-[var(--space-f21)] max-w-xs text-sm leading-relaxed text-[var(--text-light)]">
              {brandConfig.description}
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ href, label, icon: Icon, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-light)] transition-all"
                  whileHover={{ y: -2, borderColor: color + '50', color: color }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} aria-hidden />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-light)]">Shop</h3>
            <ul className="space-y-3">
              {navigationConfig.footerNav.shop.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--text-light)] transition-colors hover:text-[var(--primary)]"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-light)]">Services</h3>
            <ul className="space-y-3">
              {navigationConfig.footerNav.services.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--text-light)] transition-colors hover:text-[var(--primary)]"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-light)]">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)]">
                  <MapPin size={15} aria-hidden />
                </div>
                <span className="text-sm leading-relaxed text-[var(--text-light)]">{brandConfig.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--secondary)_12%,transparent)] text-[var(--secondary)]">
                  <Phone size={15} aria-hidden />
                </div>
                <a href={`tel:${brandConfig.phone}`} className="text-sm text-[var(--text-light)] hover:text-[var(--primary)] transition-colors">
                  {brandConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent)]">
                  <Mail size={15} aria-hidden />
                </div>
                <a href={`mailto:${brandConfig.email}`} className="text-sm text-[var(--text-light)] hover:text-[var(--primary)] transition-colors">
                  {brandConfig.email}
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-light)] transition-colors hover:border-[color-mix(in_srgb,var(--primary)_35%,transparent)] hover:text-[var(--primary)]"
              >
                🔐 Admin panel
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-[var(--card-border)] py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-caption text-[var(--text-light)]">
            © {new Date().getFullYear()} {brandConfig.name}. {footer.copyright}
          </p>
          <div className="flex gap-6">
            {navigationConfig.footerNav.legal.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="text-caption text-[var(--text-light)] hover:text-[var(--primary)] transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
