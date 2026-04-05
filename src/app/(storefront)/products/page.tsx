'use client';

import { useState, useMemo } from 'react';
import { productsData } from '@/data/products';
import ProductCard from '@/components/cards/ProductCard';
import { themeConfig } from '@/config/theme';
import { Sparkles, ShoppingBag, Filter, ArrowUpDown, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All Products', 'Food', 'Accessories', 'Toys', 'Health', 'Grooming'];

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState('All Products');
    const [sortOrder, setSortOrder] = useState<'newest' | 'price-low' | 'price-high'>('newest');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = useMemo(() => {
        let result = [...productsData];

        // Filter by category
        if (selectedCategory !== 'All Products') {
            result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.category?.toLowerCase().includes(query)
            );
        }

        // Sort
        switch (sortOrder) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            default: // newest - since we don't have dates, we keep original index or assume DESC
                break;
        }

        return result;
    }, [selectedCategory, searchQuery, sortOrder]);

    return (
        <div className="py-12 md:py-24 min-h-screen bg-bg-page transition-colors duration-300 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className={themeConfig.spacing.container + " relative z-10 px-6"}>

                {/* Product Header */}
                <div className="mb-20 text-center lg:text-left flex flex-col lg:flex-row items-end justify-between gap-12">
                    <div className="max-w-2xl">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-secondary/10 text-secondary font-black text-xs uppercase tracking-[0.3em] mb-8 border border-secondary/20 shadow-sm"
                        >
                            <Sparkles size={16} fill="currentColor" className="animate-pulse" />
                            Premium Pet Supplies
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-8xl font-black text-zinc-900 tracking-tighter leading-[0.8] mb-8"
                        >
                            HAPPY ESSENTIALS <br />
                            FOR <span className="text-brand-primary">HAPPY PAWS.</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-zinc-500 font-bold max-w-lg leading-relaxed"
                        >
                            Curated excellence for your companions. Every product is vetted for safety, nutrition, and ultimate joy.
                        </motion.p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-5 w-full lg:w-auto">
                        <div className="relative w-full md:w-64 group">
                             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-brand-primary transition-colors" size={20} />
                             <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-16 pr-6 py-6 bg-white border border-zinc-100 rounded-[32px] font-bold text-zinc-900 focus:ring-[12px] focus:ring-brand-primary/5 focus:border-brand-primary/20 transition-all outline-none"
                                placeholder="Search inventory..."
                             />
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <select 
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as any)}
                                className="flex-1 md:w-auto py-6 px-10 bg-white border border-zinc-100 rounded-[32px] font-black text-sm text-zinc-900 outline-none hover:bg-zinc-50 transition-all cursor-pointer shadow-sm appearance-none"
                            >
                                <option value="newest text-zinc-400">Sort: Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-4 mb-16 px-2 overflow-x-auto pb-4 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-10 py-5 rounded-[28px] font-black text-sm tracking-widest uppercase transition-all border-2 whitespace-nowrap ${
                                selectedCategory === cat 
                                ? 'bg-zinc-900 border-zinc-900 text-white shadow-2xl shadow-zinc-900/30 -translate-y-1' 
                                : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-300 hover:text-zinc-900'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <AnimatePresence mode="popLayout">
                    <motion.div 
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12"
                    >
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProductCard {...product} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {filteredProducts.length === 0 && (
                    <div className="py-40 text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-zinc-50 rounded-[40px] flex items-center justify-center text-zinc-200 mb-8">
                             <Search size={40} />
                        </div>
                        <h3 className="text-3xl font-black text-zinc-900 tracking-tighter mb-4">No Inventory Matches.</h3>
                        <p className="text-zinc-500 font-bold text-lg mb-8">Try adjusting your search or category filters.</p>
                        <button onClick={() => {setSelectedCategory('All Products'); setSearchQuery('');}} className="px-10 py-4 bg-zinc-900 text-white font-black rounded-2xl">
                             Clear All Filters
                        </button>
                    </div>
                )}

                {/* Newsletter Hook - Refined Visibility */}
                <div className="mt-32 p-16 lg:p-24 bg-zinc-50 rounded-[64px] border border-zinc-100/50 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-secondary/10 opacity-30 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                        <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center text-brand-primary mb-10 shadow-xl shadow-brand-primary/10">
                            <ShoppingBag size={40} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-4xl md:text-6xl font-black text-zinc-900 tracking-tighter mb-6 leading-none italic">CAN'T FIND <br />THE JOY?</h3>
                        <p className="text-zinc-600 font-black text-lg mb-12 uppercase tracking-widest opacity-80">
                            We restock every Tuesday! ⚡ <br /> Sign up for first priority notification.
                        </p>
                        <div className="w-full flex flex-col sm:flex-row gap-4 p-3 bg-white rounded-[40px] border border-zinc-100 shadow-2xl shadow-zinc-200/50">
                            <input
                                type="email"
                                placeholder="commander@email.com"
                                className="flex-1 bg-transparent px-8 py-5 outline-none font-bold text-zinc-900 placeholder:text-zinc-400"
                            />
                            <button className="px-12 py-5 bg-zinc-900 text-white font-black text-lg rounded-[32px] shadow-2xl shadow-zinc-900/10 hover:scale-105 active:scale-95 transition-all">
                                Keep Me Updated 🐾
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
