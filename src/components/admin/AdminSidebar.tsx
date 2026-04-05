'use client';

import Link from 'next/link';
import { Package, LayoutDashboard, ShoppingCart, ClipboardList, Sparkles } from 'lucide-react';
import { AdminNavLink } from '@/components/admin/AdminNavLink';

export function AdminSidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-[min(100%,19rem)] shrink-0 flex-col border-r border-[var(--card-border)] bg-[var(--card-bg)]/95 px-4 py-8 backdrop-blur-xl lg:w-72">
      <div className="mb-10 flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--primary)_16%,transparent)] text-lg font-bold text-[var(--primary)] shadow-inner">
          K
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-light)]">Operations</p>
          <p className="text-lg font-semibold tracking-tight">Control room</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto pb-6">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--text-light)]">
          Navigate
        </p>
        <AdminNavLink href="/admin" label="Overview" icon={LayoutDashboard} accent="#ff7a00" />
        <AdminNavLink href="/admin/inventory" label="Inventory" icon={Package} accent="#5eb8a8" />
        <AdminNavLink href="/admin/products" label="Catalog" icon={Sparkles} accent="#8ec5ff" />
        <AdminNavLink href="/admin/billing" label="Billing & GST" icon={ClipboardList} accent="#f59e0b" />
        <AdminNavLink href="/admin/orders" label="Orders" icon={ShoppingCart} accent="#22c55e" />
      </nav>

      <div className="border-t border-[var(--card-border)] pt-4">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--card-border)] px-4 py-3 text-xs font-semibold text-[var(--text-light)] transition-colors hover:border-[color-mix(in_srgb,var(--primary)_35%,transparent)] hover:text-[var(--primary)]"
        >
          ← Back to storefront
        </Link>
      </div>
    </aside>
  );
}
