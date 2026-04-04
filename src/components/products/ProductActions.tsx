'use client';
import { useState } from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import type { Product as IProduct, ProductVariant as IVariant } from '@/types';
import { Button } from '@/components/ui/Button';

export function ProductActions({ product }: { product: IProduct }) {
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(
    product.variants?.[0] ?? null
  );
  const [wished, setWished] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const effectivePrice = selectedVariant ? selectedVariant.price : product.price;
  const effectiveStock = selectedVariant ? selectedVariant.stock : product.stock;

  const handleAdd = () => {
    if (effectiveStock === 0) return;
    addItem({
      product: product._id,
      name: product.name,
      price: effectivePrice,
      image: product.images[0] ?? '',
      quantity: qty,
      variantName: selectedVariant?.name,
      stock: effectiveStock,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Variants */}
      {product.variants?.length > 0 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Select size / weight</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v._id}
                onClick={() => setSelectedVariant(v)}
                disabled={v.stock === 0}
                className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  selectedVariant?._id === v._id
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-orange-400'
                }`}
              >
                {v.name}
                {v.stock === 0 && ' (sold out)'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Quantity</span>
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg"
          >−</button>
          <span className="w-8 text-center font-medium text-gray-900">{qty}</span>
          <button
            onClick={() => setQty(Math.min(effectiveStock, qty + 1))}
            disabled={qty >= effectiveStock}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg disabled:opacity-30"
          >+</button>
        </div>
        <span className="text-sm text-gray-400">{effectiveStock} in stock</span>
      </div>

      {/* Effective price if variant selected */}
      {selectedVariant && (
        <p className="text-2xl font-bold text-gray-900">
          ₹{effectivePrice.toLocaleString('en-IN')}
        </p>
      )}

      {/* CTA */}
      <div className="flex gap-3">
        <Button
          onClick={handleAdd}
          disabled={effectiveStock === 0}
          className="flex-1 flex items-center justify-center gap-2"
          size="lg"
        >
          <ShoppingCart className="w-5 h-5" />
          {effectiveStock === 0 ? 'Out of stock' : 'Add to cart'}
        </Button>
        <button
          onClick={() => setWished(!wished)}
          className={`p-3 rounded-xl border transition-all ${
            wished ? 'border-red-300 text-red-500 bg-red-50' : 'border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400'
          }`}
        >
          <Heart className={`w-5 h-5 ${wished ? 'fill-red-500' : ''}`} />
        </button>
      </div>
    </div>
  );
}
