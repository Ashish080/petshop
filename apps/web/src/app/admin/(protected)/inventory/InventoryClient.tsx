'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Package, Search, Filter, Plus, Download, 
  ChevronRight, ArrowUpRight, ArrowDownRight, 
  AlertCircle, ShieldCheck, PawPrint, Truck,
  Settings, Save, X, Edit, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CAT_COLORS: Record<string, string> = {
  Pets: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  Food: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Accessories: 'bg-sky-50 text-sky-600 border-sky-100',
  Medicine: 'bg-amber-50 text-amber-600 border-amber-100'
};

export default function InventoryClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, [products]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/inventory/stats');
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (e) { console.error(e); }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const matchSearch = p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase());
      const matchCat = !catFilter || p.category === catFilter;
      const ist = p.stock || 0;
      const th = p.lowStockThreshold || 10;
      const matchStock = !stockFilter || 
        (stockFilter === 'ok' && ist >= th) || 
        (stockFilter === 'low' && ist > 0 && ist < th) ||
        (stockFilter === 'out' && ist === 0);
      return matchSearch && matchCat && matchStock;
    });
  }, [products, query, catFilter, stockFilter]);

  const adjustStock = async (id: string, delta: number) => {
    try {
      const res = await fetch('/api/admin/inventory/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, delta })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p._id === id ? data.data : p));
        toast.success(delta > 0 ? `Stock Incremented` : `Stock Decremented`, {
            style: { background: '#1e293b', color: '#fff', borderRadius: '20px', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }
        });
      }
    } catch (e) { toast.error('Adjustment Failed'); }
  };

  return (
    <div className="space-y-10 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Dynamic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Portfolio SKUs', val: stats?.totalSKUs || 0, sub: 'Across categorized silos', icon: Package },
          { label: 'Critical Thresholds', val: stats?.lowStockItems || 0, sub: 'Requires immediate replenishment', icon: AlertCircle, color: 'text-rose-600' },
          { label: 'Portfolio Asset Value', val: `₹${(stats?.totalValue / 100000).toFixed(1)}L`, sub: 'Estimated purchase cost', icon: ArrowUpRight, color: 'text-emerald-600' },
          { label: 'Available Wildlife', val: stats?.petsAvailable || 0, sub: 'Pets ready for placement', icon: PawPrint, color: 'text-indigo-600' }
        ].map((m, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20 group hover:border-indigo-600 transition-all">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-slate-50 transition-colors ${m.color ? m.color + '/10' : 'text-slate-400'}`}>
                    <m.icon size={20} className={m.color} />
                </div>
                <div className="w-2 h-2 rounded-full bg-slate-100 group-hover:bg-indigo-600 transition-colors"></div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 truncate">{m.label}</p>
            <h3 className={`text-4xl font-black tracking-tight mb-2 ${m.color || 'text-slate-900'}`}>{loading ? '---' : m.val}</h3>
            <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Logic Controls Toolbar */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
                type="text" 
                placeholder="Lookup identification codes or product descriptors..."
                className="w-full pl-16 pr-6 py-5 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm font-bold text-slate-900 transition-all placeholder:text-slate-300"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <select 
                className="px-6 py-5 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-indigo-600 focus:outline-none text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all cursor-pointer"
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
            >
                <option value="">All Category Segments</option>
                {['Pets', 'Food', 'Accessories', 'Medicine'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select 
                className="px-6 py-5 bg-slate-50 rounded-2xl border border-transparent focus:bg-white focus:border-indigo-600 focus:outline-none text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all cursor-pointer"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
            >
                <option value="">Visibility Filter (Stock)</option>
                <option value="ok">In-Stock Surplus</option>
                <option value="low">Critical Deficit</option>
                <option value="out">Zero Inventory</option>
            </select>
        </div>
        <button className="px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:translate-x-1 active:scale-95 transition-all shadow-2xl shadow-slate-900/10">
            <Plus size={16} /> Deploy New SKU
        </button>
      </div>

      {/* Stock Register Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-indigo-600">
                    <Zap size={18} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Stock Register</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0 mt-1">Live Inventory Logs</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white border border-slate-100 px-4 py-2 rounded-full">Showing {filteredProducts.length} items</span>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-white">
                        <th className="px-10 py-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50">Identity / SKU</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50">Descriptor</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 text-center">In-Stock</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50">Deficit Level</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50">Market (Sell)</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50">Assignment</th>
                        <th className="px-6 py-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] border-b border-slate-50 text-right">Adjust</th>
                    </tr>
                </thead>
                <tbody>
                    <AnimatePresence>
                        {filteredProducts.map((p: any) => {
                            const st = p.stock || 0;
                            const th = p.lowStockThreshold || 10;
                            const isLow = st < th;
                            const isOut = st === 0;

                            return (
                                <motion.tr 
                                    key={p._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50"
                                >
                                    <td className="px-10 py-6">
                                        <code className="text-[10px] font-black p-2 bg-slate-50 text-slate-400 group-hover:text-indigo-600 rounded-lg transition-colors">{p.sku}</code>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                                <img src={p.images[0]?.url || p.images[0]} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <span className="block text-sm font-black text-slate-900 truncate max-w-[180px]">{p.name}</span>
                                                <span className={`inline-block px-2 py-0.5 mt-1 rounded-md text-[8px] font-black border uppercase tracking-widest ${CAT_COLORS[p.category] || 'bg-slate-50 text-slate-500'}`}>
                                                    {p.category}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <span className={`text-xl font-black tracking-tight ${isLow ? 'text-rose-600' : 'text-emerald-600'}`}>{st}</span>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Units (Min: {th})</p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(100, (st / Math.max(th * 2, 1)) * 100)}%` }}
                                                className={`h-full ${isOut ? 'bg-rose-600' : isLow ? 'bg-amber-400' : 'bg-emerald-500'}`}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="text-sm font-black text-slate-900 leading-none truncate">₹ {p.price.toLocaleString()}</span>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Buy Cost:</span>
                                            <span className="text-[8px] font-bold text-slate-400 truncate">₹ {p.buyPrice?.toLocaleString() || '---'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest ${isOut ? 'bg-rose-50 text-rose-500 border-rose-100' : isLow ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-rose-500 animate-pulse' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                            {isOut ? 'Depleted' : isLow ? 'At Deficit' : 'Surplus'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                              onClick={() => adjustStock(p._id, 1)}
                                              className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white active:scale-95 transition-all outline-none"
                                            >
                                                <Plus size={16} strokeWidth={3} />
                                            </button>
                                            <button 
                                              onClick={() => adjustStock(p._id, -1)}
                                              disabled={st === 0}
                                              className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white active:scale-95 transition-all outline-none disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <X size={16} strokeWidth={3} />
                                            </button>
                                            <button 
                                              onClick={() => setSelectedProduct(p)}
                                              className="p-3 bg-slate-900 text-white rounded-xl hover:-translate-y-1 shadow-lg active:scale-95 transition-all"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
}
