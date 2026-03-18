import { ProductCard } from "@/components/cards/ProductCard";
import { productsData } from "@/data/products";

export const metadata = {
    title: "Shop Pet Products - Premium Food, Toys & Accessories",
    description: "Browse our collection of premium pet products.",
};

export default function ProductsPage() {
    return (
        <div className="bg-background min-h-screen py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
                        Premium Pet Products
                    </h1>
                    <p className="text-lg text-text-muted max-w-2xl mx-auto leading-relaxed">
                        Everything your pet needs, from nutritious food to luxury accessories, carefully curated for quality and happiness.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {productsData.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
