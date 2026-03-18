import Link from 'next/link';
import { productsData } from '@/data/products';
import { ProductCard } from '@/components/cards/ProductCard';

export function BestSellingProducts() {
    const bestSellers = productsData.filter(product => product.isBestSeller).slice(0, 4);

    return (
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <span className="text-primary font-bold tracking-wider uppercase text-sm">Top Rated Items</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-text-main mt-2">Best Selling Products</h2>
                </div>
                <Link href="/products" className="inline-flex items-center text-primary font-semibold hover:text-accent transition-colors">
                    Shop All Products
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {bestSellers.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
