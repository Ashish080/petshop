'use client';

import { useCartStore, useCartUIStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { motionPresets, duration, easing } from '@/lib/motion';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, total, itemCount, delivery } = useCartStore();
  const { isOpen, closeCart } = useCartUIStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.normal }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            {...motionPresets.slideRight}
            className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-bg-primary shadow-2xl flex flex-col border-l border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-bg-secondary/50">
              <div className="flex items-center gap-3">
                 <ShoppingBag size={24} className="text-text-primary" />
                 <h2 className="text-h3 font-bold text-text-primary tracking-tight">Your Cart</h2>
                 {itemCount > 0 && (
                     <span className="bg-brand text-white text-label-sm px-2 py-0.5 rounded-full font-bold">
                         {itemCount}
                     </span>
                 )}
              </div>
              <button 
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-bg-tertiary text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {items.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="w-24 h-24 rounded-full bg-bg-tertiary flex items-center justify-center text-text-tertiary">
                    <ShoppingBag size={48} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-h3 text-text-primary mb-2">Cart is empty</h3>
                    <p className="text-body text-text-secondary max-w-[250px]">
                      Looks like you haven't discovered anything premium yet.
                    </p>
                  </div>
                  <Button onClick={closeCart} variant="secondary" size="lg">
                    Continue Shopping
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-6 relative">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -20, height: 0, marginBottom: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        key={item.product + (item.variantName ?? '')}
                        className="flex gap-4 p-4 rounded-[--radius-xl] bg-bg-tertiary border border-border group"
                      >
                        <div className="relative w-20 h-20 rounded-[--radius-lg] bg-bg-elevated overflow-hidden flex-shrink-0 border border-border">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🐾</div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-2">
                             <div>
                                <h4 className="text-label-lg text-text-primary leading-tight line-clamp-2 pr-4">{item.name}</h4>
                                {item.variantName && (
                                    <span className="text-label-sm text-text-tertiary mt-1 block uppercase tracking-wider">{item.variantName}</span>
                                )}
                             </div>
                             <button
                               onClick={() => removeItem(item.product, item.variantName)}
                               className="text-text-tertiary hover:text-danger p-1 rounded-md hover:bg-danger/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                             >
                                <Trash2 size={16} />
                             </button>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                             <div className="text-label-lg font-bold text-text-primary">
                                ₹{item.price.toLocaleString('en-IN')}
                             </div>
                             
                             <div className="flex items-center gap-3 bg-bg-secondary rounded-[--radius-md] border border-border px-1 py-0.5">
                                 <button
                                     onClick={() => updateQuantity(item.product, item.quantity - 1, item.variantName)}
                                     className="w-7 h-7 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors text-lg"
                                 >−</button>
                                 <div className="w-4 text-center font-bold text-text-primary text-sm flex justify-center">
                                    <AnimatedCounter value={item.quantity} />
                                 </div>
                                 <button
                                     onClick={() => updateQuantity(item.product, item.quantity + 1, item.variantName)}
                                     disabled={item.quantity >= (item.stock ?? Number.POSITIVE_INFINITY)}
                                     className="w-7 h-7 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors text-lg disabled:opacity-30"
                                 >+</button>
                             </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer / Summary - Sticky */}
            {items.length > 0 && (
                <div className="border-t border-border bg-bg-elevated p-6 space-y-4">
                  <div className="flex justify-between text-body-sm text-text-secondary font-medium">
                      <span>Subtotal</span>
                      <span>₹{(total - delivery).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-body-sm text-text-secondary font-medium">
                      <span>Delivery</span>
                      <span className={delivery === 0 ? 'text-success font-bold' : ''}>
                          {delivery === 0 ? 'FREE' : `₹${delivery.toLocaleString('en-IN')}`}
                      </span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between items-end mb-6">
                      <span className="text-label-lg text-text-primary font-bold">Total</span>
                      <div className="text-h2 text-text-primary font-black tracking-tight flex">
                          <span className="text-text-tertiary mr-1 font-semibold text-xl self-end mb-1">₹</span>
                          <AnimatedCounter value={total} />
                      </div>
                  </div>

                  <Link href="/checkout" onClick={closeCart} className="block w-full">
                    <Button size="lg" variant="brand" fullWidth iconRight={<ArrowRight size={18} />}>
                       Proceed to Checkout
                    </Button>
                  </Link>
                </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
