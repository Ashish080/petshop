'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, PawPrint, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`);
                const data = await res.json();
                setResults(data.products || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchResults, 300);
        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:pt-32">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md cursor-pointer"
                    />

                    {/* Modal Content */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl overflow-hidden relative z-10 border border-slate-100 selection:bg-indigo-100"
                    >
                        <div className="relative">
                            <div className="flex items-center px-6 py-6 border-b border-slate-50">
                                <Search className={`mr-4 transition-colors ${loading ? 'text-indigo-600 animate-pulse' : 'text-slate-400'}`} size={24} />
                                <input 
                                    ref={inputRef}
                                    type="text" 
                                    placeholder="Search for pets, bread, or accessories..."
                                    className="flex-1 bg-transparent border-none outline-none text-lg font-black text-slate-900 placeholder:text-slate-300 placeholder:font-bold"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {loading && query.length > 1 && (
                                    <div className="p-12 text-center flex flex-col items-center gap-4">
                                        <Loader2 className="animate-spin text-indigo-600" size={32} />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Searching the Catalog...</p>
                                    </div>
                                )}

                                {!loading && query.length > 1 && results.length === 0 && (
                                    <div className="p-20 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                            <PawPrint size={28} className="text-slate-300" />
                                        </div>
                                        <h3 className="font-black text-slate-900 mb-1">No Matches Found</h3>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">We couldn't find any items matching your identity.</p>
                                    </div>
                                )}

                                {results.length > 0 && (
                                    <div className="p-4 space-y-2">
                                        <div className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Search Matched</div>
                                        {results.map((item) => (
                                            <Link 
                                                key={item._id} 
                                                href={`/products/${item._id}`}
                                                onClick={onClose}
                                                className="flex items-center gap-4 p-4 hover:bg-indigo-50/50 rounded-2xl transition-all group active:scale-[0.98]"
                                            >
                                                <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                                                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-black text-slate-900 truncate">{item.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">₹ {item.price}</span>
                                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight italic">{item.category} segment</span>
                                                    </div>
                                                </div>
                                                <ArrowRight size={18} className="text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {query.length <= 1 && (
                                    <div className="p-10">
                                        <div className="bg-indigo-50/50 rounded-[40px] p-10 text-center border border-indigo-100 relative overflow-hidden group">
                                             <div className="mb-6 w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-100 text-indigo-600 group-hover:scale-110 transition-transform">
                                                <Package size={28} />
                                             </div>
                                             <h3 className="text-xl font-black text-indigo-900 mb-2">Ready to Search?</h3>
                                             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-relaxed max-w-[180px] mx-auto">Input identification keywords to filter our premium catalog.</p>
                                             
                                             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-600 opacity-5 rounded-full blur-[40px]"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
