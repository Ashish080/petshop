'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Loader2,
  Package,
  PawPrint,
  Scissors,
  Search,
  ShieldCheck,
  Stethoscope,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { motionPresets } from '@/lib/motion';

const quickLinks = [
  { label: 'Puppies', href: '/pets', icon: PawPrint },
  { label: 'Food', href: '/products?category=food', icon: Package },
  { label: 'Accessories', href: '/products?category=accessories', icon: ShieldCheck },
  { label: 'Grooming', href: '/services#grooming', icon: Scissors },
  { label: 'Vet care', href: '/book-vet', icon: Stethoscope },
];

type SearchResult = {
  _id: string;
  name: string;
  price?: number;
  category?: string;
  images?: string[];
};

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const frame = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `/api/products?search=${encodeURIComponent(query)}&limit=6`
        );
        const data = await res.json();
        setResults(data.products || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = window.setTimeout(fetchResults, 280);
    return () => window.clearTimeout(timeout);
  }, [isOpen, query]);

  const emptyStateTitle = useMemo(() => {
    if (query.trim().length < 2) return 'Start with a keyword';
    return 'No close matches yet';
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-16 sm:pt-24">
          <motion.div
            {...motionPresets.fade}
            onClick={onClose}
            className="fixed inset-0 bg-overlay backdrop-blur-md"
          />

          <motion.div
            {...motionPresets.fadeUp}
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-modal-title"
            className="premium-panel relative z-10 w-full max-w-4xl overflow-hidden rounded-[32px]"
          >
            <div className="border-b border-border/80 px-5 py-5 sm:px-7">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-tertiary text-brand">
                  <Search size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p id="search-modal-title" className="text-kicker">
                    Search the marketplace
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Try puppy food, retriever, harness, grooming..."
                      className="w-full bg-transparent text-lg font-semibold text-text-primary outline-none placeholder:text-text-tertiary"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                      onClick={onClose}
                      className="rounded-full border border-border bg-bg-tertiary p-2.5 text-text-tertiary transition-colors hover:text-text-primary"
                      aria-label="Close search"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid max-h-[72vh] overflow-hidden lg:grid-cols-[1.15fr_0.85fr]">
              <div className="border-b border-border/70 p-5 lg:max-h-[72vh] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-7">
                {loading ? (
                  <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 text-center">
                    <Loader2 className="animate-spin text-brand" size={28} />
                    <div>
                      <p className="text-label font-bold uppercase tracking-[0.18em] text-text-primary">
                        Searching products
                      </p>
                      <p className="mt-2 text-body-sm">
                        Looking through pets, food, accessories, and care services.
                      </p>
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-kicker">Best matches</p>
                      <Link
                        href={`/products?search=${encodeURIComponent(query)}`}
                        onClick={onClose}
                        className="text-label font-semibold uppercase tracking-[0.14em] text-brand"
                      >
                        View all
                      </Link>
                    </div>

                    {results.map((item) => (
                      <Link
                        key={item._id}
                        href={`/products/${item._id}`}
                        onClick={onClose}
                        className="group flex items-center gap-4 rounded-[24px] border border-border bg-bg-elevated px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-border-hover hover:shadow-xs"
                      >
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[20px] bg-bg-tertiary">
                          {item.images?.[0] ? (
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="64px"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-kicker">{item.category || 'Product'}</p>
                          <h4 className="truncate text-base font-semibold text-text-primary">
                            {item.name}
                          </h4>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm font-bold text-brand">
                              ₹{Number(item.price || 0).toLocaleString('en-IN')}
                            </span>
                            <span className="text-body-xs">
                              Premium care marketplace
                            </span>
                          </div>
                        </div>
                        <ArrowRight
                          size={18}
                          className="text-text-tertiary transition-transform group-hover:translate-x-1 group-hover:text-brand"
                        />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[28px] border border-dashed border-border bg-bg-tertiary/70 px-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-bg-elevated text-brand shadow-xs">
                      {query.trim().length >= 2 ? <PawPrint size={28} /> : <Package size={28} />}
                    </div>
                    <h3 className="mt-5 text-h5 text-text-primary">{emptyStateTitle}</h3>
                    <p className="mt-2 max-w-sm text-body-sm">
                      {query.trim().length >= 2
                        ? 'Try a broader term or explore one of the popular shortcuts on the right.'
                        : 'Search stays open for guests too, so customers can browse before they sign in.'}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-6 p-5 sm:p-7">
                <div className="rounded-[28px] border border-border bg-bg-tertiary/80 p-5">
                  <p className="text-kicker">Popular shortcuts</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    {quickLinks.map(({ label, href, icon: Icon }) => (
                      <Link
                        key={label}
                        href={href}
                        onClick={onClose}
                        className="flex items-center justify-between rounded-[22px] border border-border bg-bg-elevated px-4 py-3 transition-colors hover:border-border-hover hover:bg-bg-primary"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-bg-tertiary text-brand">
                            <Icon size={16} />
                          </div>
                          <span className="font-semibold text-text-primary">{label}</span>
                        </div>
                        <ArrowRight size={16} className="text-text-tertiary" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-brand/12 bg-brand-muted/70 p-5">
                  <p className="text-kicker text-brand">What works best here</p>
                  <ul className="mt-3 space-y-3 text-body-sm">
                    <li>Search by breed, product type, or care need.</li>
                    <li>Use category shortcuts for faster mobile browsing.</li>
                    <li>Keep the experience open to guests and convert later.</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
