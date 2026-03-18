import { productsData } from '@/data/products';
import ProductCard from '@/components/cards/ProductCard';
import { themeConfig } from '@/config/theme';

export const metadata = { title: "Pet Products" };

export default function ProductsPage() {
    return (
        <div className="py-16 min-h-screen" style={{ backgroundColor: themeConfig.colors.background }}>
            <div className={themeConfig.spacing.container}>
                <h1 className="text-4xl font-bold mb-8" style={{ color: themeConfig.colors.primary }}>Pet Products</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {productsData.map(product => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
