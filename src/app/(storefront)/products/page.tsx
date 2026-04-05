import { connectDB } from '@/lib/mongoose';
import ProductModel from '@/models/Product';
import ProductsClient from './ProductsClient';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    await connectDB();
    const products = await ProductModel.find({ isActive: true }).lean();
    
    // Convert ObjectId and Dates to strings for Client Component
    const serializedProducts = products.map((product) => {
        const prodId = product._id?.toString();
        return {
            ...product,
            _id: prodId,
            id: prodId,
            createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: product.updatedAt?.toISOString() || new Date().toISOString(),
        };
    });

    return <ProductsClient initialProducts={serializedProducts as any} />;
}
