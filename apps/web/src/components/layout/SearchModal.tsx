'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, PawPrint, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { motionPresets } from '@/lib/motion';

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
            {...motionPresets.fade}
            onClick={onClose}
            className="fixed inset-0 bg-overlay backdrop-blur-md cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            {...motionPresets.fadeUp}
            className="w-full max-w-2xl bg-bg-elevated rounded-[--radius-xl] shadow-2xl overflow-hidden relative z-10 border border-border selection:bg-brand/10"
          >
            <div className="relative">
              <div className="flex items-center px-6 py-6 border-b border-border">
                <Search
                  className={`mr-4 transition-colors ${loading ? 'text-brand animate-pulse' : 'text-text-tertiary'}`}
                  size={24}
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for pets, food, or accessories..."
                  className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-text-primary placeholder:text-text-tertiary placeholder:font-medium"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-bg-tertiary rounded-[--radius-md] transition-colors text-text-tertiary"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {loading && query.length > 1 && (
                  <div className="p-12 text-center flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-brand" size={32} />
                    <p className="text-label uppercase tracking-widest text-text-tertiary">Searching the Catalog...</p>
                  </div>
                )}

                {!loading && query.length > 1 && results.length === 0 && (
                  <div className="p-20 text-center">
                    <div className="w-16 h-16 bg-bg-secondary rounded-[--radius-lg] flex items-center justify-center mx-auto mb-4 border border-border">
                      <PawPrint size={28} className="text-text-tertiary" />
                    </div>
                    <h3 className="text-h6 text-text-primary mb-1">No Matches Found</h3>
                    <p className="text-label uppercase tracking-widest text-text-tertiary leading-loose">
                      We couldn't find any items matching your request.
                    </p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="p-4 space-y-2">
                    <div className="px-4 py-2 text-label uppercase tracking-widest text-text-tertiary">
                      Top Matches Found
                    </div>
                    {results.map((item) => (
                      <Link
                        key={item._id}
                        href={`/products/${item._id}`}
                        onClick={onClose}
                        className="flex items-center gap-4 p-4 hover:bg-bg-secondary rounded-[--radius-lg] transition-all group active:scale-[0.98]"
                      >
                        <div className="w-14 h-14 bg-bg-tertiary rounded-[--radius-md] overflow-hidden border border-border shrink-0">
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-h6 text-text-primary truncate">{item.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-label font-bold text-brand uppercase tracking-widest">
                              ₹ {item.price}
                            </span>
                            <span className="text-overline text-text-tertiary uppercase tracking-tight italic">
                              {item.category} segment
                            </span>
                          </div>
                        </div>
                        <ArrowRight
                          size={18}
                          className="text-text-tertiary group-hover:text-brand group-hover:translate-x-1 transition-all"
                        />
                      </Link>
                    ))}
                  </div>
                )}

                {query.length <= 1 && (
                  <div className="p-10">
                    <div className="bg-bg-secondary rounded-[--radius-xl] p-10 text-center border border-border relative overflow-hidden group">
                      <div className="mb-6 w-16 h-16 bg-bg-elevated rounded-[--radius-lg] flex items-center justify-center mx-auto shadow-sm text-brand group-hover:scale-110 transition-transform">
                        <Package size={28} />
                      </div>
                      <h3 className="text-h5 text-text-primary mb-2">Ready to Search?</h3>
                      <p className="text-body-sm text-text-tertiary leading-relaxed max-w-[220px] mx-auto">
                        Input keywords to explore our premium catalog of companions and care products.
                      </p>

                      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand opacity-5 rounded-full blur-[40px]"></div>
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
