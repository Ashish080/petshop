import Link from 'next/link';
import { ArrowRight, ShoppingBasket } from 'lucide-react';
import ProductCard from '@/components/cards/ProductCard';
import { themeConfig } from '@/config/theme';

export default function BestSellingProducts({ products }: { products: any[] }) {
    const bestSellers = products || [];

    return (
        <section className={`${themeConfig.spacing.section} bg-bg-page/50`}>
            <div className={themeConfig.spacing.container}>
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-black text-[10px] uppercase tracking-widest mb-4 border border-secondary/20">
                            Our Best
                        </div>
                        <h2 className="text-3xl font-black tracking-tight sm:text-5xl mb-4 text-text-primary">
                            Best Selling Products
                        </h2>
                        <p className="max-w-2xl text-lg font-medium text-text-light leading-relaxed">
                            Discover our most loved products for your furry friends. High quality and trusted by pet parents.
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="flex items-center gap-2 px-8 py-4 bg-secondary text-white font-black rounded-2xl shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
                    >
                        View All Products <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {bestSellers.map((product) => (
                        <ProductCard 
                            key={product.id || product._id} 
                            id={product.id || product._id}
                            name={product.name}
                            price={product.price}
                            rating={product.rating}
                            reviews={product.reviewCount}
                            images={product.images}
                            category={product.category}
                        />
                    ))}
                    {bestSellers.length === 0 && (
                        <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
                            <ShoppingBasket size={48} className="text-gray-200" />
                            <div className="text-text-light font-bold uppercase tracking-widest">
                                No products found
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

