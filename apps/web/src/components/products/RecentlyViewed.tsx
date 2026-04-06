'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { motion } from 'framer-motion';
import { staggerVariants, staggerItemVariants } from '@/lib/motion';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch('/api/activity/recently-viewed');
        const data = await res.json();
        if (data.success) {
          setProducts(data.data.filter((p: any) => p._id !== excludeId).slice(0, 4));
        }
      } catch (err) {} finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, [excludeId]);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-12 border-t border-border mt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-h3 font-black text-text-primary tracking-tight">Recently Viewed</h2>
          <p className="text-label-sm font-bold text-text-tertiary uppercase tracking-widest mt-1">Pick up where you left off</p>
        </div>
      </div>

      <motion.div 
        variants={staggerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
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
