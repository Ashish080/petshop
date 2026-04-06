'use client';

import { useState, useTransition } from 'react';
import { 
    Plus, Search, Edit2, Trash2, 
    AlertTriangle, Package, Filter,
    Activity, ArrowUpRight, TrendingUp,
    ShieldAlert, Zap, Layers, Command
} from 'lucide-react';
import type { Product } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { ProductFormPanel } from './ProductFormPanel';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

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
    if (!confirm('Execute deletion protocol?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setProducts(products.filter(p => p._id !== id));
      toast.success('Mission asset terminated');
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
    if (!res.ok) { toast.error('Protocol failed'); return; }
    const json = await res.json();
    const saved = json.data || json;
    if (editProduct) {
      setProducts(products.map(p => p._id === saved._id ? saved : p));
      toast.success('Asset updated');
    } else {
      setProducts([saved, ...products]);
      toast.success('New asset commissioned');
    }
    setPanelOpen(false);
    setEditProduct(null);
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      
      {/* 1. STRATEGIC HUB HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-10 glass rounded-[40px] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 blur-[100px] rounded-full -mr-40 -mt-40 pointer-events-none" />
          
          <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-brand/10 border border-brand/20">
                      <Layers size={20} className="text-brand" />
                  </div>
                  <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Inventory Hub</h2>
              </div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                  Stock Intelligence & Asset Lifecycle Hub
              </p>
          </div>

          <div className="flex items-center gap-4 relative z-10">
              <div className="hidden lg:flex items-center gap-8 mr-8">
                  <div className="text-right">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1 italic">Total Assets</p>
                      <p className="text-2xl font-black text-white italic tracking-tighter">{products.length}</p>
                  </div>
                  <div className="text-right">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1 italic">Low Criticality</p>
                      <p className="text-2xl font-black text-danger italic tracking-tighter">{products.filter(p => p.stock === 0 || p.isLowStock).length}</p>
                  </div>
              </div>
              <button
                onClick={() => { setEditProduct(null); setPanelOpen(true); }}
                className="h-14 px-8 rounded-2xl bg-brand text-white flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] italic hover:translate-x-1 active:scale-95 transition-all shadow-xl shadow-brand/20"
              >
                <Plus size={18} />
                Commission Asset
              </button>
          </div>
      </div>

      {/* 2. COMMAND FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover:text-brand transition-colors" />
            <input
              className="w-full h-14 glass rounded-2xl pl-12 pr-6 text-sm font-bold text-white placeholder:text-white/10 border border-white/5 focus:border-brand/40 outline-none transition-all transition-all backdrop-blur-3xl"
              placeholder="Search strategic assets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="h-14 px-6 glass rounded-2xl border border-white/5 hover:border-white/20 text-white/40 hover:text-white transition-all flex items-center gap-3">
              <Filter size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Filters</span>
          </button>
      </div>

      {/* 3. ASSET TABLE GRID */}
      <div className="glass rounded-[32px] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-3xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Product Profile</th>
              <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic hidden md:table-cell">Taxonomy</th>
              <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Strategic Price</th>
              <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Stock Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product._id} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/[0.03] rounded-2xl border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 overflow-hidden">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={22} className="text-white/20" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white italic uppercase tracking-tight line-clamp-1">{product.name}</p>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.1em] mt-1 italic">UID: {product._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-brand/20 rounded-full" />
                      <span className="text-[10px] font-bold text-white/40 uppercase italic tracking-widest">{product.category}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-lg font-black text-white italic tracking-tighter">₹{product.price.toLocaleString('en-IN')}</p>
                </td>
                <td className="px-8 py-6">
                  {product.stock === 0 ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-danger/10 border border-danger/20 w-fit">
                          <AlertTriangle size={12} className="text-danger" />
                          <span className="text-[9px] font-black text-danger uppercase italic">CRITICAL DEPLETION</span>
                      </div>
                  ) : product.isLowStock ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20 w-fit">
                          <ShieldAlert size={12} className="text-warning" />
                          <span className="text-[9px] font-black text-warning uppercase italic">LOW: {product.stock} UNITS</span>
                      </div>
                  ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 w-fit">
                          <Zap size={12} className="text-success" />
                          <span className="text-[9px] font-black text-success uppercase italic">{product.stock} SECURE</span>
                      </div>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3 justify-end opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                    <button
                      onClick={() => { setEditProduct(product); setPanelOpen(true); }}
                      className="w-10 h-10 rounded-xl glass border border-white/10 text-white/40 hover:text-brand hover:border-brand/40 transition-all flex items-center justify-center"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="w-10 h-10 rounded-xl glass border border-white/5 text-white/20 hover:text-danger hover:border-danger/40 transition-all flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-24 text-center">
                  <div className="flex flex-col items-center justify-center grayscale opacity-20">
                      <Command size={60} className="mb-6" />
                      <p className="text-xl font-black text-white italic uppercase tracking-tighter">No Strategic Data Found</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-2">Check filter protocols</p>
                  </div>
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
