import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { brandConfig } from '@/config/brand';
import { navigationConfig } from '@/config/navigation';
import { siteContent } from '@/config/site-content';

export default function Footer() {
  const { footer } = siteContent;

  return (
    <footer className="mt-auto border-t border-border bg-bg-primary/90">
      <div className="container-app py-14 md:py-16">
        <div className="mb-12 grid gap-10 md:grid-cols-2 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-h2 tracking-tight text-brand">{brandConfig.name}</span>
            </Link>
            <p className="mt-4 max-w-sm text-body-sm leading-relaxed text-text-secondary">{brandConfig.description}</p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href={brandConfig.socialLinks.facebook}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-tertiary text-text-tertiary transition-all hover:border-brand/30 hover:text-brand"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href={brandConfig.socialLinks.instagram}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-tertiary text-text-tertiary transition-all hover:border-brand/30 hover:text-brand"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={brandConfig.socialLinks.twitter}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-tertiary text-text-tertiary transition-all hover:border-brand/30 hover:text-brand"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          <div className="xl:col-span-2">
            <h3 className="text-label-sm uppercase tracking-[0.12em] text-text-primary">Shop</h3>
            <ul className="mt-4 space-y-2.5">
              {navigationConfig.footerNav.shop.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="text-body-sm text-text-secondary transition-colors hover:text-brand">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="xl:col-span-2">
            <h3 className="text-label-sm uppercase tracking-[0.12em] text-text-primary">Services</h3>
            <ul className="mt-4 space-y-2.5">
              {navigationConfig.footerNav.services.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="text-body-sm text-text-secondary transition-colors hover:text-brand">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="xl:col-span-2">
            <h3 className="text-label-sm uppercase tracking-[0.12em] text-text-primary">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5 text-body-sm text-text-secondary">
                <MapPin size={14} className="mt-0.5 shrink-0 text-brand" />
                <span>{brandConfig.address}</span>
              </li>
              <li className="flex items-start gap-2.5 text-body-sm text-text-secondary">
                <Phone size={14} className="mt-0.5 shrink-0 text-brand" />
                <span>{brandConfig.phone}</span>
              </li>
              <li className="flex items-start gap-2.5 text-body-sm text-text-secondary">
                <Mail size={14} className="mt-0.5 shrink-0 text-brand" />
                <span>{brandConfig.email}</span>
              </li>
            </ul>
          </div>

          <div className="xl:col-span-2">
            <h3 className="text-label-sm uppercase tracking-[0.12em] text-text-primary">Portals</h3>
            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                href="/rider/auth/signup"
                className="inline-flex items-center justify-center rounded-[--radius-lg] border border-accent/25 bg-accent-muted px-3 py-2 text-label-sm font-semibold text-accent transition-colors hover:bg-accent/15"
              >
                Join as rider
              </Link>
              <Link
                href="/admin/login"
                className="inline-flex items-center justify-center rounded-[--radius-lg] border border-brand/25 bg-brand-muted px-3 py-2 text-label-sm font-semibold text-brand transition-colors hover:bg-brand/15"
              >
                Admin panel
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-body-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} {brandConfig.name}. {footer.copyright}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {navigationConfig.footerNav.legal.map((item) => (
              <Link key={item.title} href={item.href} className="text-body-xs text-text-tertiary transition-colors hover:text-brand">
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
