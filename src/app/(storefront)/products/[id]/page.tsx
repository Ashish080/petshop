import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Product } from '@/types';
import { ProductActions } from '@/components/products/ProductActions';
import { Star, Truck, RotateCcw, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product;
  } catch { return null; }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  // Deterministic discount based on price or product ID to avoid hydration mismatch/randomness
  const discount = product.price > 2000 ? 10 : 0;
  const originalPrice = discount ? Math.round(product.price / (1 - discount / 100)) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <a href="/" className="hover:text-orange-500">Home</a>
        <span>›</span>
        <a href="/products" className="hover:text-orange-500">Products</a>
        <span>›</span>
        <a href={`/products?category=${product.category}`} className="hover:text-orange-500 capitalize">{product.category}</a>
        <span>›</span>
        <span className="text-gray-600 truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image gallery */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-2">
            {product.images.slice(0, 4).map((img: string, i: number) => (
              <div key={i} className="w-16 h-16 rounded-xl overflow-hidden border-2 border-transparent hover:border-orange-400 transition-colors cursor-pointer">
                <Image src={img} alt={`${product.name} ${i + 1}`} width={64} height={64} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
          <div className="flex-1 relative bg-gray-50 rounded-2xl overflow-hidden aspect-square">
            {product.images[0] ? (
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🐾</div>
            )}
            {product.isLowStock && (
              <div className="absolute top-3 left-3">
                <Badge variant="warning">Only {product.stock} left!</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="info">{product.category}</Badge>
            {product.stock === 0 && <Badge variant="danger">Out of stock</Badge>}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">{product.rating.toFixed(1)} · {product.reviewCount} reviews</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                <span className="text-sm text-green-600 font-semibold">{discount}% off</span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Client-side interactive part */}
          <ProductActions product={product} />

          {/* Info strips */}
          <div className="border-t border-gray-100 pt-4 grid grid-cols-3 gap-4">
            {[
              { icon: Truck, label: 'Free delivery', sub: 'Orders over ₹499' },
              { icon: RotateCcw, label: '7-day returns', sub: 'Hassle-free' },
              { icon: Shield, label: 'Authentic', sub: '100% genuine' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1 p-3 bg-gray-50 rounded-xl">
                <Icon className="w-5 h-5 text-orange-500" />
                <span className="text-xs font-medium text-gray-800">{label}</span>
                <span className="text-xs text-gray-400">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
