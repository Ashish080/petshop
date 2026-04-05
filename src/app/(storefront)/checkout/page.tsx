'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

type Step = 'address' | 'payment' | 'confirm';

interface ShippingForm {
  name: string; street: string; city: string;
  state: string; pincode: string; phone: string;
}

const STEPS: Step[] = ['address', 'payment', 'confirm'];
const STEP_LABELS: Record<Step, string> = {
  address: 'Address', payment: 'Payment', confirm: 'Confirmed',
};

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.push('/auth/login?callbackUrl=/checkout');
    return null;
  }
  const { items, total, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>('address');
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [form, setForm] = useState<ShippingForm>({
    name: session?.user?.name ?? '',
    street: '', city: '', state: 'Uttar Pradesh', pincode: '', phone: '',
  });

  const deliveryFee = total >= 499 ? 0 : 49;
  const orderTotal = total + deliveryFee;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            product: i.product, name: i.name, image: i.image,
            price: i.price, quantity: i.quantity, variantName: i.variantName,
          })),
          shippingAddress: form,
          totalPrice: orderTotal,
          paymentMethod: 'cod',
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Order failed');
      }
      const order = await res.json();
      setOrderId(order.data._id || order.data.id);
      clearCart();
      setStep('confirm');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10">
        {STEPS.map((s, i) => {
          const idx = STEPS.indexOf(step);
          const done = i < idx;
          const active = s === step;
          return (
            <div key={s} className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                done ? 'bg-green-100 text-green-800' :
                active ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {done && <CheckCircle2 className="w-4 h-4" />}
                {STEP_LABELS[s]}
              </div>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-gray-200" />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">

          {/* Address step */}
          {step === 'address' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Shipping address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-sm text-gray-500 block mb-1.5">Full name</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ravi Kumar"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-sm text-gray-500 block mb-1.5">Phone number</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500 block mb-1.5">Street address</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                    value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })}
                    placeholder="House no., Street, Locality"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1.5">City</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                    value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Lucknow"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1.5">Pincode</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                    value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    placeholder="226001"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm text-gray-500 block mb-1.5">State</label>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                    value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                  >
                    {['Uttar Pradesh','Delhi','Maharashtra','Karnataka','Tamil Nadu','Rajasthan','Gujarat','West Bengal'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                size="lg" className="w-full mt-6"
                onClick={() => setStep('payment')}
                disabled={!form.name || !form.street || !form.city || !form.pincode || !form.phone}
              >
                Continue to payment →
              </Button>
            </div>
          )}

          {/* Payment step */}
          {step === 'payment' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment method</h2>
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-4 p-4 border-2 border-orange-400 bg-orange-50 rounded-xl cursor-pointer">
                  <input type="radio" name="payment" defaultChecked className="accent-orange-500" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Cash on delivery</p>
                    <p className="text-xs text-gray-500 mt-0.5">Pay when your order arrives</p>
                  </div>
                  <span className="ml-auto text-xs font-medium text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">Free</span>
                </label>
                <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-not-allowed opacity-50">
                  <input type="radio" name="payment" disabled />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">UPI / Net banking</p>
                    <p className="text-xs text-gray-600 mt-0.5">Coming soon</p>
                  </div>
                </label>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep('address')}>← Back</Button>
                <Button
                  size="lg" className="flex-1" loading={loading}
                  onClick={handlePlaceOrder}
                >
                  Place order · ₹{orderTotal.toLocaleString('en-IN')}
                </Button>
              </div>
            </div>
          )}

          {/* Confirmed step */}
          {step === 'confirm' && (
            <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order placed!</h2>
              <p className="text-gray-500 mb-1">Order ID: <span className="font-mono text-gray-700">#{orderId.slice(-8).toUpperCase()}</span></p>
              <p className="text-gray-600 text-sm mb-8">You'll receive a confirmation on your registered email.</p>
              <div className="flex gap-3 justify-center">
                <Button variant="secondary" onClick={() => router.push('/orders')}>View orders</Button>
                <Button onClick={() => router.push('/products')}>Continue shopping</Button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        {step !== 'confirm' && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 h-fit">
            <h3 className="font-semibold text-gray-900 mb-4">Order ({items.length} items)</h3>
            <div className="space-y-3 mb-4 max-h-56 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product + (item.variantName ?? '')} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate max-w-[150px]">
                    {item.name} {item.variantName ? `(${item.variantName})` : ''} × {item.quantity}
                  </span>
                  <span className="text-gray-800 font-medium ml-2">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? 'text-green-600' : ''}>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                <span>Total</span><span>₹{orderTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
