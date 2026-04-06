'use client';

import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();

  const handleCheckout = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      toast.error('Please login to proceed to checkout');
      router.push('/login');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-32 h-32 rounded-[40px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-200 mb-8">
            <ShoppingBag size={64} strokeWidth={1} />
        </div>
        <h2 className="text-4xl font-black text-zinc-900 tracking-tighter mb-4">Your bag is empty.</h2>
        <p className="text-zinc-500 font-bold text-lg mb-10 max-w-sm">Looks like you haven't discovered anything premium for your pet yet.</p>
        <Link href="/products">
          <Button size="lg" className="h-16 px-10 rounded-2xl font-black text-lg shadow-2xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all">
            Start Exploring ⚡
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 animate-fade-in">
      <div className="mb-12">
          <h1 className="text-5xl font-black text-zinc-900 tracking-tighter mb-2">Shopping Bag</h1>
          <p className="text-zinc-500 font-bold text-lg">You have {itemCount} premium items waiting.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart items */}
        <div className="lg:col-span-8 space-y-6">
          {items.map((item) => (
            <div
              key={item.product + (item.variantName ?? '')}
              className="group flex flex-col sm:flex-row gap-6 bg-white rounded-[40px] p-6 border border-zinc-100 hover:border-brand-primary/20 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
            >
              <div className="relative w-full sm:w-40 aspect-square bg-zinc-50 rounded-[32px] overflow-hidden flex-shrink-0 border border-zinc-50 group-hover:scale-105 transition-transform duration-500">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="160px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">🐾</div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-black text-zinc-900 tracking-tight leading-tight group-hover:text-brand-primary transition-colors">{item.name}</h3>
                        <button
                            onClick={() => removeItem(item.product, item.variantName)}
                            className="p-3 rounded-2xl bg-zinc-50 text-zinc-500 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                    {item.variantName && (
                        <span className="inline-block px-4 py-1.5 bg-zinc-100 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">
                            {item.variantName}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between mt-auto">
                    <p className="text-2xl font-black text-zinc-900">
                        ₹{item.price.toLocaleString('en-IN')}
                    </p>
                    
                    <div className="flex items-center gap-4 bg-zinc-50 p-1.5 rounded-2xl border border-zinc-100">
                        <button
                            onClick={() => updateQuantity(item.product, item.quantity - 1, item.variantName)}
                            className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors text-xl font-bold"
                        >−</button>
                        <span className="w-6 text-center font-black text-zinc-900 text-lg">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.product, item.quantity + 1, item.variantName)}
                            disabled={item.quantity >= (item.stock ?? Number.POSITIVE_INFINITY)}
                            className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors text-xl font-bold disabled:opacity-30"
                        >+</button>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-4 h-fit sticky top-24">
          <div className="bg-zinc-950 rounded-[48px] p-8 text-white shadow-2xl shadow-zinc-900/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary opacity-20 blur-[80px] -z-0" />
             
             <h2 className="text-3xl font-black tracking-tighter mb-8 relative z-10">Order Summary</h2>
             
             <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between items-center text-zinc-500 font-bold text-sm">
                    <span>Subtotal</span>
                    <span className="text-white">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500 font-bold text-sm">
                    <span>Delivery</span>
                    <span className={total >= 499 ? 'text-green-400' : 'text-white'}>
                        {total >= 499 ? 'FREE' : '₹49.00'}
                    </span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between items-end">
                    <span className="text-zinc-500 font-bold text-sm">Total Amount</span>
                    <span className="text-4xl font-black tracking-tighter">
                        ₹{(total + (total >= 499 ? 0 : 49)).toLocaleString('en-IN')}
                    </span>
                </div>
             </div>

             <Link href="/checkout" onClick={handleCheckout}>
               <button className="w-full h-20 bg-brand-primary text-white rounded-[32px] font-black text-xl flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-brand-primary/20 group relative overflow-hidden z-10">
                  Secure Checkout
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
               </button>
             </Link>

             <div className="mt-8 space-y-4 relative z-10 opacity-60">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <Truck size={16} className="text-brand-primary" /> Free delivery over ₹499
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <ShieldCheck size={16} className="text-brand-primary" /> Encrypted checkout
                </div>
             </div>
          </div>

          <div className="mt-8 bg-zinc-50 rounded-[32px] p-6 border border-zinc-100 flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-white border border-zinc-100 flex items-center justify-center text-zinc-500">
                <CreditCard size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Accepted</p>
                <p className="text-xs font-bold text-zinc-600">UPI, Cards, EMI & Net Banking</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
