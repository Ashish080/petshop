import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/cards/ProductCard';
import { connectDB } from '@/lib/mongoose';
import ProductModel from '@/models/Product';
import { Button } from '@/components/ui/Button';

export default async function BestSellingProducts() {
    await connectDB();
    const products = await ProductModel.find({ isActive: true }).limit(4).lean();

    return (
        <section className="section-padding">
            <div className="container-app">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-h1 mb-3">
                            Best Selling Products
                        </h2>
                        <p className="text-body-lg max-w-2xl">
                            Discover our most loved products for your furry friends. High quality and trusted by pet parents.
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="hidden md:flex items-center gap-2 text-label-lg text-brand hover:text-brand-hover transition-colors"
                    >
                        View All Products <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard 
                            key={product._id.toString()} 
                            id={product._id.toString()}
                            name={product.name}
                            price={product.price}
                            category={product.category}
                            image={product.images?.[0]}
                            images={product.images as string[]}
                            rating={product.rating || 5}
                            reviews={product.reviewCount || 0}
                        />
                    ))}
                </div>

                <div className="mt-10 md:hidden flex justify-center">
                    <Link href="/products">
                        <Button variant="outline" iconRight={<ArrowRight size={16} />}>
                            View All Products
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
