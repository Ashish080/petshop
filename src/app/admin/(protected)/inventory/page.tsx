'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Package, Search, AlertTriangle } from 'lucide-react';

function InventoryContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && session?.user?.role !== 'admin')) {
      router.push('/auth/login');
    } else if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchProducts();
    }
  }, [status, session, router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=100');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id: string, stock: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock })
      });

      const data = await res.json();
      if (res.ok && data.product) {
        fetchProducts();
        setEditingId(null);
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStock = showLowStockOnly ? p.isLowStock : true;
    return matchesSearch && matchesStock;
  });

  const stats = {
    total: products.length,
    lowStock: products.filter(p => p.isLowStock).length,
    outOfStock: products.filter(p => p.stock === 0).length
  };

  return (
    <>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory</h1>
          <p className="text-gray-600">Track and manage stock levels</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-500 mb-2">Total Products</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-500 mb-2">Low Stock</p>
            <p className="text-3xl font-bold text-amber-500">{stats.lowStock}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-500 mb-2">Out of Stock</p>
            <p className="text-3xl font-bold text-red-500">{stats.outOfStock}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <button
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${
                showLowStockOnly
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Low Stock Only
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Product</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Current Stock</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Threshold</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-b border-gray-50">
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    {product.variants.length > 0 && (
                      <p className="text-xs text-gray-500">{product.variants.length} variants</p>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="primary" className="capitalize">{product.category}</Badge>
                  </td>
                  <td className="py-4 px-6">
                    {editingId === product._id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                          className="w-24"
                          autoFocus
                        />
                        <button
                          onClick={() => updateStock(product._id, editStock)}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-medium"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <span className={`font-semibold ${
                        product.stock === 0 ? 'text-red-500' :
                        product.isLowStock ? 'text-amber-500' : 'text-green-500'
                      }`}>
                        {product.stock}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{product.lowStockThreshold}</td>
                  <td className="py-4 px-6">
                    <Badge variant={
                      product.stock === 0 ? 'danger' :
                      product.isLowStock ? 'warning' : 'success'
                    }>
                      {product.stock === 0 ? 'Out of Stock' :
                       product.isLowStock ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {editingId !== product._id && (
                      <button
                        onClick={() => {
                          setEditingId(product._id);
                          setEditStock(product.stock);
                        }}
                        className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600"
                      >
                        Update Stock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </>
  );
}

export default function AdminInventoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <InventoryContent />
    </Suspense>
  );
}
