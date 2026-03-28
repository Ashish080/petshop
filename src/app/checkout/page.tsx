'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import { themeConfig } from '@/config/theme';
import { CreditCard, Wallet, Truck, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal);
  const delivery = useCartStore((s) => s.delivery);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    notes: '',
    paymentMethod: 'cod' as 'card' | 'upi' | 'cod',
  });

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || session.user.name || '',
        email: prev.email || session.user.email || '',
      }));
    }
  }, [session]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    if (items.length === 0 && !orderPlaced) {
      router.replace('/cart');
    }
  }, [status, items.length, orderPlaced, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: items.map((i) => ({
            product: i.product,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            variantName: i.variantName,
          })),
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data) {
        setOrderNumber(data.data.orderNumber ?? data.data._id?.slice(-12) ?? '');
        setOrderPlaced(true);
        clearCart();
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center p-6">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" aria-hidden />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center p-6">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" aria-hidden />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-32 h-32 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={64} className="text-green-500" />
          </div>
          <h1 className="text-4xl font-black text-text-primary mb-4">Order Placed!</h1>
          <p className="text-text-light font-medium mb-2">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          <p className="text-lg font-black text-brand-primary mb-8">
            Order Number: {orderNumber}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="px-8 py-4 bg-brand-primary text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all"
            >
              View My Orders
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 border-2 border-card-border text-text-primary font-black rounded-2xl hover:bg-brand-primary/5 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-page py-12 md:py-20">
      <div className={themeConfig.spacing.container}>
        <div className="mb-12">
          <Link href="/cart" className="inline-flex items-center gap-2 text-text-light hover:text-brand-primary font-black mb-4">
            <ArrowLeft size={20} /> Back to Cart
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-text-primary mb-3 tracking-tighter">
            Checkout
          </h1>
          <p className="text-text-light font-medium text-lg">
            Complete your order in a few steps
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-card-bg rounded-[32px] p-8 border border-card-border shadow-xl">
                <h2 className="text-2xl font-black text-text-primary mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-light mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-4 bg-bg-page border border-card-border rounded-2xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-light mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-4 bg-bg-page border border-card-border rounded-2xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-light mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-5 py-4 bg-bg-page border border-card-border rounded-2xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-card-bg rounded-[32px] p-8 border border-card-border shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="text-brand-primary" size={24} />
                  <h2 className="text-2xl font-black text-text-primary">Shipping Address</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-light mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-5 py-4 bg-bg-page border border-card-border rounded-2xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-light mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-5 py-4 bg-bg-page border border-card-border rounded-2xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-light mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-5 py-4 bg-bg-page border border-card-border rounded-2xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-light mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-5 py-4 bg-bg-page border border-card-border rounded-2xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-light mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-5 py-4 bg-bg-page border border-card-border rounded-2xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-card-bg rounded-[32px] p-8 border border-card-border shadow-xl">
                <h2 className="text-2xl font-black text-text-primary mb-6">Payment Method</h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-5 border-2 border-card-border rounded-2xl cursor-pointer hover:border-brand-primary transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={(e) =>
                        setFormData({ ...formData, paymentMethod: e.target.value as 'cod' })
                      }
                      className="w-5 h-5 text-brand-primary"
                    />
                    <Truck size={20} className="text-text-light" />
                    <span className="font-black text-text-primary">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center gap-4 p-5 border-2 border-card-border rounded-2xl cursor-pointer hover:border-brand-primary transition-all opacity-50">
                    <input type="radio" name="paymentMethod" value="card" disabled className="w-5 h-5 text-brand-primary" />
                    <CreditCard size={20} className="text-text-light" />
                    <span className="font-black text-text-light">Card (Coming Soon)</span>
                  </label>
                  <label className="flex items-center gap-4 p-5 border-2 border-card-border rounded-2xl cursor-pointer hover:border-brand-primary transition-all opacity-50">
                    <input type="radio" name="paymentMethod" value="upi" disabled className="w-5 h-5 text-brand-primary" />
                    <Wallet size={20} className="text-text-light" />
                    <span className="font-black text-text-light">UPI (Coming Soon)</span>
                  </label>
                </div>
              </div>

              <div className="bg-white dark:bg-card-bg rounded-[32px] p-8 border border-card-border shadow-xl">
                <h2 className="text-2xl font-black text-text-primary mb-6">Order Notes (Optional)</h2>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any special instructions for your order?"
                  rows={4}
                  className="w-full px-5 py-4 bg-bg-page border border-card-border rounded-2xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none"
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-card-bg rounded-[40px] p-8 border border-card-border shadow-2xl sticky top-24">
                <h2 className="text-2xl font-black text-text-primary mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item, index) => (
                    <div key={`${item.product}-${item.variantName ?? ''}-${index}`} className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-bg-page/50 flex-shrink-0 border border-card-border/50">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-text-primary line-clamp-2">{item.name}</p>
                        {item.variantName && (
                          <p className="text-xs text-text-light">Variant: {item.variantName}</p>
                        )}
                        <p className="text-xs font-black text-text-light">Qty: {item.quantity}</p>
                        <p className="text-sm font-black text-brand-primary">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-card-border pt-6 mb-6 space-y-3">
                  <div className="flex justify-between text-text-light font-bold">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-text-light font-bold">
                    <span>Delivery</span>
                    <span>{delivery === 0 ? 'FREE' : `₹${delivery.toLocaleString('en-IN')}`}</span>
                  </div>
                </div>

                <div className="border-t border-card-border pt-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black text-text-primary">Total</span>
                    <span className="text-3xl font-black text-brand-primary">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-brand-primary text-white font-black text-xl rounded-2xl shadow-xl shadow-brand-primary/25 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
