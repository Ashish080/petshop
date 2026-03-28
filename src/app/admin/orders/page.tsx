'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Package, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function OrdersContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'admin')) {
      router.push('/auth/login');
    } else if (status === 'authenticated' && session?.user?.role === 'admin') {
      setLoading(true);
      fetchOrders();
    }
  }, [status, session, router, statusFilter]);

  const orderTotal = (o: Order) => o.total ?? o.totalPrice ?? 0;

  const customerLine = (o: Order) => {
    const u = o.user;
    if (typeof u === 'object' && u !== null && 'email' in u) {
      return { primary: u.name || u.email || 'Customer', secondary: u.email ?? '' };
    }
    return { primary: 'Customer', secondary: typeof u === 'string' ? u : '' };
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, orderStatus: newStatus })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, ...data.data, orderStatus: newStatus as Order['orderStatus'] } : o))
        );
        setSelectedOrder((sel) =>
          sel && sel._id === orderId ? { ...sel, ...data.data, orderStatus: newStatus as Order['orderStatus'] } : sel
        );
        fetchOrders();
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const { primary, secondary } = customerLine(order);
    return (
      order._id.toLowerCase().includes(q) ||
      (order.orderNumber?.toLowerCase().includes(q) ?? false) ||
      primary.toLowerCase().includes(q) ||
      secondary.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary'> = {
      pending: 'warning',
      confirmed: 'info',
      processing: 'primary',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 p-6 hidden lg:block">
        <Link href="/admin" className="flex items-center gap-2 mb-8">
          <Package className="w-8 h-8 text-orange-500" />
          <span className="text-xl font-bold text-gray-900">Admin</span>
        </Link>

        <nav className="space-y-2">
          <Link href="/admin" className="block px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
            Products
          </Link>
          <Link href="/admin/inventory" className="block px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
            Inventory
          </Link>
          <Link href="/admin/orders" className="block px-4 py-3 rounded-xl bg-orange-50 text-orange-600 font-medium">
            Orders
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Link href="/" className="block px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600">Manage customer orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by order ID or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Order ID</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Items</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Total</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-500">
                    Loading orders…
                  </td>
                </tr>
              ) : null}
              {!loading && filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-500">
                    No orders match your filters.
                  </td>
                </tr>
              ) : null}
              {filteredOrders.map((order) => {
                const cust = customerLine(order);
                return (
                <tr key={order._id} className="border-b border-gray-50">
                  <td className="py-4 px-6 font-mono text-sm text-gray-900">
                    {order.orderNumber ?? `#${order._id.slice(-8).toUpperCase()}`}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">{cust.primary}</p>
                    <p className="text-sm text-gray-500">{order.shippingAddress?.city ?? cust.secondary}</p>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{order.items.length} items</td>
                  <td className="py-4 px-6 font-semibold text-gray-900">
                    ₹{orderTotal(order).toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(order.orderStatus)}</td>
                  <td className="py-4 px-6 text-right">
                    <Button
                      onClick={() => setSelectedOrder(order)}
                      variant="outline"
                      size="sm"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono font-semibold">#{selectedOrder._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date</p>
                    <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-2">Customer & shipping</p>
                  <p className="font-semibold text-gray-900">
                    {typeof selectedOrder.user === 'object' && selectedOrder.user?.name
                      ? selectedOrder.user.name
                      : customerLine(selectedOrder).primary}
                  </p>
                  <p className="text-sm text-gray-500">
                    {typeof selectedOrder.user === 'object' ? selectedOrder.user?.email : ''}
                  </p>
                  <p className="text-gray-600 mt-2">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-gray-600">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                    {selectedOrder.shippingAddress.zipCode ?? selectedOrder.shippingAddress.pincode}
                  </p>
                  {selectedOrder.shippingAddress.country && (
                    <p className="text-gray-600">{selectedOrder.shippingAddress.country}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-3">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => {
                      const v = item.variant?.variantName ?? item.variantName;
                      return (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}{v ? ` (${v})` : ''}</p>
                        </div>
                        <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    );
                    })}
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-orange-500">₹{orderTotal(selectedOrder).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => {
                      updateOrderStatus(selectedOrder._id, e.target.value);
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <Button onClick={() => setSelectedOrder(null)} variant="primary" className="w-full">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
