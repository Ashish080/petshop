import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/mongoose';
import Order from '@/models/Order';
import { Badge } from '@/components/ui/Badge';
import { Package } from 'lucide-react';

const statusVariant: Record<string, any> = {
  placed: 'info', confirmed: 'info', shipped: 'warning',
  delivered: 'success', cancelled: 'danger',
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session) redirect('/auth/login');

  await connectDB();
  const orders = await Order.find({ 'user.email': session.user.email })
    .sort({ createdAt: -1 }).lean();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-300">
          <Package className="w-12 h-12 mx-auto mb-3" />
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div>
                  <p className="text-xs text-gray-400 font-mono">#{order._id.toString().slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[order.orderStatus] || 'default'}>{order.orderStatus}</Badge>
                  <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'default'}>{order.paymentStatus}</Badge>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} {item.variantName ? `(${item.variantName})` : ''} × {item.quantity}</span>
                    <span className="text-gray-800">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{(order.total || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
