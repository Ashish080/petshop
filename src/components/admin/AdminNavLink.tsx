'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = {
  href: string;
  label: string;
  icon: LucideIcon;
  accent: string;
};

export function AdminNavLink({ href, label, icon: Icon, accent }: Props) {
  const pathname = usePathname();
  const active =
    href === '/admin'
      ? pathname === '/admin'
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-xs font-semibold tracking-wide transition-colors ${
        active ? 'text-[var(--text-primary)]' : 'text-[var(--text-light)] hover:text-[var(--text-primary)]'
      }`}
      style={{
        background: active ? `color-mix(in srgb, ${accent} 12%, transparent)` : undefined,
      }}
    >
      {active && (
        <motion.span
          layoutId="admin-nav-pill"
          className="absolute inset-0 rounded-2xl border border-[color-mix(in_srgb,var(--card-border)_80%,transparent)] bg-[var(--card-bg)] shadow-sm"
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-3">
        <Icon size={20} style={{ color: active ? accent : undefined }} className={!active ? 'opacity-80' : ''} />
        {label}
      </span>
    </Link>
  );
}
