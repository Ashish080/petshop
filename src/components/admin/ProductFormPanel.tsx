'use client';
import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Product, ProductVariant } from '@/types';
import { Button } from '@/components/ui/Button';

const CATEGORIES = ['food','toys','grooming','accessories','health','bedding'];

export function ProductFormPanel({
  product, onSave, onClose,
}: {
  product: Product | null;
  onSave: (data: Partial<Product>) => Promise<void>;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0,
    category: product?.category ?? 'food',
    stock: product?.stock ?? 0,
    lowStockThreshold: product?.lowStockThreshold ?? 5,
    images: product?.images ?? [''],
    variants: product?.variants ?? [],
  });

  const addVariant = () =>
    setForm({ ...form, variants: [...form.variants, { _id: Date.now().toString(), name: '', sku: '', price: 0, stock: 0 }] });

  const updateVariant = (i: number, key: keyof ProductVariant, val: any) =>
    setForm({ ...form, variants: form.variants.map((v, j) => j === i ? { ...v, [key]: val } : v) });

  const removeVariant = (i: number) =>
    setForm({ ...form, variants: form.variants.filter((_, j) => j !== i) });

  const handleSubmit = async () => {
    setLoading(true);
    await onSave({ ...form, images: form.images.filter(Boolean) });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-white border-l border-gray-200 overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">{product ? 'Edit product' : 'Add product'}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm text-gray-500 block mb-1.5">Product name *</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Royal Canin Dog Food"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm text-gray-500 block mb-1.5">Category *</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 capitalize"
              value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Product['category'] })}
            >
              {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1.5">Price (₹) *</label>
              <input
                type="number" min={0}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                value={form.price} onChange={e => setForm({ ...form, price: +e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1.5">Stock qty *</label>
              <input
                type="number" min={0}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                value={form.stock} onChange={e => setForm({ ...form, stock: +e.target.value })}
              />
            </div>
          </div>

          {/* Low stock threshold */}
          <div>
            <label className="text-sm text-gray-500 block mb-1.5">Low stock alert (units)</label>
            <input
              type="number" min={1}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              value={form.lowStockThreshold} onChange={e => setForm({ ...form, lowStockThreshold: +e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-500 block mb-1.5">Description</label>
            <textarea
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the product..."
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="text-sm text-gray-500 block mb-1.5">Image URL</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              value={form.images[0]} onChange={e => setForm({ ...form, images: [e.target.value] })}
              placeholder="https://res.cloudinary.com/..."
            />
          </div>

          {/* Variants */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-gray-500 font-medium">Variants (size / weight)</label>
              <button
                onClick={addVariant}
                className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Add variant
              </button>
            </div>
            {form.variants.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-3 border border-dashed border-gray-200 rounded-xl">
                No variants. Add one for size/weight options.
              </p>
            )}
            {form.variants.map((v, i) => (
              <div key={v._id} className="grid grid-cols-[1fr_90px_80px_32px] gap-2 mb-2 items-center">
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  placeholder="Name (e.g. 500g)"
                  value={v.name} onChange={e => updateVariant(i, 'name', e.target.value)}
                />
                <input
                  type="number" placeholder="₹ Price"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  value={v.price} onChange={e => updateVariant(i, 'price', +e.target.value)}
                />
                <input
                  type="number" placeholder="Stock"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  value={v.stock} onChange={e => updateVariant(i, 'stock', +e.target.value)}
                />
                <button onClick={() => removeVariant(i)} className="text-gray-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button loading={loading} onClick={handleSubmit} className="flex-1">
            {product ? 'Save changes' : 'Create product'}
          </Button>
        </div>
      </div>
    </div>
  );
}
