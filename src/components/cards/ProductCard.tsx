"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { themeConfig } from '@/config/theme';

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
        <div className={`bg-white group overflow-hidden transition-all duration-300 hover:-translate-y-1 ${themeConfig.radius.lg} ${themeConfig.shadows.soft} hover:${themeConfig.shadows.hover}`}>
            <div className="relative h-56 w-full overflow-hidden bg-gray-50 p-4">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors z-10">
                    <Heart size={18} />
                </button>
            </div>

            <div className="p-5">
                <div className="flex items-center gap-1 mb-2">
                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                    <span className="text-xs font-medium text-gray-700">{rating}</span>
                    <span className="text-xs text-gray-400">({reviews})</span>
                </div>

                <Link href={`/products/${id}`}>
                    <h3 className="text-base font-semibold mb-1 line-clamp-2 min-h-[40px] hover:opacity-80 transition-opacity" style={{ color: themeConfig.colors.text }}>
                        {name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold" style={{ color: themeConfig.colors.primary }}>${price.toFixed(2)}</span>
                    <button
                        className={`p-2 transition-colors flex items-center justify-center ${themeConfig.radius.md}`}
                        style={{ backgroundColor: `${themeConfig.colors.secondary}15`, color: themeConfig.colors.secondary }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = themeConfig.colors.secondary;
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = `${themeConfig.colors.secondary}15`;
                            e.currentTarget.style.color = themeConfig.colors.secondary;
                        }}
                        aria-label="Add to cart"
                    >
                        <ShoppingBag size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
