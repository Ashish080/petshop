import Link from 'next/link';
import { Product } from '@/data/products';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group bg-background rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 border border-primary/5 flex flex-col h-full hover:-translate-y-1">
            <div className="relative aspect-square w-full bg-secondary/5 p-6 overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />

                {/* Wishlist Button Overlay */}
                <button className="absolute top-4 right-4 p-2.5 bg-background rounded-full text-text-muted hover:text-accent hover:shadow-md transition-all">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <div className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                    {product.category}
                </div>

                <h3 className="font-bold text-text-main leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/products/${product.id}`}>
                        {product.name}
                    </Link>
                </h3>

                <div className="flex items-center gap-1 mb-4 mt-auto">
                    <span className="text-accent">★</span>
                    <span className="text-sm font-medium text-text-main">{product.rating}</span>
                    <span className="text-sm text-text-muted">({product.reviews})</span>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-primary/5">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                            <span className="text-sm text-text-muted line-through">${product.originalPrice.toFixed(2)}</span>
                        )}
                    </div>

                    <button className="bg-primary hover:bg-primary/90 text-text-inverse p-3 rounded-full transition-colors shadow-sm">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
