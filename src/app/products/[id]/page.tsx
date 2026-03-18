import { productsData } from '@/data/products';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { themeConfig } from '@/config/theme';
import { ShoppingCart, Star, Zap } from 'lucide-react';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const product = productsData.find(p => p.id === resolvedParams.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="py-12 md:py-20 bg-bg-page min-h-screen transition-colors duration-300">
            <div className={themeConfig.spacing.container}>
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-text-light mb-10 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
                    <Link href="/" className="hover:text-brand-primary shrink-0">Home</Link>
                    <span className="shrink-0">/</span>
                    <Link href="/products" className="hover:text-brand-primary shrink-0">Shop</Link>
                    <span className="shrink-0">/</span>
                    <span className="font-bold text-text-primary truncate">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Column */}
                    <div className="relative h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden bg-white dark:bg-card-bg border border-card-border p-12 shadow-soft">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain p-8 transition-transform duration-700 hover:scale-105"
                        />
                    </div>

                    {/* Content Column */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} className={i < Math.floor(product.rating) ? "fill-yellow-500" : "fill-transparent"} />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-text-primary px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                                {product.rating}
                            </span>
                            <span className="text-text-light text-sm">({product.reviews} customer reviews)</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black mb-4 text-text-primary leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-3xl font-black mb-8 text-brand-primary">
                            ${product.price.toFixed(2)}
                        </p>

                        <div className="prose prose-stone dark:prose-invert mb-10">
                            <p className="text-text-body text-lg leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <button className={`flex-[2] flex justify-center items-center gap-3 py-4 px-8 rounded-xl font-bold transition-all bg-brand-primary text-white hover:bg-opacity-90 shadow-lg shadow-brand-primary/20`}>
                                <ShoppingCart size={22} /> Add to Cart
                            </button>
                            <button className={`flex-1 flex justify-center items-center gap-3 py-4 px-8 rounded-xl font-bold transition-all bg-white dark:bg-card-bg text-text-primary hover:bg-opacity-80 border border-card-border shadow-soft`}>
                                Buy Now
                            </button>
                        </div>

                        {/* Location / Availability Info (Mockup) */}
                        <div className="mt-auto p-6 bg-white dark:bg-card-bg border border-card-border rounded-2xl">
                            <h3 className="font-bold text-text-primary mb-2">Available for Pickup</h3>
                            <p className="text-sm text-text-light">Check availability in your nearest Kanha Pet Shop & Care store.</p>
                        </div>
                    </div>
                </div>

                {/* Map Section Placeholder (Mockup) */}
                <div className="mt-20 rounded-3xl overflow-hidden h-64 w-full bg-[#E5E5E5] dark:bg-card-border relative border border-card-border">
                    <div className="absolute inset-0 flex items-center justify-center text-text-light font-bold">
                        Interactive Store Map Area
                    </div>
                </div>
            </div>
        </div>
    );
}

export function generateStaticParams() {
    return productsData.map((product) => ({
        id: product.id,
    }));
}
