'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Order } from '@/types';

const STATUS_OPTIONS = [
  'pending',
  'placed',
  'confirmed',
  'processing',
  'accepted',
  'picked',
  'out-for-delivery',
  'shipped',
  'delivered',
  'cancelled',
] as const;

type RiderOption = {
  _id: string;
  name: string;
  email: string;
};

function OrdersContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [riders, setRiders] = useState<RiderOption[]>([]);
  const [assigningLoading, setAssigningLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();
      if (data.success) setOrders(data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const fetchRiders = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/riders');
      const data = await response.json();
      if (data.success) setRiders(data.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'admin')) {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role === 'admin') {
      setLoading(true);
      fetchOrders();
      fetchRiders();
    }
  }, [fetchOrders, fetchRiders, router, session, status]);

  const orderTotal = (order: Order) => order.total ?? order.totalPrice ?? 0;

  const customerLine = (order: Order) => {
    const user = order.user;
    if (typeof user === 'object' && user !== null && 'email' in user) {
      return { primary: user.name || user.email || 'Customer', secondary: user.email ?? '' };
    }
    return { primary: 'Customer', secondary: typeof user === 'string' ? user : '' };
  };

  const assignRider = async (orderId: string, riderId: string) => {
    setAssigningLoading(true);
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, riderId }),
      });

      if (response.ok) {
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAssigningLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, orderStatus: newStatus }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setOrders((previous) =>
          previous.map((order) =>
            order._id === orderId ? { ...order, ...data.data, orderStatus: newStatus as Order['orderStatus'] } : order
          )
        );
        setSelectedOrder((selected) =>
          selected && selected._id === orderId
            ? { ...selected, ...data.data, orderStatus: newStatus as Order['orderStatus'] }
            : selected
        );
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = searchQuery.trim().toLowerCase();
      if (!query) return true;
      const { primary, secondary } = customerLine(order);

      return (
        order._id.toLowerCase().includes(query) ||
        (order.orderNumber?.toLowerCase().includes(query) ?? false) ||
        primary.toLowerCase().includes(query) ||
        secondary.toLowerCase().includes(query)
      );
    });
  }, [orders, searchQuery]);

  const stats = useMemo(() => {
    const pendingCount = filteredOrders.filter((order) =>
      ['pending', 'placed', 'confirmed', 'processing'].includes(order.orderStatus)
    ).length;
    const deliveredCount = filteredOrders.filter((order) => order.orderStatus === 'delivered').length;
    const revenue = filteredOrders.reduce((sum, order) => sum + orderTotal(order), 0);
    return { pendingCount, deliveredCount, revenue };
  }, [filteredOrders]);

  const getStatusBadge = (orderStatus: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'brand'> = {
      pending: 'warning',
      placed: 'info',
      confirmed: 'info',
      processing: 'accent',
      accepted: 'brand',
      picked: 'brand',
      'out-for-delivery': 'brand',
      shipped: 'brand',
      delivered: 'success',
      cancelled: 'danger',
    };
    return <Badge variant={variants[orderStatus] || 'default'}>{orderStatus.replaceAll('-', ' ')}</Badge>;
  };

  return (
    <div className="relative overflow-hidden pb-10">
      <div className="pointer-events-none absolute inset-0 hero-aurora opacity-45" />

      <div className="relative z-10">
        <div className="mb-6">
          <h1 className="text-h1 font-black tracking-tight text-text-primary">Orders Control</h1>
          <p className="mt-1 text-body text-text-secondary">Track, assign, and close deliveries.</p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[--radius-xl] border border-border bg-bg-elevated/80 p-4 backdrop-blur">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-text-tertiary">Visible</p>
            <p className="mt-1 text-h3 font-black text-text-primary">{filteredOrders.length}</p>
          </div>
          <div className="rounded-[--radius-xl] border border-border bg-bg-elevated/80 p-4 backdrop-blur">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-text-tertiary">Pending</p>
            <p className="mt-1 text-h3 font-black text-warning">{stats.pendingCount}</p>
          </div>
          <div className="rounded-[--radius-xl] border border-border bg-bg-elevated/80 p-4 backdrop-blur">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-text-tertiary">Delivered</p>
            <p className="mt-1 text-h3 font-black text-success">{stats.deliveredCount}</p>
          </div>
          <div className="rounded-[--radius-xl] border border-border bg-bg-elevated/80 p-4 backdrop-blur">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-text-tertiary">Value</p>
            <p className="mt-1 text-h3 font-black text-text-primary">₹{stats.revenue.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="premium-panel mb-6 rounded-[--radius-2xl] border border-border/70 p-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-tertiary" />
              <Input
                placeholder="Search order or customer"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative md:w-64">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-11 w-full rounded-[--radius-md] border border-border bg-bg-tertiary pl-9 pr-4 text-sm text-text-primary outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
              >
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption.replaceAll('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[--radius-2xl] border border-border bg-bg-elevated/90 shadow-soft backdrop-blur">
          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full">
              <thead className="border-b border-border bg-bg-tertiary/70">
                <tr>
                  <th className="px-5 py-4 text-left text-label text-text-tertiary">Order</th>
                  <th className="px-5 py-4 text-left text-label text-text-tertiary">Customer</th>
                  <th className="px-5 py-4 text-left text-label text-text-tertiary">Date</th>
                  <th className="px-5 py-4 text-left text-label text-text-tertiary">Items</th>
                  <th className="px-5 py-4 text-left text-label text-text-tertiary">Total</th>
                  <th className="px-5 py-4 text-left text-label text-text-tertiary">Status</th>
                  <th className="px-5 py-4 text-right text-label text-text-tertiary">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-text-tertiary">
                      Loading orders...
                    </td>
                  </tr>
                ) : null}
                {!loading && filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-text-tertiary">
                      No matching orders.
                    </td>
                  </tr>
                ) : null}

                {filteredOrders.map((order) => {
                  const customer = customerLine(order);
                  return (
                    <tr key={order._id} className="border-b border-border/50 transition-colors hover:bg-bg-tertiary/65">
                      <td className="px-5 py-4 font-mono text-sm text-text-primary">
                        {order.orderNumber ?? `#${order._id.slice(-8).toUpperCase()}`}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-text-primary">{customer.primary}</p>
                        <p className="text-body-xs text-text-tertiary">{order.shippingAddress?.city ?? customer.secondary}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-secondary">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-sm text-text-secondary">{order.items.length} items</td>
                      <td className="px-5 py-4 font-semibold text-text-primary">
                        ₹{orderTotal(order).toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4">{getStatusBadge(order.orderStatus)}</td>
                      <td className="px-5 py-4 text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                          Open
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 14, opacity: 0, scale: 0.98 }}
              className="premium-panel max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[--radius-2xl] p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-h3 font-black text-text-primary">Order Detail</h2>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-[--radius-md] p-2 text-text-tertiary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4 rounded-[--radius-lg] border border-border bg-bg-tertiary/70 p-4">
                  <div>
                    <p className="text-label text-text-tertiary">Order</p>
                    <p className="font-mono text-label-lg font-black text-text-primary">
                      #{selectedOrder._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-label text-text-tertiary">Placed</p>
                    <p className="text-label-lg font-semibold text-text-primary">
                      {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="rounded-[--radius-lg] border border-border bg-bg-tertiary/70 p-4">
                  <p className="text-label text-text-tertiary">Customer & shipping</p>
                  <p className="mt-1 font-semibold text-text-primary">
                    {typeof selectedOrder.user === 'object' && selectedOrder.user?.name
                      ? selectedOrder.user.name
                      : customerLine(selectedOrder).primary}
                  </p>
                  <p className="text-body-xs text-text-tertiary">
                    {typeof selectedOrder.user === 'object' ? selectedOrder.user?.email : ''}
                  </p>
                  <p className="mt-2 text-body-sm text-text-secondary">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-body-sm text-text-secondary">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                    {selectedOrder.shippingAddress.zipCode ?? selectedOrder.shippingAddress.pincode}
                  </p>
                  {selectedOrder.shippingAddress.country && (
                    <p className="text-body-sm text-text-secondary">{selectedOrder.shippingAddress.country}</p>
                  )}
                </div>

                <div className="rounded-[--radius-lg] border border-border bg-bg-tertiary/70 p-4">
                  <p className="mb-3 text-label text-text-tertiary">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => {
                      const variant = item.variant?.variantName ?? item.variantName;
                      return (
                        <div key={`${item.name}-${index}`} className="flex items-center justify-between border-b border-border/60 pb-2">
                          <div>
                            <p className="font-medium text-text-primary">{item.name}</p>
                            <p className="text-body-xs text-text-tertiary">Qty {item.quantity}{variant ? ` • ${variant}` : ''}</p>
                          </div>
                          <p className="font-semibold text-text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[--radius-lg] border border-brand/20 bg-brand/8 p-4">
                  <p className="text-label text-text-tertiary">Total</p>
                  <p className="text-h2 font-black text-text-primary">₹{orderTotal(selectedOrder).toLocaleString('en-IN')}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-label text-text-tertiary">Rider</label>
                    <select
                      className="h-11 w-full rounded-[--radius-md] border border-border bg-bg-tertiary px-3 text-sm text-text-primary outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
                      onChange={(event) => {
                        if (event.target.value) assignRider(selectedOrder._id, event.target.value);
                      }}
                      defaultValue={selectedOrder.riderId || ''}
                      disabled={assigningLoading}
                    >
                      <option value="">Unassigned</option>
                      {riders.map((rider) => (
                        <option key={rider._id} value={rider._id}>
                          {rider.name} ({rider.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-label text-text-tertiary">Status</label>
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(event) => updateOrderStatus(selectedOrder._id, event.target.value)}
                      className="h-11 w-full rounded-[--radius-md] border border-border bg-bg-tertiary px-3 text-sm text-text-primary outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                      {STATUS_OPTIONS.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption.replaceAll('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button onClick={() => setSelectedOrder(null)} variant="brand" className="w-full">
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            <p className="text-text-secondary">Loading...</p>
          </div>
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
