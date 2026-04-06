'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ShoppingBag, Search, Dog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { motionPresets } from '@/lib/motion';
import { useCartStore, useCartUIStore } from '@/store/cartStore';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Food', 'Accessories', 'Toys', 'Health', 'Grooming'];

const PERSONALITY_TAGS = [
  "Corgi Approved 🐕",
  "For Heavy Chewers 🦴",
  "Instant Zoomies ⚡",
  "Extra Fluffy ☁️",
  "Tail-Wagging Good 🐾"
];

const FrictionlessProductCard = ({ product, index }: { product: Product, index: number }) => {
   const addItem = useCartStore((s) => s.addItem);
   const { openCart } = useCartUIStore();
   
   // Create rhythmic asymmetry (e.g. every 5th item is featured huge)
   const isFeatured = index % 5 === 0;
   
   // Randomly assign a personality tag to some products for emotional tone
   const personalityTag = isFeatured ? PERSONALITY_TAGS[index % PERSONALITY_TAGS.length] : null;

   const handleAdd = (e: React.MouseEvent) => {
     e.preventDefault();
     e.stopPropagation();
     addItem({
       product: product._id,
       name: product.name,
       price: product.price,
       image: product.images?.[0] ?? '',
       quantity: 1,
       stock: product.stock || 10,
     });
     openCart();
     toast.success(`${product.name} added to stash! 🐾`, { icon: '✨' });
   };

   return (
     <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={`relative group bg-bg-elevated rounded-[--radius-2xl] overflow-hidden border border-border hover:border-brand-muted hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 will-change-transform ${
            isFeatured ? 'col-span-1 md:col-span-2 row-span-2' : 'col-span-1'
        }`}
     >
        <Link href={`/products/${product._id}`} className="block h-full">
            <div className={`relative w-full ${isFeatured ? 'h-64 sm:h-80 md:h-96' : 'h-60'} bg-bg-secondary flex items-center justify-center p-4`}>
                {product.images?.[0] ? (
                    <Image 
                       src={product.images[0]} 
                       alt={product.name} 
                       fill 
                       className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                       sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                    />
                ) : (
                    <span className="text-6xl opacity-20">🐾</span>
                )}
                
                {/* Personality Tags overlay */}
                {personalityTag && (
                   <motion.div 
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-[0_10px_20px_rgba(0,0,0,0.1)] z-10"
                   >
                      <span className="text-label-sm font-black uppercase tracking-widest text-text-primary bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
                          {personalityTag}
                      </span>
                   </motion.div>
                )}

                {/* Instant Quick-Add Frosted Overlay */}
                <div className="absolute inset-0 bg-transparent group-hover:bg-bg-primary/20 backdrop-blur-[0px] group-hover:backdrop-blur-[2px] transition-all duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                    <motion.button 
                       whileTap={{ scale: 0.9 }}
                       onClick={handleAdd}
                       className="pointer-events-auto bg-text-primary text-bg-primary px-6 py-4 rounded-[--radius-full] font-black text-label-sm uppercase tracking-widest shadow-2xl flex items-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-brand"
                    >
                       <ShoppingBag size={18} /> Quick Add
                    </motion.button>
                </div>
            </div>

            <div className="p-6 flex flex-col justify-between">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary mb-1.5">{product.category}</p>
                   <h3 className={`font-black text-text-primary tracking-tight leading-tight mb-2 ${isFeatured ? 'text-h2' : 'text-h4'}`}>
                      {product.name}
                   </h3>
                </div>
                <div className="flex items-end justify-between mt-4">
                   <p className={`font-black text-text-primary ${isFeatured ? 'text-h3' : 'text-h4'}`}>₹{product.price.toLocaleString('en-IN')}</p>
                </div>
            </div>
        </Link>
     </motion.div>
   );
};

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProducts = useMemo(() => {
        let result = [...initialProducts];

        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => 
                (p.name && p.name.toLowerCase().includes(query)) || 
                (p.category && p.category.toLowerCase().includes(query))
            );
        }

        // Apply a deterministic sort just to handle masonry nicely
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return result;
    }, [initialProducts, selectedCategory, searchQuery]);

    return (
        <div className="pt-32 pb-24 min-h-[90vh] bg-bg-primary transition-colors duration-[--duration-normal] relative overflow-hidden">
            {/* Playful Blur Background Accent */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

            <div className="container-app relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6">

                {/* Highly Emotional Header */}
                <div className="mb-16 flex flex-col items-center text-center max-w-3xl mx-auto">
                    <motion.div {...motionPresets.fadeUp} className="mb-4 text-5xl">🛍️🐕</motion.div>
                    <motion.h1 
                        {...motionPresets.fadeUp}
                        transition={{ delay: 0.1 }}
                        className="text-display min-[400px]:text-[5rem] text-text-primary tracking-tighter leading-[0.9] mb-6 font-black"
                    >
                        Boutique Quality <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent pb-2">For Your Pet.</span>
                    </motion.h1>
                    <motion.p 
                        {...motionPresets.fadeUp}
                        transition={{ delay: 0.2 }}
                        className="text-body-lg text-text-secondary leading-relaxed font-medium"
                    >
                        We’ve meticulously selected every single item here so you can shop blindfolded. The absolute best nutrition, toys, and luxury for your best friend.
                    </motion.p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="flex gap-2 p-1.5 bg-bg-secondary w-full md:w-auto overflow-x-auto rounded-[--radius-full] border border-border scrollbar-hide">
                        {CATEGORIES.map((cat) => {
                            const isActive = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`relative px-6 py-3 rounded-[--radius-full] text-label-sm font-black uppercase tracking-wider transition-colors whitespace-nowrap z-10 ${
                                        isActive ? 'text-bg-primary' : 'text-text-secondary hover:text-text-primary'
                                    }`}
                                >
                                    {isActive && (
                                       <motion.div 
                                          layoutId="productTab" 
                                          className="absolute inset-0 bg-text-primary rounded-[--radius-full]" 
                                          transition={{ type: "spring", stiffness: 300, damping: 25 }} 
                                       />
                                    )}
                                    <span className="relative z-20">{cat}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative w-full md:w-80 group">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-brand transition-colors" size={18} />
                         <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-5 py-4 bg-bg-secondary border border-border rounded-[--radius-full] text-body-sm font-medium text-text-primary focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all outline-none"
                            placeholder="Search Treats, Toys, Accessories..."
                         />
                    </div>
                </div>

                {/* Asymmetric Product Grid */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 min-h-[50vh]">
                   <AnimatePresence mode="popLayout">
                       {filteredProducts.map((product, idx) => (
                           <FrictionlessProductCard key={product._id} product={product} index={idx} />
                       ))}
                   </AnimatePresence>
                </motion.div>

                {filteredProducts.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-20 text-center">
                        <Dog size={64} strokeWidth={1} className="text-text-tertiary mb-6" />
                        <h3 className="text-h2 font-black text-text-primary tracking-tight mb-3">No Treats Found!</h3>
                        <p className="text-body-lg text-text-secondary mb-8">We dug everywhere but couldn't find matches for your search.</p>
                        <Button variant="secondary" size="lg" onClick={() => {setSelectedCategory('All'); setSearchQuery('');}}>Reset Filters</Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
