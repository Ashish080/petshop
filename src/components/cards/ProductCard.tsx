"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart } from 'lucide-react';
import { themeConfig } from '@/config/theme';
import CartPawButton from '@/components/ui/CartPawButton';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
}

export default function ProductCard({ id, name, price, rating, reviews, image }: ProductCardProps) {
    return (
        <div className={`bg-white dark:bg-card-bg group overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-card-border ${themeConfig.radius.lg} ${themeConfig.shadows.soft} hover:${themeConfig.shadows.hover}`}>
            <div className="relative h-56 w-full overflow-hidden bg-bg-page/50 p-4">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <button className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-text-light hover:text-brand-primary transition-colors z-10 border border-card-border">
                    <Heart size={20} />
                </button>
            </div>

            <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                    <Star className="text-accent fill-accent" size={14} />
                    <span className="text-xs font-black text-text-primary">{rating}</span>
                    <span className="text-xs text-text-light">({reviews})</span>
                </div>

                <Link href={`/products/${id}`}>
                    <h3 className="text-base font-black mb-1 line-clamp-2 min-h-[40px] hover:text-brand-primary transition-colors text-text-primary leading-tight">
                        {name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-black text-brand-primary">${price.toFixed(2)}</span>
                    <CartPawButton
                        className={`p-2.5 transition-all flex items-center justify-center hover:scale-110 active:scale-90 shadow-md ${themeConfig.radius.lg}`}
                        style={{ backgroundColor: `${themeConfig.colors.secondary}`, color: 'white' }}
                        ariaLabel="Add to cart"
                    />
                </div>
            </div>
        </div>
    );
}
