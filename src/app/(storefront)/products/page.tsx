import ProductCard from '@/components/cards/ProductCard';
import { themeConfig } from '@/config/theme';
import { Sparkles, ShoppingBag, ShoppingBasket } from 'lucide-react';
import type { Product as IProduct } from '@/types';
import { ProductSearch } from '@/components/products/ProductSearch';
import { ProductCategoryFilter } from '@/components/products/ProductCategoryFilter';

export const metadata = { title: "Pet Products - Premium Supplies" };
export const dynamic = 'force-dynamic';

interface ProductsPageProps {
    searchParams: Promise<{
        category?: string;
        search?: string;
        page?: string;
    }>;
}

async function getProducts(params: { category?: string; search?: string; page?: string }) {
    try {
        const query = new URLSearchParams();
        if (params.category) query.set('category', params.category);
        if (params.search) query.set('search', params.search);
        if (params.page) query.set('page', params.page);

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/products?${query.toString()}`, {
            cache: 'no-store'
        });

        if (!res.ok) throw new Error('Failed to fetch products');
        
        const result = await res.json();
        return {
            products: result.data || [],
            pagination: result.pagination || { page: 1, pages: 1, total: 0 }
        };
    } catch (e) {
        console.error('Failed to fetch products:', e);
        return { products: [], pagination: { page: 1, pages: 1, total: 0 } };
    }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const params = await searchParams;
    const { products, pagination } = await getProducts(params);

    return (
        <div className="py-12 md:py-20 min-h-screen bg-bg-page transition-colors duration-300 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className={themeConfig.spacing.container + " relative z-10"}>

                {/* Product Header */}
                <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row items-end justify-between gap-10">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-black text-xs uppercase tracking-widest mb-4 border border-secondary/20">
                            <Sparkles size={14} fill="currentColor" />
                            Premium Supplies
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight mb-4">
                            Happy Supplies for <br />
                            <span className="text-brand-primary">Happy Paws</span>
                        </h1>
                        <p className="text-lg text-text-light font-medium leading-relaxed">
                            Discover the finest collection of toys, food, and accessories curated specially for your beloved companions.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-3/5">
                        <ProductSearch />
                    </div>
                </div>

                {/* Category Filtering */}
                <ProductCategoryFilter />

                {/* Search Results Summary */}
                {(params.search || params.category) && (
                    <div className="mb-8 text-sm font-bold text-text-light uppercase tracking-widest flex items-center gap-2">
                        <ShoppingBasket size={18} className="text-brand-primary" />
                        Found {pagination.total} results {params.search && `for "${params.search}"`} {params.category && `in ${params.category}`}
                    </div>
                )}

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-10">
                    {products.length > 0 ? (
                        products.map((product: IProduct, i: number) => (
                            <div
                                key={product.id || product._id}
                                style={{ animationDelay: `${i * 100}ms` }}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                            >
                                <ProductCard 
                                    id={product.id || product._id} 
                                    name={product.name}
                                    price={product.price}
                                    rating={product.rating}
                                    reviews={product.reviewCount}
                                    images={product.images}
                                    category={product.category}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
                            <div className="text-6xl mb-2">🐾</div>
                            <div className="text-gray-500 font-bold uppercase tracking-widest">
                                {params.search ? `No products matching "${params.search}"` : 'No products found in this category'}
                            </div>
                            <button 
                                onClick={() => window.location.href = '/products'}
                                className="text-secondary font-black underline hover:text-brand-primary transition-colors cursor-pointer"
                            >
                                View All Products
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="mt-16 flex justify-center gap-2">
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => {
                            const isCurrent = p === pagination.page;
                            return (
                                <a
                                    key={p}
                                    href={`/products?${new URLSearchParams({ ...params, page: p.toString() })}`}
                                    className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-sm transition-all border-2 ${
                                        isCurrent 
                                            ? 'bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-110' 
                                            : 'bg-white border-card-border/50 text-text-light hover:border-brand-primary/50 hover:text-brand-primary'
                                    }`}
                                >
                                    {p}
                                </a>
                            );
                        })}
                    </div>
                )}

                {/* Help Section */}
                <div className="mt-20 p-12 bg-white dark:bg-card-bg rounded-[40px] border border-card-border/50 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-secondary/5 opacity-50"></div>
                    <div className="relative z-10 max-w-xl mx-auto">
                        <ShoppingBag className="mx-auto mb-6 text-brand-primary" size={48} strokeWidth={2.5} />
                        <h3 className="text-3xl font-black text-text-primary mb-4">Can't find what you need?</h3>
                        <p className="text-text-light font-medium mb-8">
                            We restock every Tuesday! Sign up to get notified when new goodies arrive.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 p-2 bg-bg-page dark:bg-white/5 rounded-3xl border border-card-border/50">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-transparent px-6 py-4 outline-none font-bold text-text-primary placeholder:text-text-light"
                            />
                            <button className="px-8 py-4 bg-secondary text-white font-black rounded-2xl shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all">
                                Keep Me Updated
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

