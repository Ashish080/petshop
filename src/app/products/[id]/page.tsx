import { productsData } from '@/data/products';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { themeConfig } from '@/config/theme';
import { ShoppingCart, Star, Zap } from 'lucide-react';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const product = productsData.find(p => p.id === resolvedParams.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="py-16 bg-white min-h-screen">
            <div className={themeConfig.spacing.container}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="relative h-96 md:h-[500px] w-full rounded-2xl overflow-hidden bg-gray-50 p-8">
                        <Image src={product.image} alt={product.name} fill className="object-contain p-8" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                <Star size={14} className="fill-yellow-600 text-yellow-600" /> {product.rating}
                            </span>
                            <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4" style={{ color: themeConfig.colors.primary }}>{product.name}</h1>
                        <p className="text-3xl font-bold mb-6" style={{ color: themeConfig.colors.text }}>${product.price.toFixed(2)}</p>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-2" style={{ color: themeConfig.colors.text }}>Description</h3>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3" style={{ color: themeConfig.colors.text }}>Size / Variant</h3>
                            <div className="flex gap-3">
                                {['Standard', 'Large'].map((size, idx) => (
                                    <button
                                        key={size}
                                        className="px-4 py-2 border rounded-md transition-colors font-medium border-gray-200 hover:border-gray-300"
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="flex-1 flex justify-center items-center gap-2 py-3 px-6 rounded-lg font-bold transition-opacity hover:opacity-90 border-2" style={{ borderColor: themeConfig.colors.primary, color: themeConfig.colors.primary }}>
                                <ShoppingCart size={20} /> Add to Cart
                            </button>
                            <button className="flex-1 flex justify-center items-center gap-2 py-3 px-6 rounded-lg font-bold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: themeConfig.colors.primary }}>
                                <Zap size={20} /> Buy Now
                            </button>
                        </div>
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
