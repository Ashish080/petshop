"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x400';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviews: number;
    images?: string[];
    image?: string;
    category?: string;
    isBestSeller?: boolean;
}

export default function ProductCard({ id, name, price, rating, reviews, images, image, category, isBestSeller }: ProductCardProps) {
    const coverSrc = images?.[0] ?? image ?? PLACEHOLDER_IMAGE;
    const addItem = useCartStore((s) => s.addItem);

    const handleAddToCart = () => {
        addItem({
            product: id,
            name,
            image: coverSrc,
            price,
            quantity: 1,
        });
        toast.success('Added to cart!');
    };

    return (
        <div className="bg-bg-tertiary group overflow-hidden transition-all duration-[--duration-slow] ease-[--ease-out-expo] hover:-translate-y-1.5 border border-border hover:border-border-hover rounded-[--radius-lg] shadow-xs hover:shadow-sm">
            {/* Image Area */}
            <div className="relative h-56 w-full overflow-hidden bg-bg-secondary">
                <Image
                    src={coverSrc}
                    alt={name}
                    fill
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {isBestSeller && (
                    <div className="absolute top-3 left-3">
                        <Badge variant="brand" size="sm">Best Seller</Badge>
                    </div>
                )}
                <button className="absolute top-3 right-3 p-2 bg-bg-elevated rounded-full shadow-sm text-text-disabled hover:text-danger transition-all z-10 border border-border hover:scale-110 active:scale-95">
                    <Heart size={18} fill="none" />
                </button>
            </div>

            {/* Content */}
            <div className="p-5">
                {category && (
                    <span className="text-overline text-brand mb-2 block capitalize">
                        {category}
                    </span>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 bg-warning-muted px-2 py-0.5 rounded-[--radius-sm]">
                        <Star className="text-warning fill-warning" size={12} />
                        <span className="text-label text-text-primary">{rating}</span>
                    </div>
                    <span className="text-body-xs">({reviews} reviews)</span>
                </div>

                {/* Title */}
                <Link href={`/products/${id}`}>
                    <h3 className="text-h6 text-text-primary mb-1 line-clamp-2 min-h-[2.5rem] hover:text-brand transition-colors leading-snug">
                        {name}
                    </h3>
                </Link>

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-4">
                    <span className="text-h4 text-stat text-brand">₹{price.toLocaleString('en-IN')}</span>
                    <Button
                        size="sm"
                        variant="primary"
                        icon={<ShoppingBag size={16} />}
                        onClick={handleAddToCart}
                        aria-label="Add to cart"
                        className="!px-3"
                    />
                </div>
            </div>
        </div>
    );
}
