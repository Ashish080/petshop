"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { themeConfig } from '@/config/theme';
import CartPawButton from '@/components/ui/CartPawButton';
import { useCartStore } from '@/store/cartStore';

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
        <div className={`bg-white dark:bg-card-bg group overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-card-border ${themeConfig.radius.lg} ${themeConfig.shadows.soft} hover:${themeConfig.shadows.hover}`}>
            <div className="relative h-56 w-full overflow-hidden bg-bg-page/50 p-4">
                <Image
                    src={coverSrc}
                    alt={name}
                    fill
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {isBestSeller && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                        Best Seller
                    </span>
                )}
                <button className="absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-lg text-zinc-400 hover:text-brand-primary transition-all z-10 border border-zinc-100 hover:scale-110 active:scale-95">
                    <Heart size={20} fill={false ? "currentColor" : "none"} />
                </button>
            </div>

            <div className="p-5">
                {category && (
                    <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-3 block capitalize">
                        {category}
                    </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-lg">
                        <Star className="text-secondary fill-secondary" size={12} />
                        <span className="text-xs font-black text-zinc-900">{rating}</span>
                    </div>
                    <span className="text-xs text-zinc-500 font-bold">({reviews} reviews)</span>
                </div>

                <Link href={`/products/${id}`}>
                    <h3 className="text-base font-black mb-1 line-clamp-2 min-h-[40px] hover:text-brand-primary transition-colors text-text-primary leading-tight">
                        {name}
                    </h3>
                </Link>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-black text-brand-primary">₹{price.toLocaleString('en-IN')}</span>
                    <CartPawButton
                        className={`p-2.5 transition-all flex items-center justify-center hover:scale-110 active:scale-90 shadow-md ${themeConfig.radius.lg}`}
                        style={{ backgroundColor: `${themeConfig.colors.secondary}`, color: 'white' }}
                        ariaLabel="Add to cart"
                        onAddToCart={handleAddToCart}
                    />
                </div>
            </div>
        </div>
    );
}
