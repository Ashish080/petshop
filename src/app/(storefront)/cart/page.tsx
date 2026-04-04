'use client';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Looks like you haven't added anything yet.</p>
        <Link href="/products">
          <Button size="lg">Browse products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Your cart ({itemCount} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.product + (item.variantName ?? '')}
              className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-100"
            >
              <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🐾</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                {item.variantName && (
                  <p className="text-sm text-gray-400">{item.variantName}</p>
                )}
                <p className="text-orange-500 font-bold mt-1">
                  ₹{item.price.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.product, item.variantName)}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity - 1, item.variantName)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                  >−</button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product, item.quantity + 1, item.variantName)}
                    disabled={item.quantity >= (item.stock ?? Number.POSITIVE_INFINITY)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
                  >+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.product + (item.variantName ?? '')} className="flex justify-between text-sm text-gray-600">
                <span className="truncate max-w-[160px]">{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-4 mb-1 flex justify-between text-sm text-gray-500">
            <span>Delivery</span>
            <span className="text-green-600 font-medium">{total >= 499 ? 'Free' : '₹49'}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-lg mt-2 mb-6">
            <span>Total</span>
            <span>₹{(total + (total >= 499 ? 0 : 49)).toLocaleString('en-IN')}</span>
          </div>
          {total < 499 && (
            <p className="text-xs text-orange-500 mb-4 text-center">
              Add ₹{(499 - total).toLocaleString('en-IN')} more for free delivery!
            </p>
          )}
          <Link href="/checkout">
            <Button size="lg" className="w-full">Proceed to checkout</Button>
          </Link>
          <Link href="/products" className="block text-center text-sm text-gray-400 hover:text-orange-500 mt-3 transition-colors">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
