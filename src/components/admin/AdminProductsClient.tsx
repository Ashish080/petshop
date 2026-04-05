'use client';
import { useState, useTransition } from 'react';
import { Plus, Search, Edit2, Trash2, AlertTriangle, Package } from 'lucide-react';
import type { Product } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProductFormPanel } from './ProductFormPanel';
import toast from 'react-hot-toast';

export function AdminProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = products.filter(p =>
    (p.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (p.category?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts(products.filter(p => p._id !== id));
      toast.success('Product deleted');
    }
  };

  const handleSave = async (data: Partial<Product>) => {
    const method = editProduct ? 'PUT' : 'POST';
    const url = editProduct ? `/api/products/${editProduct._id}` : '/api/products';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) { toast.error('Failed to save'); return; }
    const json = await res.json();
    const saved = json.data || json;
    if (editProduct) {
      setProducts(products.map(p => p._id === saved._id ? saved : p));
      toast.success('Product updated');
    } else {
      setProducts([saved, ...products]);
      toast.success('Product created');
    }
    setPanelOpen(false);
    setEditProduct(null);
  };

  const stockBadge = (p: Product) => {
    if (p.stock === 0) return <Badge variant="danger">Out of stock</Badge>;
    if (p.isLowStock) return <Badge variant="warning">Low: {p.stock}</Badge>;
    return <Badge variant="success">{p.stock} units</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-600 mt-1">
            {products.length} total · {products.filter(p => p.stock === 0).length} out of stock
          </p>
        </div>
        <Button
          onClick={() => { setEditProduct(null); setPanelOpen(true); }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add product
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input
          className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Product</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide hidden md:table-cell">Category</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Price</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Stock</th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide hidden sm:table-cell">Variants</th>
              <th className="px-5 py-4" />
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded-xl" />
                      ) : (
                        <Package className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-600 mt-0.5">ID: {product._id.slice(-6)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="capitalize text-gray-600">{product.category}</span>
                </td>
                <td className="px-5 py-4 font-medium text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </td>
                <td className="px-5 py-4">{stockBadge(product)}</td>
                <td className="px-5 py-4 hidden sm:table-cell text-gray-600">
                  {product.variants?.length > 0 ? `${product.variants.length} variant${product.variants.length > 1 ? 's' : ''}` : '—'}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => { setEditProduct(product); setPanelOpen(true); }}
                      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-orange-500 hover:border-orange-300 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-red-500 hover:border-red-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-gray-600">
                  <Package className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-in form panel */}
      {panelOpen && (
        <ProductFormPanel
          product={editProduct}
          onSave={handleSave}
          onClose={() => { setPanelOpen(false); setEditProduct(null); }}
        />
      )}
    </div>
  );
}
