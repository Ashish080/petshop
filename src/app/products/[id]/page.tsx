import { productsData } from "@/data/products";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export function generateStaticParams() {
    return productsData.map((product) => ({
        id: product.id,
    }));
}

export default async function ProductDetailPage(props: PageProps) {
    const params = await props.params;
    const product = productsData.find((p) => p.id === params.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="bg-background min-h-screen py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-soft border border-primary/5 flex flex-col md:flex-row gap-10">
                    {/* Image Gallery */}
                    <div className="w-full md:w-1/2">
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary/5 p-8 flex items-center justify-center border border-primary/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-2xl shadow-sm"
                            />
                            {product.isBestSeller && (
                                <div className="absolute top-6 left-6 bg-accent text-white px-4 py-2 rounded-full font-bold shadow-md">
                                    Best Seller
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <div className="mb-4">
                            <span className="text-secondary font-bold tracking-widest uppercase text-sm">
                                {product.category}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold text-text-main mb-4 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex text-accent text-xl">
                                ★★★★★
                            </div>
                            <span className="text-text-main font-medium">{product.rating}</span>
                            <span className="text-text-muted">({product.reviews} reviews)</span>
                        </div>

                        <div className="flex items-end gap-3 mb-8">
                            <span className="text-4xl font-extrabold text-primary">
                                ${product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                                <span className="text-xl text-text-muted line-through mb-1">
                                    ${product.originalPrice.toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Product Variants Placeholder */}
                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-text-main mb-3 uppercase tracking-wider">Select Option</h4>
                            <div className="flex gap-3">
                                <button className="px-4 py-2 border-2 border-primary rounded-lg font-bold text-primary bg-primary/5">Standard</button>
                                <button className="px-4 py-2 border-2 border-primary/20 rounded-lg font-bold text-text-muted hover:border-primary/50 transition-colors">Premium</button>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-xl font-bold text-text-main mb-3">Product Description</h3>
                            <p className="text-text-muted leading-relaxed text-lg">
                                {product.description}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-auto border-t border-primary/10 pt-8">
                            <button className="flex-1 bg-primary text-text-inverse py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-medium hover:-translate-y-1">
                                Add to Cart
                            </button>
                            <button className="flex-1 bg-background border-2 border-primary/20 text-primary py-4 rounded-full font-bold text-lg hover:border-primary/50 transition-all shadow-soft">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
