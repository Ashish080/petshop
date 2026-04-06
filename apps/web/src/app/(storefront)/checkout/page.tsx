'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { 
  CheckCircle2, MapPin, CreditCard, ChevronRight, 
  Check, Star, Ticket, Tag, X as XIcon, Wallet 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { motionPresets, duration, easing } from '@/lib/motion';

type Step = 'address' | 'payment' | 'confirm';

interface ShippingForm {
  name: string; street: string; city: string;
  state: string; pincode: string; phone: string;
}

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
  const [membership, setMembership] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [paymentMode, setPaymentMode] = useState<'cod' | 'wallet'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [form, setForm] = useState<ShippingForm>({
    name: session?.user?.name ?? '',
    street: '', city: '', state: 'Uttar Pradesh', pincode: '', phone: '',
  });

  useEffect(() => {
    const fetchMembership = async () => {
      const res = await fetch('/api/user/membership');
      const data = await res.json();
      if (data.success) setMembership(data.data);
    };
    const fetchWallet = async () => {
        const res = await fetch('/api/wallet');
        const data = await res.json();
        if (data.success) setWallet(data.data);
    };
    fetchMembership();
    fetchWallet();
  }, []);

  const deliveryFee = total >= 499 ? 0 : 49;
  const membershipDiscount = membership?.perks?.discount ? Math.floor((total * membership.perks.discount) / 100) : 0;
  
  let couponDiscount = 0;
  if (appliedCoupon) {
     if (appliedCoupon.discountPercent) {
        couponDiscount = Math.floor((total * appliedCoupon.discountPercent) / 100);
     } else if (appliedCoupon.discountAmount) {
        couponDiscount = appliedCoupon.discountAmount;
     }
  }

  const discountAmount = membershipDiscount + couponDiscount;
  const orderTotal = Math.max(0, total + deliveryFee - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setValidatingCoupon(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartTotal: total })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.data);
        toast.success(`Coupon "${data.data.code}" applied!`, { icon: '🎁' });
      } else {
        toast.error(data.error || 'Invalid coupon');
        setCouponCode('');
      }
    } catch (err) {
      toast.error('Failed to validate coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  // Fire confetti when confirmed
  useEffect(() => {
     if (step === 'confirm') {
         setTimeout(() => {
             confetti({
                 particleCount: 100,
                 spread: 70,
                 origin: { y: 0.6 },
                 colors: ['#FF6B00', '#7C5CFC', '#00C48C']
             });
         }, 400);
     }
  }, [step]);

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
          paymentMethod: paymentMode,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Order failed');
      }
      const orderData = await res.json();
      setOrderId(orderData.data._id || orderData.data.id);
      clearCart();
      setStep('confirm');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isAddressValid = Boolean(form.name && form.street && form.city && form.pincode && form.phone);

  if (step === 'confirm') {
      return (
          <div className="max-w-2xl mx-auto px-6 py-20 animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
              <motion.div 
                 initial={{ scale: 0, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
                 className="relative mb-8"
              >
                  <div className="absolute inset-0 bg-success blur-xl opacity-20 rounded-full" />
                  <div className="relative w-24 h-24 bg-success/10 rounded-full flex items-center justify-center border-4 border-success/20">
                     <motion.div
                       initial={{ pathLength: 0 }}
                       animate={{ pathLength: 1 }}
                       transition={{ duration: 0.4, delay: 0.2 }}
                     >
                         <CheckCircle2 className="w-12 h-12 text-success" />
                     </motion.div>
                  </div>
              </motion.div>
              
              <motion.h1 {...motionPresets.fadeUp} className="text-display tracking-tight text-text-primary mb-4">
                  Order Placed!
              </motion.h1>
              <motion.div {...motionPresets.fadeUp} className="space-y-2 mb-10">
                  <p className="text-body-lg text-text-secondary">Your order is confirmed and being prepared.</p>
                  <p className="text-label-lg text-text-tertiary">
                      Order Reference: <span className="text-brand font-bold uppercase tracking-wider">#{orderId.slice(-8)}</span>
                  </p>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4, type: "spring" }}
                 className="flex flex-wrap gap-4 justify-center"
              >
                 <Button size="lg" variant="secondary" onClick={() => router.push('/orders')}>Track Order</Button>
                 <Button size="lg" variant="brand" onClick={() => router.push('/products')}>Continue Shopping</Button>
              </motion.div>
          </div>
      );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
      <div className="mb-10 text-center">
          <h1 className="text-h1 font-black text-text-primary tracking-tighter mb-2">Secure Checkout</h1>
          <p className="text-text-secondary font-medium">Almost there! Complete your details below.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Accordion Steps */}
        <div className="lg:col-span-7 space-y-4">
            
            {/* Step 1: Address */}
            <div className={`rounded-[--radius-xl] overflow-hidden transition-all duration-300 border ${step === 'address' ? 'border-brand shadow-md bg-bg-elevated' : 'border-border bg-bg-tertiary opacity-70'}`}>
                <div className={`p-6 flex items-center justify-between ${step === 'address' ? 'border-b border-border/50' : ''}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 'address' ? 'bg-brand text-white' : 'bg-bg-secondary text-text-secondary'} ${step === 'payment' && 'bg-success text-white'}`}>
                            {step === 'payment' ? <Check size={20} /> : '1'}
                        </div>
                        <h3 className={`text-h4 font-bold ${step === 'address' ? 'text-text-primary' : 'text-text-secondary'} flex items-center gap-2`}>
                            <MapPin size={20} className={step === 'address' ? 'text-brand' : 'text-text-tertiary'} />
                            Shipping Details
                        </h3>
                    </div>
                    {step === 'payment' && (
                        <button onClick={() => setStep('address')} className="text-label-sm uppercase tracking-wider text-brand font-bold hover:underline">
                            Edit
                        </button>
                    )}
                </div>
                
                <AnimatePresence initial={false}>
                    {step === 'address' && (
                        <motion.div 
                          key="address-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: easing.inOut }}
                          className="overflow-hidden"
                        >
                            <div className="p-6 pt-2 space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" autoFocus />
                                    <Input label="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 9999999999" type="tel" />
                                </div>
                                <Input label="Street Address" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="House/Flat No., Street, Locality" />
                                <div className="grid md:grid-cols-2 gap-5">
                                    <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Lucknow" />
                                    <Input label="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="226001" />
                                </div>
                                <div className="pt-4">
                                   <Button size="lg" fullWidth variant="brand" onClick={() => setStep('payment')} disabled={!isAddressValid}>
                                       Continue to Payment
                                   </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Step 2: Payment */}
            <div className={`rounded-[--radius-xl] overflow-hidden transition-all duration-300 border ${step === 'payment' ? 'border-brand shadow-md bg-bg-elevated' : 'border-border bg-bg-tertiary opacity-70'}`}>
                <div className="p-6 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === 'payment' ? 'bg-brand text-white' : 'bg-bg-secondary text-text-secondary'}`}>
                        2
                    </div>
                    <h3 className={`text-h4 font-bold ${step === 'payment' ? 'text-text-primary' : 'text-text-secondary'} flex items-center gap-2`}>
                        <CreditCard size={20} className={step === 'payment' ? 'text-brand' : 'text-text-tertiary'} />
                        Payment Method
                    </h3>
                </div>

                <AnimatePresence initial={false}>
                    {step === 'payment' && (
                        <motion.div 
                          key="payment-content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: easing.inOut }}
                          className="overflow-hidden"
                        >
                            <div className="p-6 pt-2 space-y-4">
                               <label onClick={() => setPaymentMode('cod')} className={`flex items-center justify-between p-4 rounded-[--radius-lg] border-2 cursor-pointer transition-all ${paymentMode === 'cod' ? 'border-brand bg-brand/5 shadow-sm' : 'border-border bg-bg-secondary'}`}>
                                  <div className="flex items-center gap-4">
                                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMode === 'cod' ? 'border-brand' : 'border-border'}`}>
                                          {paymentMode === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-brand" />}
                                      </div>
                                      <div>
                                          <p className="font-bold text-text-primary">Cash on Delivery</p>
                                          <p className="text-body-sm text-text-secondary mt-0.5">Pay conveniently when your order arrives</p>
                                      </div>
                                  </div>
                                  <Badge variant="success">Free</Badge>
                               </label>
                               
                               <label 
                                 onClick={() => wallet?.balance >= orderTotal && setPaymentMode('wallet')} 
                                 className={`flex items-center justify-between p-4 rounded-[--radius-lg] border-2 transition-all ${wallet?.balance < orderTotal ? 'opacity-50 grayscale cursor-not-allowed border-border bg-bg-tertiary' : 'cursor-pointer'} ${paymentMode === 'wallet' ? 'border-brand bg-brand/5 shadow-sm' : 'border-border bg-bg-secondary'}`}
                               >
                                  <div className="flex items-center gap-4">
                                     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMode === 'wallet' ? 'border-brand' : 'border-border'}`}>
                                          {paymentMode === 'wallet' && <div className="w-2.5 h-2.5 rounded-full bg-brand" />}
                                      </div>
                                      <div>
                                          <p className="font-bold text-text-primary flex items-center gap-2">
                                              <Wallet size={16} className="text-brand" /> Pay with Pet Cash
                                          </p>
                                          <p className="text-body-sm text-text-secondary mt-0.5">Balance: ₹{wallet?.balance?.toLocaleString() || '0'}</p>
                                      </div>
                                  </div>
                                  {wallet?.balance < orderTotal ? (
                                      <Badge variant="danger">Low Balance</Badge>
                                  ) : (
                                      <Badge variant="brand">Instant</Badge>
                                  )}
                               </label>

                               <div className="pt-6">
                                   <Button size="lg" fullWidth variant="brand" onClick={handlePlaceOrder} loading={loading}>
                                       Confirm & Place Order (₹{orderTotal.toLocaleString('en-IN')})
                                   </Button>
                               </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 relative">
            <div className="sticky top-24 bg-bg-secondary rounded-[--radius-2xl] p-8 border border-border shadow-md">
                <h3 className="text-h4 font-bold text-text-primary mb-6 flex items-center justify-between">
                    Order Summary
                    <Badge variant="default" size="sm">{items.length} Items</Badge>
                </h3>
                
                <div className="max-h-[300px] overflow-y-auto space-y-4 mb-6 pr-2 scrollbar-hide">
                    {items.map((item) => (
                        <div key={item.product + (item.variantName ?? '')} className="flex gap-4">
                            <div className="relative w-16 h-16 rounded-[--radius-md] bg-bg-elevated border border-border overflow-hidden shrink-0">
                                {item.image ? (
                                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">🐾</div>
                                )}
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-text-primary text-bg-primary rounded-full text-[10px] flex items-center justify-center font-bold z-10 border border-bg-elevated">
                                    {item.quantity}
                                </span>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <p className="text-label-lg text-text-primary line-clamp-1">{item.name}</p>
                                {item.variantName && <p className="text-label-sm text-text-tertiary uppercase">{item.variantName}</p>}
                            </div>
                            <div className="text-label-lg font-bold text-text-primary self-center">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-border pt-6 space-y-3">
                    <div className="flex justify-between text-body text-text-secondary">
                        <span>Subtotal</span>
                        <span className="font-medium text-text-primary">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-body text-text-secondary">
                        <span>Delivery Fee</span>
                        <span className={deliveryFee === 0 ? 'text-brand font-bold' : 'text-text-primary font-medium'}>
                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                        </span>
                    </div>
                    
                    {membershipDiscount > 0 && (
                        <div className="flex justify-between text-body text-brand font-black items-center transition-all">
                           <div className="flex items-center gap-2">
                              <Star size={14} className="fill-brand" />
                              <span>{membership?.perks?.label} Perk ({membership?.perks?.discount}%)</span>
                           </div>
                           <span>-₹{membershipDiscount.toLocaleString('en-IN')}</span>
                        </div>
                    )}

                    {appliedCoupon && (
                        <div className="flex justify-between text-body text-brand font-black items-center animate-in slide-in-from-right-4 duration-300">
                           <div className="flex items-center gap-2">
                              <Tag size={13} className="fill-brand" />
                              <span>Promo: {appliedCoupon.code}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                              <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-text-tertiary hover:text-danger p-0.5">
                                 <XIcon size={12} />
                              </button>
                           </div>
                        </div>
                    )}

                    <div className="h-px bg-border my-2" />

                    {!appliedCoupon && (
                        <div className="mt-4">
                           <div className="flex gap-2">
                               <div className="relative flex-1 group">
                                   <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" size={14} />
                                   <input 
                                       placeholder="Promo Code"
                                       value={couponCode}
                                       onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                       className="w-full pl-9 pr-4 py-2 bg-bg-elevated border border-border rounded-lg text-label-sm font-bold uppercase tracking-widest placeholder:text-text-disabled outline-none focus:border-brand transition-all"
                                   />
                               </div>
                               <button 
                                 onClick={handleApplyCoupon}
                                 disabled={!couponCode || validatingCoupon}
                                 className="px-4 py-2 bg-text-primary text-bg-primary rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                               >
                                   {validatingCoupon ? 'Wait' : 'Apply'}
                               </button>
                           </div>
                        </div>
                    )}
                    
                    <div className="border-t border-border mt-4 pt-4 flex justify-between items-end">
                        <span className="text-label-lg text-text-primary">Total Amount</span>
                        <div className="text-h2 font-black text-text-primary tracking-tight">
                            ₹<AnimatedCounter value={orderTotal} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
