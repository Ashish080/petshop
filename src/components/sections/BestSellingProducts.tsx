import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/cards/ProductCard';
import { productsData } from '@/data/products';
import { themeConfig } from '@/config/theme';

export default function BestSellingProducts() {
    const bestSellers = productsData.filter(product => product.isBestSeller).slice(0, 4);

    return (
        <section className={themeConfig.spacing.section}>
            <div className={themeConfig.spacing.container}>
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-3" style={{ color: themeConfig.colors.text }}>
                            Best Selling Products
                        </h2>
                        <p className="max-w-2xl text-lg" style={{ color: themeConfig.colors.textLight }}>
                            Discover our most loved products for your furry friends. High quality and trusted by pet parents.
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="hidden md:flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity"
                        style={{ color: themeConfig.colors.primary }}
                    >
                        View All Products <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {bestSellers.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>

                <div className="mt-10 md:hidden flex justify-center">
                    <Link href="/products">
                        <button
                            className={`flex items-center gap-2 px-6 py-3 font-semibold border ${themeConfig.radius.md}`}
                            style={{ color: themeConfig.colors.primary, borderColor: themeConfig.colors.primary }}
                        >
                            View All Products <ArrowRight size={18} />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
