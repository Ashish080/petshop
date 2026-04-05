'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Package, Search, AlertTriangle, Pencil } from 'lucide-react';
import type { Product } from '@/types';
import { useCountUp } from '@/components/motion/useCountUp';

function InventoryContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'admin')) {
      router.push('/auth/login');
    } else if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchProducts();
    }
  }, [status, session, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id: string, stock: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock }),
      });

      const data = await res.json();
      if (res.ok && data.product) {
        fetchProducts();
        setEditingId(null);
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = showLowStockOnly ? p.isLowStock : true;
    return matchesSearch && matchesStock;
  });

  const stats = {
    total: products.length,
    lowStock: products.filter((p) => p.isLowStock).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  };

  const totalAnimated = useCountUp(stats.total, 900, 0, 0);
  const lowAnimated = useCountUp(stats.lowStock, 900, 0, 0);
  const outAnimated = useCountUp(stats.outOfStock, 900, 0, 0);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
        <p className="text-caption font-semibold uppercase tracking-[0.2em] text-[var(--text-light)]">Loading inventory…</p>
      </div>
    );
  }

  return (
    <div className="space-y-[var(--space-f34)]">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-2 text-caption font-semibold uppercase tracking-[0.2em] text-[var(--text-light)]">Stock intelligence</p>
        <h1 className="text-h2 text-[var(--text-primary)]">Inventory</h1>
        <p className="mt-2 max-w-2xl text-[var(--text-light)]">
          Threshold-aware rows, low-stock pulse, and inline edits — tuned for fast ops.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 gap-[var(--space-f21)] md:grid-cols-3">
        {[
          { label: 'Total SKUs', value: totalAnimated, tone: 'text-[var(--text-primary)]' },
          { label: 'Low stock', value: lowAnimated, tone: 'text-amber-600 dark:text-amber-400' },
          { label: 'Out of stock', value: outAnimated, tone: 'text-red-600 dark:text-red-400' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="rounded-[var(--space-f21)] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-[0_18px_50px_-28px_rgba(15,18,24,0.1)]"
          >
            <p className="text-caption font-semibold uppercase tracking-[0.14em] text-[var(--text-light)]">{s.label}</p>
            <p className={`mt-2 text-4xl font-semibold tracking-tight ${s.tone}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="rounded-[var(--space-f21)] border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--text-light)]" />
            <Input
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <motion.button
            type="button"
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-colors ${
              showLowStockOnly
                ? 'bg-amber-500/15 text-amber-800 ring-2 ring-amber-500/30 dark:text-amber-200'
                : 'bg-[var(--bg-page)] text-[var(--text-primary)] ring-1 ring-[var(--card-border)]'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AlertTriangle className="h-4 w-4" />
            Low stock only
          </motion.button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[var(--space-f21)] border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[0_24px_60px_-30px_rgba(15,18,24,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-[var(--card-border)] bg-[var(--bg-page)]/80 text-left">
                <th className="px-6 py-4 text-caption font-semibold uppercase tracking-[0.12em] text-[var(--text-light)]">Product</th>
                <th className="px-6 py-4 text-caption font-semibold uppercase tracking-[0.12em] text-[var(--text-light)]">Category</th>
                <th className="px-6 py-4 text-caption font-semibold uppercase tracking-[0.12em] text-[var(--text-light)]">Stock</th>
                <th className="px-6 py-4 text-caption font-semibold uppercase tracking-[0.12em] text-[var(--text-light)]">Threshold</th>
                <th className="px-6 py-4 text-caption font-semibold uppercase tracking-[0.12em] text-[var(--text-light)]">Status</th>
                <th className="px-6 py-4 text-right text-caption font-semibold uppercase tracking-[0.12em] text-[var(--text-light)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--card-border)]">
              <AnimatePresence initial={false}>
                {filteredProducts.map((product) => {
                  const low = product.isLowStock;
                  const dead = product.stock === 0;
                  return (
                    <motion.tr
                      key={product._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`transition-colors hover:bg-[var(--bg-page)]/70 ${
                        low && !dead ? 'pulse-stock bg-amber-500/[0.06]' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 shrink-0 text-[var(--text-light)]" />
                          <div>
                            <p className="font-semibold text-[var(--text-primary)]">{product.name}</p>
                            {product.variants.length > 0 && (
                              <p className="text-xs text-[var(--text-light)]">{product.variants.length} variants</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="primary" className="capitalize">
                          {product.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === product._id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(parseInt(e.target.value, 10) || 0)}
                              className="w-24"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => updateStock(product._id, editStock)}
                              className="rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`font-semibold ${
                              dead ? 'text-red-600' : low ? 'text-amber-600' : 'text-emerald-600'
                            }`}
                          >
                            {product.stock}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--text-light)]">{product.lowStockThreshold}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={dead ? 'danger' : low ? 'warning' : 'success'}
                        >
                          {dead ? 'Out of stock' : low ? 'Low stock' : 'In stock'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingId !== product._id && (
                          <motion.button
                            type="button"
                            onClick={() => {
                              setEditingId(product._id);
                              setEditStock(product.stock);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(255,122,0,0.5)]"
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Update
                          </motion.button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminInventoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
        </div>
      }
    >
      <InventoryContent />
    </Suspense>
  );
}
