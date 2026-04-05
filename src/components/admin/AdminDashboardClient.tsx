'use client';

import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Bell,
  PlusCircle,
  ArrowUpRight,
  Search,
  ExternalLink,
  TrendingUp,
  Users,
  Package,
  ClipboardList,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { StatsChart } from '@/components/admin/StatsChart';
import { useCountUp } from '@/components/motion/useCountUp';
import type { AdminStats, Order } from '@/types';

function formatCurrency(num: number) {
  return `₹${Number(num || 0).toLocaleString('en-IN')}`;
}

function MetricCard({
  label,
  value,
  trend,
  color,
  bg,
  icon: Icon,
  delay,
}: {
  label: string;
  value: string | number;
  trend: string;
  color: string;
  bg: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 21 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-52 flex-col justify-between overflow-hidden rounded-[var(--space-f21)] border border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-[0_20px_50px_-28px_rgba(15,18,24,0.12)]"
    >
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${bg} blur-2xl transition-transform group-hover:scale-125`} />
      <div className="relative z-10 flex items-start justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-light)]">{label}</h3>
        <Icon size={22} className={color} />
      </div>
      <div className="relative z-10 mt-4">
        <p className={`mb-2 text-4xl font-semibold tracking-tight ${color}`}>{value}</p>
        <div className="flex items-center gap-1.5 border-t border-[var(--card-border)] pt-2">
          <ArrowUpRight size={14} className={color} strokeWidth={3} />
          <p className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-light)]">{trend}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function AdminDashboardClient() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Order', msg: 'Order #INV-2410 just arrived', time: '2 mins ago', read: false },
    { id: 2, title: 'Low Stock', msg: 'Royal Canin is below limit', time: '1 hour ago', read: false },
    { id: 3, title: 'Customer Query', msg: 'Rahul Verma sent a message', time: '3 hours ago', read: true },
  ]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const revenueDisplay = stats ? formatCurrency(stats.totalRevenue) : formatCurrency(1245000);
  const productsEnd = stats?.totalProducts ?? 48;
  const ordersEnd = stats?.totalOrders ?? 112;
  const customersEnd = stats?.totalCustomers ?? 850;

  const productsCount = useCountUp(productsEnd, 1100, 0, 0);
  const ordersCount = useCountUp(ordersEnd, 1100, 0, 0);
  const customersCount = useCountUp(customersEnd, 1100, 0, 0);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
        <p className="text-caption font-semibold uppercase tracking-[0.2em] text-[var(--text-light)]">
          Syncing workspace…
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-[var(--space-f34)]">
      <motion.header
        initial={{ opacity: 0, y: 21 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <p className="mb-2 text-caption font-semibold uppercase tracking-[0.2em] text-[var(--text-light)]">
            Live operations
          </p>
          <h1 className="text-h2 text-[var(--text-primary)]">Command overview</h1>
          <p className="mt-2 max-w-xl text-[var(--text-light)]">Revenue, care traffic, and fulfillment in one calm surface.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 text-[var(--text-light)] transition-all hover:border-[color-mix(in_srgb,var(--primary)_35%,transparent)] hover:text-[var(--primary)] ${
                showNotifications ? 'ring-2 ring-[color-mix(in_srgb,var(--primary)_25%,transparent)]' : ''
              }`}
            >
              <Bell size={22} />
              {notifications.some((n) => !n.read) && (
                <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-[var(--card-bg)] bg-red-500 shadow animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 z-50 mt-3 w-[min(100vw-2rem,24rem)] overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-[var(--card-border)] bg-[var(--bg-page)]/80 px-5 py-4">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-light)]">Inbox</h4>
                  <button
                    type="button"
                    onClick={() => setNotifications((n) => n.map((i) => ({ ...i, read: true })))}
                    className="text-[10px] font-semibold uppercase tracking-widest text-[var(--primary)] hover:underline"
                  >
                    Mark read
                  </button>
                </div>
                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`cursor-pointer border-b border-[var(--card-border)] px-5 py-4 transition-colors hover:bg-[var(--bg-page)] ${
                        !n.read ? 'bg-[color-mix(in_srgb,var(--primary)_6%,transparent)]' : ''
                      }`}
                    >
                      <div className="mb-1 flex justify-between gap-2">
                        <h5 className="text-sm font-semibold text-[var(--text-primary)]">{n.title}</h5>
                        <span className="shrink-0 text-[10px] font-medium uppercase text-[var(--text-light)]">{n.time}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-[var(--text-light)]">{n.msg}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/admin/orders"
                  className="block border-t border-[var(--card-border)] bg-[var(--bg-page)]/50 px-5 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-light)] hover:text-[var(--primary)]"
                >
                  Open orders
                </Link>
              </motion.div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_18px_40px_-14px_rgba(255,122,0,0.55)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <PlusCircle size={22} strokeWidth={2.5} />
              Quick actions
            </button>

            {showQuickActions && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-2 shadow-2xl"
              >
                <Link
                  href="/admin/billing"
                  className="flex items-center gap-3 rounded-2xl p-4 transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_8%,transparent)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[var(--primary)]">
                    <ClipboardList size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold">New invoice</h5>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-light)]">Billing</p>
                  </div>
                </Link>
                <Link
                  href="/admin/inventory"
                  className="flex items-center gap-3 rounded-2xl p-4 transition-colors hover:bg-[color-mix(in_srgb,var(--secondary)_10%,transparent)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--secondary)_14%,transparent)] text-[var(--secondary)]">
                    <Package size={20} />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold">Stock</h5>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-[var(--text-light)]">Inventory</p>
                  </div>
                </Link>
                <div className="my-2 mx-3 border-t border-[var(--card-border)]" />
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-light)] hover:text-[var(--primary)]"
                >
                  <ExternalLink size={16} /> Storefront
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 13 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45 }}
        className="rounded-[var(--space-f34)] border border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-[0_24px_60px_-30px_rgba(15,18,24,0.15)]"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="text-h3 text-[var(--text-primary)]">Throughput pulse</h3>
            <p className="mt-1 text-sm text-[var(--text-light)]">Last 7 intervals · animated entry</p>
          </div>
          <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.14em] text-[var(--text-light)]">
            <Search size={14} /> Trend
          </div>
        </div>
        <StatsChart />
      </motion.section>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total revenue"
          value={revenueDisplay}
          trend="+14.2% vs last month"
          color="text-[var(--primary)]"
          bg="bg-[color-mix(in_srgb,var(--primary)_18%,transparent)]"
          icon={TrendingUp}
          delay={0}
        />
        <MetricCard
          label="Active SKUs"
          value={productsCount}
          trend="+2 new vs last month"
          color="text-[var(--secondary)]"
          bg="bg-[color-mix(in_srgb,var(--secondary)_18%,transparent)]"
          icon={Package}
          delay={0.06}
        />
        <MetricCard
          label="Orders"
          value={ordersCount}
          trend="+5 today"
          color="text-amber-500"
          bg="bg-amber-500/15"
          icon={ShoppingBag}
          delay={0.12}
        />
        <MetricCard
          label="Customers"
          value={customersCount}
          trend="+12% vs last month"
          color="text-emerald-500"
          bg="bg-emerald-500/15"
          icon={Users}
          delay={0.18}
        />
      </div>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <div className="rounded-[var(--space-f34)] border border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-[0_24px_60px_-30px_rgba(15,18,24,0.12)]">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h3 className="text-h3 flex items-center gap-2 text-[var(--text-primary)]">
                <ClipboardList className="text-[var(--primary)]" size={22} /> Recent orders
              </h3>
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--primary)] hover:underline"
              >
                View all <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--card-border)] text-left">
                    <th className="pb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-light)]">Order</th>
                    <th className="pb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-light)]">Customer</th>
                    <th className="pb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-light)]">Total / status</th>
                    <th className="pb-4 text-right text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-light)]">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)]">
                  {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map((order: Order) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-[var(--bg-page)]/80"
                      >
                        <td className="py-5">
                          <div className="text-sm font-semibold text-[var(--text-primary)]">
                            {order.orderNumber || `#${order._id.slice(-8).toUpperCase()}`}
                          </div>
                          <div className="mt-1 text-[9px] font-medium uppercase tracking-widest text-[var(--text-light)]">
                            Ref {order._id.slice(-6)}
                          </div>
                        </td>
                        <td className="py-5">
                          <div className="text-xs font-medium text-[var(--text-primary)]">
                            {(typeof order.user === 'object' && order.user?.name) || 'Walk-in guest'}
                          </div>
                          <div className="text-[10px] text-[var(--text-light)]">
                            {(typeof order.user === 'object' && order.user?.email) || '—'}
                          </div>
                        </td>
                        <td className="py-5">
                          <div className="text-sm font-semibold text-[var(--text-primary)]">{formatCurrency(order.total)}</div>
                          <span
                            className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest ${
                              order.paymentStatus === 'paid' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 text-red-600'
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-5 text-right">
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-light)]">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </div>
                          <div className="text-[9px] text-[var(--text-light)]">
                            {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-16 text-center">
                        <Clock className="mx-auto mb-3 h-10 w-10 opacity-20" />
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-light)]">No orders yet</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8 xl:col-span-4">
          <div className="relative overflow-hidden rounded-[var(--space-f34)] bg-[#12151c] p-8 text-white shadow-2xl">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <h3 className="relative z-10 mb-6 text-lg font-semibold">Team</h3>
            <div className="relative z-10 space-y-4">
              {[
                { name: 'Kanha Admin', status: 'Commander', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' },
                { name: 'Bot Service', status: 'Autopilot', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop' },
              ].map((staff, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/15">
                    <Image src={staff.img} alt="" fill className="object-cover" sizes="48px" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{staff.name}</h4>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">{staff.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[var(--space-f34)] border border-[var(--card-border)] bg-[var(--card-bg)] p-8 shadow-lg">
            <h3 className="mb-6 text-lg font-semibold text-[var(--text-primary)]">Service health</h3>
            <div className="space-y-6">
              <div>
                <div className="mb-2 flex justify-between text-[10px] font-semibold uppercase tracking-widest text-[var(--text-light)]">
                  <span>Load</span>
                  <span>24%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[var(--bg-page)]">
                  <motion.div
                    className="h-full rounded-full bg-emerald-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: '24%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-[10px] font-semibold uppercase tracking-widest text-[var(--text-light)]">
                  <span>DB latency</span>
                  <span>Stable</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[var(--bg-page)]">
                  <motion.div
                    className="h-full rounded-full bg-[var(--primary)]"
                    initial={{ width: 0 }}
                    whileInView={{ width: '99%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-2 border-t border-[var(--card-border)] pt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-600">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              Environment stable
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
