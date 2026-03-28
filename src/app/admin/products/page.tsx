'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Package, Plus, Search, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

function AdminProductsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'food',
    stock: '',
    lowStockThreshold: '10',
    images: ['']
  });

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

  const openForm = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        lowStockThreshold: product.lowStockThreshold.toString(),
        images: product.images.length > 0 ? product.images : ['']
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'food',
        stock: '',
        lowStockThreshold: '10',
        images: ['']
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          lowStockThreshold: parseInt(formData.lowStockThreshold),
          images: formData.images.filter(img => img.trim())
        })
      });

      const data = await res.json();

      if (data.success) {
        toast.success(editingProduct ? 'Product updated!' : 'Product created!');
        setShowForm(false);
        fetchProducts();
      } else {
        toast.error(data.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Product deleted');
        fetchProducts();
      } else {
        toast.error(data.error || 'Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 p-6 hidden lg:block">
        <Link href="/admin" className="flex items-center gap-2 mb-8">
          <Package className="w-8 h-8 text-orange-500" />
          <span className="text-xl font-bold text-gray-900">Admin</span>
        </Link>

        <nav className="space-y-2">
          <Link href="/admin" className="block px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block px-4 py-3 rounded-xl bg-orange-50 text-orange-600 font-medium">
            Products
          </Link>
          <Link href="/admin/inventory" className="block px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
            Inventory
          </Link>
          <Link href="/admin/orders" className="block px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
            Orders
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Link href="/" className="block px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <Button onClick={() => openForm()} className="gap-2">
            <Plus className="w-5 h-5" /> Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Product</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Price</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Stock</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-b border-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.variants.length} variants</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant="primary" className="capitalize">{product.category}</Badge>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={product.stock === 0 ? 'danger' : product.isLowStock ? 'warning' : 'success'}>
                      {product.stock}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={product.isActive ? 'success' : 'danger'}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openForm(product)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button onClick={() => deleteProduct(product._id)} className="p-2 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add Product'}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400"
                    >
                      <option value="food">Food</option>
                      <option value="toys">Toys</option>
                      <option value="grooming">Grooming</option>
                      <option value="accessories">Accessories</option>
                      <option value="health">Health</option>
                      <option value="bedding">Bedding</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                    <Input
                      type="number"
                      value={formData.lowStockThreshold}
                      onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <Input
                    value={formData.images[0]}
                    onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                    {loading ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <AdminProductsContent />
    </Suspense>
  );
}
