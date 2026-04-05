'use client';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';

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
  const { data: session } = useSession();
  const router = useRouter();
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
      setOrderId(order.data.orderNumber || order.data._id || order.data.id);
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
                active ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
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
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 flex items-center justify-center rounded-lg">
                  <CheckCircle2 size={18} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Shipping Details</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Full Name</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/5 transition-all"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Phone Number</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/5 transition-all"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Street Address</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/5 transition-all"
                    value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })}
                    placeholder="House no., Street, Locality"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">City</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/5 transition-all"
                    value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Lucknow"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">Pincode</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/5 transition-all"
                    value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    placeholder="226001"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest block mb-2 ml-1">State</label>
                  <select
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/5 transition-all bg-white cursor-pointer"
                    value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}
                  >
                    {['Uttar Pradesh','Delhi','Maharashtra','Karnataka','Tamil Nadu','Rajasthan','Gujarat','West Bengal'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button
                size="lg" className="w-full mt-8 font-black uppercase tracking-widest text-xs py-5"
                onClick={() => setStep('payment')}
                disabled={!form.name || !form.street || !form.city || !form.pincode || !form.phone}
              >
                Proceed to Payment <ArrowRight className="ml-2 hover:translate-x-1 transition-transform" size={18} />
              </Button>
            </div>
          )}

          {/* Payment step */}
          {step === 'payment' && (
            <div className="bg-white rounded-2xl p-10 border border-gray-100 shadow-xl shadow-orange-500/5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Almost Done!</h2>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Select your preferred payment mode</p>
              </div>
              
              <div className="space-y-4 mb-10">
                <label className="flex items-center gap-5 p-6 border-2 border-orange-500 bg-orange-50/50 rounded-2xl cursor-pointer transition-all hover:bg-orange-50">
                  <div className="w-6 h-6 rounded-full border-4 border-orange-500 bg-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-sm uppercase tracking-wide">Cash on Delivery</p>
                    <p className="text-[11px] font-bold text-gray-500 mt-1 uppercase tracking-widest">Pay when your order arrives</p>
                  </div>
                  <span className="ml-auto text-[10px] font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-widest">Recommended</span>
                </label>
                
                <label className="flex items-center gap-5 p-6 border border-gray-100 rounded-2xl cursor-not-allowed opacity-50 bg-gray-50">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-200 bg-white"></div>
                  <div>
                    <p className="font-black text-gray-400 text-sm uppercase tracking-wide">Digital Payment</p>
                    <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest">UPI, Cards, Netbanking</p>
                  </div>
                  <span className="ml-auto text-[10px] font-black text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">Unavailable</span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="secondary" className="sm:flex-1 py-5 uppercase tracking-widest text-xs font-black" onClick={() => setStep('address')}>Go Back</Button>
                <Button
                  size="lg" className="sm:flex-[2] py-5 uppercase tracking-widest text-xs font-black shadow-2xl shadow-orange-500/20" loading={loading}
                  onClick={handlePlaceOrder}
                >
                  Confirm Order · ₹{orderTotal.toLocaleString('en-IN')}
                </Button>
              </div>
            </div>
          )}

          {/* Confirmed step */}
          {step === 'confirm' && (
            <div className="bg-white rounded-[40px] p-16 border border-gray-100 text-center shadow-2xl animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Order Confirmed!</h2>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs mb-8">Synchronizing with Logistics...</p>
              
              <div className="bg-gray-50 rounded-3xl p-8 mb-10 border border-gray-100 inline-block">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Tracking Inventory ID</p>
                <p className="text-2xl font-black text-gray-900 font-mono tracking-tighter">#{orderId}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" className="px-10 py-5 uppercase tracking-widest text-xs font-black" onClick={() => router.push('/orders')}>Access History</Button>
                <Button className="px-10 py-5 uppercase tracking-widest text-xs font-black shadow-xl shadow-orange-500/20" onClick={() => router.push('/products')}>Resume Shopping</Button>
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
