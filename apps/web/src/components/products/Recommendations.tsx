'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { motion } from 'framer-motion';
import { staggerVariants, staggerItemVariants } from '@/lib/motion';
import { Sparkles } from 'lucide-react';

export function Recommendations({ category, currentProductId }: { category: string, currentProductId?: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`/api/products?category=${category}&limit=5`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.data.filter((p: any) => p._id !== currentProductId).slice(0, 4));
        }
      } catch (err) {} finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [category, currentProductId]);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-12 border-t border-border mt-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
             <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-h3 font-black text-text-primary tracking-tight">You Might Also Like</h2>
            <p className="text-label-sm font-bold text-text-tertiary uppercase tracking-widest mt-1">Personalized picks based on your style</p>
          </div>
        </div>
      </div>

      <motion.div 
        variants={staggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {products.map((product) => (
          <motion.div key={product._id} variants={staggerItemVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
