import { connectDB } from '@/lib/mongoose';
import Product from '@/models/Product';
import ProductCard from '@/components/cards/ProductCard';
import { themeConfig } from '@/config/theme';
import { Sparkles, ShoppingBag, Filter, ArrowUpDown } from 'lucide-react';
import type { Product as IProduct } from '@/types';

export const metadata = { title: "Pet Products - Premium Supplies" };
export const dynamic = 'force-dynamic';

async function getProducts(): Promise<IProduct[]> {
    try {
        await connectDB();
        const docs = await Product.find({ isActive: true }).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(docs));
    } catch (e) {
        console.error('Failed to fetch products:', e);
        return [];
    }
}

export default async function ProductsPage() {
    const products = await getProducts();

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

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <button className="flex-1 lg:w-40 py-4 px-6 bg-white dark:bg-card-bg border border-card-border rounded-2xl font-black text-sm flex items-center justify-center gap-3 text-text-primary hover:bg-brand-primary/5 transition-all shadow-sm">
                            <Filter size={18} /> Filters
                        </button>
                        <button className="flex-1 lg:w-48 py-4 px-6 bg-white dark:bg-card-bg border border-card-border rounded-2xl font-black text-sm flex items-center justify-center gap-3 text-text-primary hover:bg-brand-primary/5 transition-all shadow-sm">
                            <ArrowUpDown size={18} /> Sort by: Newest
                        </button>
                    </div>
                </div>

                {/* Category Pills Mockup */}
                <div className="flex flex-wrap gap-3 mb-12">
                    {['All Products', 'Puppy Food', 'Chew Toys', 'Cosy Beds', 'Leashes', 'Kitty Treats'].map((cat, i) => (
                        <button
                            key={cat}
                            className={`px-6 py-3 rounded-2xl font-black text-sm transition-all border-2 ${i === 0 ? 'bg-secondary border-secondary text-white shadow-xl shadow-secondary/25' : 'bg-transparent border-card-border/50 text-text-light hover:border-secondary/50 hover:text-secondary'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-10">
                    {products.length > 0 ? (
                        products.map((product, i) => (
                            <div
                                key={product._id}
                                style={{ animationDelay: `${i * 100}ms` }}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                            >
                                <ProductCard 
                                    id={product._id} 
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
                        <div className="col-span-full py-20 text-center text-gray-500 font-bold uppercase tracking-widest">
                            No products found in the catalog
                        </div>
                    )}
                </div>

                {/* Newsletter */}
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
