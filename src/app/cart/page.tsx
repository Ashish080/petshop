'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const { items, subtotal, delivery, total, itemCount, updateQuantity, removeItem, clearCart } = useCartStore();
  const { data: session } = useSession();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything yet</p>
          <Link href="/products">
            <Button variant="primary" size="lg" className="gap-2">
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({itemCount} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.product}-${item.variantName}`} className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-6">
                {/* Image */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <Image
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                  {item.variantName && (
                    <p className="text-sm text-gray-500 mb-2">Variant: {item.variantName}</p>
                  )}
                  <p className="text-lg font-bold text-orange-500 mb-4">
                    ₹{item.price.toLocaleString('en-IN')}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-xl">
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity - 1, item.variantName)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product, item.quantity + 1, item.variantName)}
                        className="p-2 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product, item.variantName)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <Button onClick={clearCart} variant="outline" className="w-full">
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="font-semibold">{delivery === 0 ? 'FREE' : `₹${delivery.toLocaleString('en-IN')}`}</span>
                </div>
                {delivery === 0 && (
                  <p className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-full inline-block">
                    ✓ Free delivery on orders above ₹499
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-orange-500">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {session ? (
                <Link href="/checkout">
                  <Button variant="primary" size="lg" className="w-full gap-2">
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login?callbackUrl=/checkout">
                  <Button variant="primary" size="lg" className="w-full gap-2">
                    Sign in to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              )}

              <Link href="/products" className="block text-center mt-4 text-orange-500 font-medium hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
