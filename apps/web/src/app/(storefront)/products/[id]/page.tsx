import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Product } from '@/types';
import { ProductActions } from '@/components/products/ProductActions';
import { ProductGallery } from '../../../../components/products/ProductGallery';
import { Recommendations } from '@/components/products/Recommendations';
import { RecentlyViewed } from '@/components/products/RecentlyViewed';
import { Star, Truck, RotateCcw, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ActivityTracker } from '@/components/analytics/ActivityTracker';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product || null;
  } catch { return null; }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const discount = product.price < 1500 ? 0 : Math.round(Math.random() * 15 + 5);
  const originalPrice = discount ? Math.round(product.price / (1 - discount / 100)) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-16 relative">
      {/* Breadcrumb */}
      <nav className="text-label-sm text-text-tertiary mb-8 flex items-center gap-2 uppercase tracking-widest font-bold">
        <a href="/" className="hover:text-brand transition-colors">Home</a>
        <span className="opacity-50">/</span>
        <a href="/products" className="hover:text-brand transition-colors">Shop</a>
        <span className="opacity-50">/</span>
        <a href={`/products?category=${product.category}`} className="hover:text-brand transition-colors">{product.category}</a>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 relative items-start">
        {/* Pinned Image Gallery */}
        <div className="w-full lg:w-[50%] lg:sticky lg:top-28">
           <ProductGallery images={product.images} name={product.name} />
        </div>

        {/* Product Information (Scrolls natively) */}
        <div className="w-full lg:w-[50%] flex flex-col gap-6 lg:pb-32">
          
          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="info" size="sm">{product.category}</Badge>
            {product.stock === 0 && <Badge variant="danger" size="sm">Out of stock</Badge>}
            {product.isLowStock && product.stock > 0 && <Badge variant="warning" size="sm">Only {product.stock} left!</Badge>}
          </div>

          <h1 className="text-display font-black text-text-primary leading-[0.95] tracking-tight">{product.name}</h1>

          {/* Social Proof */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-warning text-warning' : 'text-border'}`} />
              ))}
            </div>
            <span className="text-label-sm font-bold text-text-secondary">{product.rating.toFixed(1)} · {product.reviewCount} Reviews</span>
          </div>

          {/* Price Header */}
          <div className="flex items-baseline gap-4 mt-2 mb-4">
            <span className="text-h1 font-black text-text-primary tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {originalPrice && (
              <div className="flex items-center gap-3">
                 <span className="text-h4 text-text-tertiary line-through font-medium">₹{originalPrice.toLocaleString('en-IN')}</span>
                 <Badge variant="success" size="sm">Save {discount}%</Badge>
              </div>
            )}
          </div>

          <p className="text-body-lg text-text-secondary leading-relaxed mb-6">{product.description}</p>

          <div className="h-px bg-border w-full mb-2" />

          {/* Client-side Variant Selector & Add to Cart */}
          <ProductActions product={product} />

          {/* Trust Value Props */}
          <div className="border-t border-border mt-8 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Truck, label: 'Free Delivery', sub: 'Orders over ₹499' },
              { icon: RotateCcw, label: '7-Day Return', sub: 'Hassle-free process' },
              { icon: Shield, label: 'Quality Guarantee', sub: 'Tested for safety' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col gap-2 p-4 bg-bg-secondary rounded-[--radius-xl] border border-border items-start">
                <Icon className="w-6 h-6 text-brand" />
                <div>
                   <h4 className="text-label-sm font-bold text-text-primary uppercase tracking-wider">{label}</h4>
                   <p className="text-[10px] text-text-tertiary font-bold tracking-widest uppercase mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Discovery & Recommendations Sections */}
      <Recommendations category={product.category} currentProductId={product._id} />
      <RecentlyViewed excludeId={product._id} />

      <ActivityTracker type="view" productId={product._id} productName={product.name} category={product.category} />
    </div>
  );
}
