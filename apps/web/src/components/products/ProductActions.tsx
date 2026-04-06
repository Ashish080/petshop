'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, MessageSquare } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import type { Product as IProduct, ProductVariant as IVariant } from '@/types';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { brandConfig } from '@/config/brand';

export function ProductActions({ product }: { product: IProduct }) {
  const [qty, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(
    product.variants?.[0] ?? null
  );
  const [wished, setWished] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const effectivePrice = selectedVariant ? selectedVariant.price : product.price;
  const effectiveStock = selectedVariant ? selectedVariant.stock : product.stock;

  const handleAdd = () => {
    if (!session) {
      toast.error('Please login first to add items to cart');
      router.push('/login');
      return;
    }
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

  const handleEnquiry = () => {
    if (!session) {
      toast.error('Please login to send an enquiry');
      router.push('/login');
      return;
    }
    const msg = encodeURIComponent(`Hello, I'm interested in ${product.name}.`);
    window.open(`https://wa.me/${brandConfig.phone.replace(/\D/g, '')}?text=${msg}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Variants */}
      {product.variants?.length > 0 && (
        <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 ml-2">Select Variant</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v: IVariant) => (
              <button
                key={v._id}
                onClick={() => setSelectedVariant(v)}
                disabled={v.stock === 0}
                className={`px-6 py-3 rounded-2xl text-sm font-bold border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  selectedVariant?._id === v._id
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl'
                    : 'bg-white text-zinc-600 border-zinc-100 hover:border-brand-primary/30'
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
      <div className="flex items-center justify-between bg-zinc-50 p-6 rounded-[32px] border border-zinc-100">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Quantity</span>
          <span className="text-xs font-bold text-zinc-600 ml-2 mt-1">{effectiveStock} available</span>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-zinc-100 shadow-sm">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors text-xl font-bold"
          >−</button>
          <span className="w-6 text-center font-black text-zinc-900">{qty}</span>
          <button
            onClick={() => setQty(Math.min(effectiveStock, qty + 1))}
            disabled={qty >= effectiveStock}
            className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors text-xl font-bold disabled:opacity-30"
          >+</button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        <Button
          onClick={handleAdd}
          disabled={effectiveStock === 0}
          className="h-20 rounded-[32px] text-lg font-black flex items-center justify-center gap-3 shadow-2xl shadow-brand-primary/20"
          size="lg"
        >
          <ShoppingCart size={22} strokeWidth={2.5} />
          {effectiveStock === 0 ? 'Out of stock' : 'Add to Cart'}
        </Button>
        <button
          onClick={handleEnquiry}
          className="h-20 rounded-[32px] border-2 border-zinc-900 text-zinc-900 font-black text-lg hover:bg-zinc-900 hover:text-white transition-all flex items-center justify-center gap-3"
        >
          <MessageSquare size={22} strokeWidth={2.5} />
          Direct Enquiry
        </button>
      </div>

      <div className="flex gap-4">
         <button
            onClick={() => setWished(!wished)}
            className={`flex-1 py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
               wished ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-zinc-100 text-zinc-500 hover:border-red-100'
            }`}
         >
            <Heart size={18} className={wished ? 'fill-red-500' : ''} />
            {wished ? "Added to Wishlist" : "Save for Later"}
         </button>
      </div>
    </div>
  );
}
