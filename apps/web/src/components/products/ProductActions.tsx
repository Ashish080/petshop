'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, MessageSquare } from 'lucide-react';
import { useCartStore, useCartUIStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import type { Product as IProduct, ProductVariant as IVariant } from '@/types';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { brandConfig } from '@/config/brand';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useWishlistStore } from '@/store/wishlistStore';
import { Calendar, RefreshCw, Zap } from 'lucide-react';

export function ProductActions({ product }: { product: IProduct }) {
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(
    product.variants?.[0] ?? null
  );
  const [wished, setWished] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  
  const addItem = useCartStore((s) => s.addItem);
  const { openCart } = useCartUIStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  
  const [isSubscription, setIsSubscription] = useState(false);
  const [frequency, setFrequency] = useState<'weekly' | 'bi-weekly' | 'monthly'>('monthly');

  const isWished = isInWishlist(product._id);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const effectivePrice = selectedVariant ? selectedVariant.price : product.price;
  const effectiveStock = selectedVariant ? selectedVariant.stock : product.stock;

  const handleAdd = async () => {
    if (!session) {
      toast.error('Please log in to add items to the cart.', { icon: '🔒' });
      router.push('/auth/login');
      return;
    }
    if (effectiveStock === 0) return;

    if (isSubscription) {
      setSubscriptionLoading(true);
      try {
        const res = await fetch('/api/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product._id,
            productName: product.name,
            productImage: product.images[0] ?? '',
            price: Math.floor(effectivePrice * 0.9), // 10% discount for sub
            frequency
          })
        });
        const data = await res.json();
        if (data.success) {
          toast.success(`Subscribed to ${product.name}!`, { icon: '📅' });
          router.push('/profile/subscriptions');
        }
      } catch (err) {
        toast.error('Failed to create subscription');
      } finally {
        setSubscriptionLoading(false);
      }
      return;
    }
    
    addItem({
      product: product._id,
      name: product.name,
      price: effectivePrice,
      image: product.images[0] ?? '',
      quantity: qty,
      variantName: selectedVariant?.name,
      stock: effectiveStock,
    });
    
    openCart();
  };

  const handleEnquiry = () => {
    if (!session) {
      toast.error('Please log in to send a direct enquiry.', { icon: '🔒' });
      router.push('/auth/login');
      return;
    }
    const msg = encodeURIComponent(`Hi ${brandConfig.name}, I'm interested in purchasing the ${product.name}.`);
    window.open(`https://wa.me/${brandConfig.phone.replace(/\D/g, '')}?text=${msg}`, '_blank');
  };

  const handleWishlist = async () => {
    if (!session) {
       router.push('/auth/login');
       return;
    }
    await toggleWishlist(product);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Dynamic Segmented Variant Selector */}
      {product.variants?.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
             <span className="text-label-sm font-bold uppercase tracking-wider text-text-primary">Choose Variant</span>
             <span className="text-[10px] font-black tracking-widest uppercase text-brand">{selectedVariant?.name}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 bg-bg-secondary p-1.5 rounded-[--radius-full] border border-border w-fit relative">
             <AnimatePresence>
                 {product.variants.map((v: IVariant) => {
                   const isSelected = selectedVariant?._id === v._id;
                   const isSoldOut = v.stock === 0;

                   return (
                     <button
                       key={v._id}
                       onClick={() => setSelectedVariant(v)}
                       disabled={isSoldOut}
                       className={`relative px-5 py-2.5 rounded-[--radius-full] text-label-sm font-bold transition-colors z-10 ${
                         isSelected ? 'text-bg-primary' : 'text-text-secondary hover:text-text-primary'
                       } ${isSoldOut ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                     >
                       {isSelected && (
                         <motion.div
                           layoutId="activeVariant"
                           className="absolute inset-0 bg-text-primary rounded-[--radius-full]"
                           transition={{ type: "spring", stiffness: 350, damping: 25 }}
                         />
                       )}
                       <span className="relative z-20 flex items-center gap-1">
                          {v.name}
                       </span>
                     </button>
                   );
                 })}
             </AnimatePresence>
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
             <span className="text-label-sm font-bold uppercase tracking-wider text-text-primary">Quantity</span>
             <span className="text-[10px] font-black tracking-widest uppercase text-success">{effectiveStock} Available</span>
          </div>
          
          <div className="flex items-center gap-3 w-fit bg-bg-secondary p-1 rounded-[--radius-lg] border border-border">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-[--radius-md] transition-all"
            >−</button>
            <div className="w-8 text-center text-label-lg font-bold text-text-primary">
               <AnimatedCounter value={qty} />
            </div>
            <button
              onClick={() => setQty(Math.min(effectiveStock, qty + 1))}
              disabled={qty >= effectiveStock}
              className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-[--radius-md] transition-all disabled:opacity-30 disabled:hover:bg-transparent"
            >+</button>
          </div>
      </div>

      {/* Purchase Mode Toggle: Subscribe & Save */}
      <div className="flex flex-col gap-4 mt-2">
         <div className="flex flex-col gap-2">
            <button 
               onClick={() => setIsSubscription(false)}
               className={`flex items-center justify-between p-4 rounded-[--radius-xl] border-2 transition-all ${!isSubscription ? 'border-brand bg-brand/5 shadow-sm' : 'border-border bg-bg-secondary hover:border-text-tertiary'}`}
            >
               <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all ${!isSubscription ? 'border-brand' : 'border-text-tertiary'}`}>
                      {!isSubscription && <div className="w-2.5 h-2.5 bg-brand rounded-full animate-in zoom-in-50 duration-300" />}
                  </div>
                  <div className="text-left">
                      <p className="text-label-sm font-bold text-text-primary">One-time Purchase</p>
                      <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest mt-0.5">Standard delivery</p>
                  </div>
               </div>
               <span className="text-label-lg font-bold text-text-primary">₹{effectivePrice.toLocaleString('en-IN')}</span>
            </button>

            <button 
               onClick={() => setIsSubscription(true)}
               className={`flex items-center justify-between p-4 rounded-[--radius-xl] border-2 transition-all relative overflow-hidden group ${isSubscription ? 'border-success bg-success/5 shadow-sm' : 'border-border bg-bg-secondary hover:border-text-tertiary'}`}
            >
               <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all ${isSubscription ? 'border-success' : 'border-text-tertiary'}`}>
                      {isSubscription && <div className="w-2.5 h-2.5 bg-success rounded-full animate-in zoom-in-50 duration-300" />}
                  </div>
                  <div className="text-left">
                      <div className="flex items-center gap-2">
                         <p className="text-label-sm font-bold text-text-primary">Subscribe & Save</p>
                         <div className="px-1.5 py-0.5 bg-success text-white text-[8px] font-black uppercase rounded-[--radius-sm] flex items-center gap-0.5 shadow-sm shadow-success/20">
                            <Zap size={8} fill="currentColor" /> 10% OFF
                         </div>
                      </div>
                      <p className="text-[10px] text-success/70 font-bold uppercase tracking-widest mt-0.5 flex items-center gap-1">
                         <RefreshCw size={10} className={isSubscription ? 'animate-spin-slow' : ''} />
                         Recurring Delivery
                      </p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-label-lg font-bold text-text-primary">₹{Math.floor(effectivePrice * 0.9).toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-text-tertiary line-through font-medium">₹{effectivePrice.toLocaleString('en-IN')}</p>
               </div>
            </button>
         </div>

         {/* Frequency Selector for Subscriptions */}
         <AnimatePresence>
            {isSubscription && (
                <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: "auto", opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   transition={{ duration: 0.3 }}
                   className="overflow-hidden"
                >
                   <div className="flex flex-col gap-2 p-1 border-t border-border mt-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-tertiary ml-1">Delivery Frequency</span>
                      <div className="grid grid-cols-3 gap-2">
                         {['weekly', 'bi-weekly', 'monthly'].map((freq: any) => (
                            <button
                               key={freq}
                               onClick={() => setFrequency(freq)}
                               className={`px-3 py-2 rounded-[--radius-lg] text-[10px] font-bold uppercase tracking-widest transition-all ${frequency === freq ? 'bg-text-primary text-bg-primary' : 'bg-bg-secondary text-text-secondary border border-border hover:border-text-tertiary'}`}
                            >
                               {freq.replace('-', ' ')}
                            </button>
                         ))}
                      </div>
                   </div>
                </motion.div>
            )}
         </AnimatePresence>
      </div>

      <div className="h-px bg-border my-2" />

      {/* Mobile Sticky Add To Cart & Standard View */}
      <div className="flex flex-col md:flex-row gap-3 pt-2">
        <Button
          onClick={handleAdd}
          disabled={effectiveStock === 0}
          loading={subscriptionLoading}
          className="flex-1 h-14"
          size="xl"
          variant={isSubscription ? "success" : "brand"}
          icon={isSubscription ? <Calendar size={18} /> : <ShoppingCart size={18} />}
        >
          {effectiveStock === 0 ? 'Out of Stock' : isSubscription ? `Subscribe Now` : 'Add to Cart'}
        </Button>
        <div className="flex gap-3">
            <Button
              onClick={handleEnquiry}
              variant="secondary"
              className="h-14 px-6"
              icon={<MessageSquare size={18} />}
            >
              Enquire
            </Button>
            <Button
              onClick={handleWishlist}
              variant="secondary"
              className={`h-14 px-5 transition-colors ${isWished && 'bg-danger/10 text-danger border-danger/20 hover:bg-danger/20 hover:text-danger'}`}
              aria-label="Wishlist"
            >
              <Heart size={20} className={isWished ? 'fill-danger stroke-danger' : ''} />
            </Button>
        </div>

        {/* Mobile Sticky Action Bar */}
        <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-bg-primary/95 backdrop-blur-md border-t border-border z-40 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="container-app flex items-center gap-3">
               <div className="flex-col hidden xs:flex w-1/3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand">{qty} Item{qty > 1 && 's'}</span>
                  <span className="text-h4 font-bold text-text-primary">₹{(effectivePrice * qty).toLocaleString('en-IN')}</span>
               </div>
               <Button
                 onClick={handleAdd}
                 disabled={effectiveStock === 0}
                 className="flex-1 h-12"
                 size="lg"
                 variant="brand"
                 icon={<ShoppingCart size={18} />}
               >
                 {effectiveStock === 0 ? 'Out of Stock' : 'Add to Cart'}
               </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
