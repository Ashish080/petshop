"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { interactions, motionPresets } from '@/lib/motion';

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
        <motion.article
            {...motionPresets.fadeUp}
            {...interactions.cardInteractive}
            className="group relative overflow-hidden rounded-[--radius-xl] border border-border bg-bg-tertiary shadow-xs transition-all duration-[--duration-slow] hover:border-brand/40 hover:shadow-float"
        >
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand/10 via-accent/5 to-transparent opacity-0 transition-opacity duration-[--duration-slow] group-hover:opacity-100" />

            <div className="relative h-56 w-full overflow-hidden bg-bg-secondary">
                <div className="absolute inset-0 grid-fade opacity-35" />
                <Image
                    src={coverSrc}
                    alt={name}
                    fill
                    className="object-contain p-5 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-1"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {isBestSeller && (
                    <div className="absolute left-3 top-3">
                        <Badge variant="brand" size="sm">Best Seller</Badge>
                    </div>
                )}
                <motion.button
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    className="absolute right-3 top-3 z-10 rounded-full border border-border bg-bg-elevated/90 p-2 text-text-disabled shadow-sm backdrop-blur transition-colors hover:text-danger"
                    aria-label={`Add ${name} to wishlist`}
                >
                    <Heart size={18} />
                </motion.button>
            </div>

            <div className="p-5">
                {category && (
                    <span className="mb-2 block text-overline capitalize text-text-tertiary">
                        {category}
                    </span>
                )}

                <div className="mb-2 flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-[--radius-sm] bg-warning-muted px-2 py-0.5">
                        <Star className="fill-warning text-warning" size={12} />
                        <span className="text-label text-text-primary">{rating}</span>
                    </div>
                    <span className="text-body-xs text-text-tertiary">{reviews} reviews</span>
                </div>

                <Link href={`/products/${id}`}>
                    <h3 className="mb-1 min-h-[2.5rem] line-clamp-2 text-h6 leading-snug text-text-primary transition-colors group-hover:text-brand">
                        {name}
                    </h3>
                </Link>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-h4 text-brand">₹{price.toLocaleString('en-IN')}</span>
                    <motion.div whileTap={{ scale: 0.96 }}>
                        <Button
                            size="sm"
                            variant="primary"
                            icon={<ShoppingBag size={16} />}
                            onClick={handleAddToCart}
                            aria-label="Add to cart"
                            className="!px-3"
                        />
                    </motion.div>
                </div>
            </div>
        </motion.article>
    );
}
