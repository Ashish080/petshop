'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dog, Search, ShoppingBag, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import {
  interactions,
  motionPresets,
  staggerItemVariants,
  staggerVariants,
} from '@/lib/motion';
import { useCartStore, useCartUIStore } from '@/store/cartStore';
import type { Product } from '@/types';

const CATEGORIES = ['All', 'Food', 'Accessories', 'Toys', 'Health', 'Grooming'];
const FEATURE_TAGS = ['Editor Pick', 'Top Rated', 'New Drop', 'Vet Choice', 'Limited Batch'];

const FrictionlessProductCard = ({ product, index }: { product: Product; index: number }) => {
  const addItem = useCartStore((s) => s.addItem);
  const { openCart } = useCartUIStore();
  const isFeatured = index % 6 === 0;
  const highlightTag = isFeatured ? FEATURE_TAGS[index % FEATURE_TAGS.length] : null;

  const handleAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addItem({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ?? '',
      quantity: 1,
      stock: product.stock || 10,
    });
    openCart();
    toast.success('Added to cart');
  };

  return (
    <motion.article
      layout
      variants={staggerItemVariants}
      {...interactions.cardInteractive}
      className={`group relative overflow-hidden rounded-[--radius-2xl] border border-border bg-bg-elevated/90 shadow-sm backdrop-blur transition-colors duration-[--duration-normal] hover:border-brand/40 ${
        isFeatured ? 'col-span-1 md:col-span-2' : 'col-span-1'
      }`}
    >
      <Link href={`/products/${product._id}`} className="block h-full">
        <div
          className={`relative w-full overflow-hidden bg-bg-secondary ${
            isFeatured ? 'h-72 sm:h-80 md:h-96' : 'h-60'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand/8 via-transparent to-accent/8 opacity-0 transition-opacity duration-[--duration-normal] group-hover:opacity-100" />
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-[--duration-deliberate] group-hover:scale-105"
              sizes={isFeatured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 25vw'}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-text-tertiary">
              <Dog size={42} />
            </div>
          )}

          {highlightTag && (
            <div className="absolute left-4 top-4 rounded-[--radius-full] border border-white/30 bg-white/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-text-primary backdrop-blur-md">
              {highlightTag}
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-6 justify-center bg-gradient-to-t from-black/45 via-black/10 to-transparent pb-5 opacity-0 transition-all duration-[--duration-normal] group-hover:translate-y-0 group-hover:opacity-100">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={handleAdd}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-[--radius-full] bg-bg-elevated px-5 py-2.5 text-label-sm font-black uppercase tracking-[0.11em] text-text-primary shadow-md"
            >
              <ShoppingBag size={16} />
              Quick Add
            </motion.button>
          </div>
        </div>

        <div className="p-5">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-text-tertiary">
            {product.category}
          </p>
          <h3 className={`text-text-primary ${isFeatured ? 'text-h2' : 'text-h4'} font-black tracking-tight`}>
            {product.name}
          </h3>
          <div className="mt-3 flex items-center justify-between">
            <p className={`${isFeatured ? 'text-h3' : 'text-h4'} font-black text-text-primary`}>
              ₹{product.price.toLocaleString('en-IN')}
            </p>
            <Button
              variant="secondary"
              size="sm"
              icon={<ShoppingBag size={15} />}
              onClick={handleAdd}
              aria-label={`Add ${product.name} to cart`}
            />
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (selectedCategory !== 'All') {
      result = result.filter((product) => product.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          (product.name && product.name.toLowerCase().includes(query)) ||
          (product.category && product.category.toLowerCase().includes(query))
      );
    }

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [initialProducts, searchQuery, selectedCategory]);

  return (
    <div className="relative min-h-[90vh] overflow-hidden pb-24 pt-32">
      <div className="pointer-events-none absolute inset-0 hero-aurora opacity-75" />
      <div className="pointer-events-none absolute -top-32 right-[-8rem] h-[34rem] w-[34rem] rounded-full bg-brand/14 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-36 left-[-8rem] h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-[120px]" />

      <div className="container-app relative z-10 max-w-[1380px]">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <motion.div
            {...motionPresets.fadeUp}
            className="mx-auto mb-4 inline-flex items-center gap-2 rounded-[--radius-full] border border-border/70 bg-bg-elevated/80 px-3 py-1.5 text-label-sm font-bold text-text-secondary backdrop-blur"
          >
            <Sparkles size={14} className="text-brand" />
            Curated Essentials
          </motion.div>
          <motion.h1
            {...motionPresets.fadeUp}
            className="text-display font-black tracking-[--tracking-display] text-text-primary"
          >
            Shop Better. Move Faster.
          </motion.h1>
          <motion.p {...motionPresets.fadeUp} className="mt-3 text-body-lg text-text-secondary">
            Premium picks for food, play, care, and daily routines.
          </motion.p>
        </div>

        <motion.div
          {...motionPresets.fadeUp}
          className="mb-10 rounded-[--radius-2xl] border border-border/70 bg-bg-elevated/80 p-3 shadow-soft backdrop-blur-lg"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="scrollbar-hide flex gap-1.5 overflow-x-auto rounded-[--radius-full] bg-bg-secondary p-1.5">
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`relative whitespace-nowrap rounded-[--radius-full] px-5 py-2.5 text-label-sm font-black uppercase tracking-[0.08em] ${
                      isActive ? 'text-text-inverse' : 'text-text-secondary'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="products-active-pill"
                        className="absolute inset-0 rounded-[--radius-full] bg-text-primary"
                      />
                    )}
                    <span className="relative z-10">{category}</span>
                  </button>
                );
              })}
            </div>

            <label className="group relative block w-full md:w-80">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors group-focus-within:text-brand"
              />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-12 w-full rounded-[--radius-full] border border-border bg-bg-secondary pl-11 pr-4 text-body-sm text-text-primary outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
                placeholder="Search products"
              />
            </label>
          </div>
        </motion.div>

        <motion.div
          layout
          variants={staggerVariants}
          initial="hidden"
          animate="visible"
          className="grid min-h-[52vh] grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <FrictionlessProductCard key={product._id} product={product} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div
            {...motionPresets.scaleIn}
            className="mt-14 flex flex-col items-center rounded-[--radius-2xl] border border-border bg-bg-elevated/80 py-16 text-center backdrop-blur"
          >
            <Dog size={52} strokeWidth={1.5} className="mb-4 text-text-tertiary" />
            <h3 className="text-h2 font-black text-text-primary">No matches</h3>
            <p className="mt-2 text-body text-text-secondary">Try another keyword or reset filters.</p>
            <div className="mt-6">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
              >
                Reset
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
