'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ProductSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" size={18} />
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-11 pr-11 py-3.5 bg-white dark:bg-card-bg border border-card-border rounded-2xl font-bold text-text-primary placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all shadow-sm"
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      )}
    </form>
  );
}
