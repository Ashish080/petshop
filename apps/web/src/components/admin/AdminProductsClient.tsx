'use client';

import { useState, useTransition } from 'react';
import { 
    Plus, Search, Edit2, Trash2, 
    AlertTriangle, Package, Filter,
    Activity, ArrowUpRight, TrendingUp,
    ShieldAlert, Zap, Layers, Command,
    Clock, Cpu, Crosshair, BarChart3
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

  const getImpact = (category: string) => {
    const critical = ['food', 'meds', 'health', 'wellness'];
    if (critical.includes(category.toLowerCase())) return { label: 'CRITICAL', color: 'text-danger bg-danger/10 border-danger/20' };
    return { label: 'STANDARD', color: 'text-info bg-info/10 border-info/20' };
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
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1 italic">Shortfall Risk</p>
                      <p className="text-2xl font-black text-danger italic tracking-tighter">03</p>
                  </div>
              </div>
              <button
                onClick={() => { setEditProduct(null); setPanelOpen(true); }}
                className="h-14 px-8 rounded-2xl bg-brand text-white flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest italic transition-all active:scale-95 hover:translate-x-1"
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
              className="w-full h-14 glass rounded-2xl pl-12 pr-6 text-sm font-bold text-white placeholder:text-white/10 border border-white/5 focus:border-brand/40 outline-none transition-all backdrop-blur-3xl"
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

      {/* 3. ASSET INTELLIGENCE TABLE */}
      <div className="glass rounded-[32px] border border-white/5 overflow-hidden shadow-2xl backdrop-blur-3xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Asset Profile</th>
              <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic hidden md:table-cell">Mission Impact</th>
              <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Stock Pulse</th>
              <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Outage Prediction</th>
              <th className="px-8 py-5 text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => {
                const impact = getImpact(product.category || '');
                const prediction = product.stock === 0 ? 'DEPLETED' : product.stock < 10 ? '4 DAYS REMAINING' : 'STABLE';
                
                return (
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
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] font-bold text-white/20 uppercase italic tracking-widest">{product.category}</span>
                                    <div className="w-1 h-1 bg-white/10 rounded-full" />
                                    <span className="text-[9px] font-bold text-brand italic tracking-tighter">₹{product.price.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                        </td>
                        <td className="px-8 py-6 hidden md:table-cell">
                            <div className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black italic uppercase", impact.color)}>
                                <ShieldAlert size={12} />
                                {impact.label}
                            </div>
                        </td>
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-1.5 bg-white/[0.03] rounded-full overflow-hidden w-24">
                                    <div className={cn("h-full rounded-full", product.stock === 0 ? 'bg-danger' : product.stock < 10 ? 'bg-warning' : 'bg-success')} style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }} />
                                </div>
                                <span className={cn("text-[10px] font-black italic", product.stock === 0 ? 'text-danger' : product.stock < 10 ? 'text-warning' : 'text-white/60')}>
                                    {product.stock}U
                                </span>
                            </div>
                        </td>
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                                <Clock size={12} className={cn(product.stock < 10 ? 'text-danger' : 'text-white/20')} />
                                <span className={cn("text-[10px] font-black uppercase italic tracking-widest", product.stock < 10 ? 'text-danger' : 'text-white/40')}>
                                    {prediction}
                                </span>
                            </div>
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
                );
            })}
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
