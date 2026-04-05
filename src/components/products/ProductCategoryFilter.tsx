'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'food', name: 'Pet Food' },
  { id: 'toys', name: 'Chew Toys' },
  { id: 'bedding', name: 'Cosy Beds' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'grooming', name: 'Grooming' },
];

export function ProductCategoryFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentCategory = searchParams.get('category') || 'all';

  const setCategory = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === 'all') {
      params.delete('category');
    } else {
      params.set('category', id);
    }
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-12">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategory(cat.id)}
          className={`px-6 py-3 rounded-2xl font-black text-sm transition-all border-2 ${
            currentCategory === cat.id
              ? 'bg-secondary border-secondary text-white shadow-xl shadow-secondary/20 scale-105'
              : 'bg-white dark:bg-card-bg border-card-border/50 text-text-light hover:border-secondary/50 hover:text-secondary hover:translate-y-[-2px]'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
