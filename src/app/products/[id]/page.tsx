'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { themeConfig } from '@/config/theme';
import { ShoppingCart, Star, Zap, Check, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product, ProductVariant } from '@/types/product';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${resolvedParams.id}`);
                const data = await res.json();
                setProduct(data.product);
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [resolvedParams.id]);

    const handleVariantSelect = (variantName: string, optionValue: string) => {
        setSelectedVariants(prev => ({
            ...prev,
            [variantName]: optionValue
        }));
    };

    const handleAddToCart = () => {
        setAddingToCart(true);
        
        const variantInfo = Object.keys(selectedVariants).length > 0 ? {
            variantName: Object.keys(selectedVariants)[0],
            selectedOption: Object.values(selectedVariants)[0]
        } : undefined;

        addToCart({
            productId: product!.id,
            name: product!.name,
            price: product!.price,
            quantity,
            image: product!.images[0],
            variant: variantInfo
        });

        setTimeout(() => setAddingToCart(false), 500);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-page flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-text-light font-bold">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-bg-page flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-black text-text-primary mb-4">Product not found</h2>
                    <Link href="/products" className="text-brand-primary font-black hover:underline">
                        Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 md:py-20 bg-bg-page min-h-screen transition-colors duration-300">
            <div className={themeConfig.spacing.container}>
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-text-light mb-10 overflow-x-auto whitespace-nowrap pb-2">
                    <Link href="/" className="hover:text-brand-primary shrink-0">Home</Link>
                    <span className="shrink-0">/</span>
                    <Link href="/products" className="hover:text-brand-primary shrink-0">Shop</Link>
                    <span className="shrink-0">/</span>
                    <span className="font-bold text-text-primary truncate">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Column */}
                    <div className="relative h-[400px] md:h-[600px] w-full rounded-3xl overflow-hidden bg-white dark:bg-card-bg border border-card-border p-8 shadow-soft">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain transition-transform duration-700 hover:scale-105"
                        />
                    </div>

                    {/* Content Column */}
                    <div className="flex flex-col">
                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} className={i < Math.floor(product.rating) ? "fill-yellow-500" : "fill-transparent"} />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-text-primary px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                                {product.rating}
                            </span>
                            <span className="text-text-light text-sm">({product.reviews} reviews)</span>
                            {product.isBestSeller && (
                                <span className="text-xs font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                                    Best Seller
                                </span>
                            )}
                        </div>

                        {/* Title & Price */}
                        <h1 className="text-3xl md:text-5xl font-black mb-4 text-text-primary leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-3xl font-black mb-6 text-brand-primary">
                            ₹{product.price.toLocaleString('en-IN')}
                        </p>

                        {/* Description */}
                        <p className="text-text-body text-lg leading-relaxed mb-8 text-text-light">
                            {product.description}
                        </p>

                        {/* Variants */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-8 space-y-6">
                                {product.variants.map((variant: ProductVariant) => (
                                    <div key={variant.name}>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-text-light mb-3">
                                            {variant.name}
                                        </label>
                                        <div className="flex flex-wrap gap-3">
                                            {variant.options.map((option) => {
                                                const isSelected = selectedVariants[variant.name] === option.value;
                                                const isOutOfStock = option.stock === 0;
                                                
                                                return (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => !isOutOfStock && handleVariantSelect(variant.name, option.value)}
                                                        disabled={isOutOfStock}
                                                        className={`px-5 py-3 rounded-xl font-black text-sm transition-all border-2 ${
                                                            isSelected
                                                                ? 'bg-brand-primary border-brand-primary text-white'
                                                                : isOutOfStock
                                                                ? 'bg-bg-page/30 border-card-border text-text-light cursor-not-allowed opacity-50'
                                                                : 'bg-white dark:bg-card-bg border-card-border text-text-primary hover:border-brand-primary'
                                                        }`}
                                                    >
                                                        {option.value}
                                                        {isOutOfStock && ' (OOS)'}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Stock Status */}
                        <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3">
                            <Check className="text-green-500" size={20} />
                            <span className="font-black text-green-500 text-sm">
                                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <div className="flex items-center gap-3 bg-white dark:bg-card-bg border border-card-border rounded-2xl p-2">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 hover:bg-brand-primary/10 rounded-xl transition-colors text-text-light hover:text-brand-primary"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="w-12 text-center font-black text-text-primary text-lg">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-3 hover:bg-brand-primary/10 rounded-xl transition-colors text-text-light hover:text-brand-primary"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || addingToCart}
                                className={`flex-1 flex justify-center items-center gap-3 py-4 px-8 rounded-2xl font-black transition-all ${
                                    product.stock === 0
                                        ? 'bg-bg-page text-text-light cursor-not-allowed'
                                        : addingToCart
                                        ? 'bg-green-500 text-white'
                                        : 'bg-brand-primary text-white hover:bg-opacity-90 shadow-xl shadow-brand-primary/25'
                                }`}
                            >
                                {addingToCart ? (
                                    <>
                                        <Check size={22} /> Added!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={22} /> Add to Cart
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Features */}
                        <div className="mt-auto grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-white dark:bg-card-bg rounded-2xl border border-card-border">
                                <Truck className="mx-auto mb-2 text-brand-primary" size={24} />
                                <p className="text-[10px] font-black text-text-light uppercase tracking-widest">Free Shipping</p>
                            </div>
                            <div className="text-center p-4 bg-white dark:bg-card-bg rounded-2xl border border-card-border">
                                <Shield className="mx-auto mb-2 text-brand-primary" size={24} />
                                <p className="text-[10px] font-black text-text-light uppercase tracking-widest">Secure Payment</p>
                            </div>
                            <div className="text-center p-4 bg-white dark:bg-card-bg rounded-2xl border border-card-border">
                                <RotateCcw className="mx-auto mb-2 text-brand-primary" size={24} />
                                <p className="text-[10px] font-black text-text-light uppercase tracking-widest">Easy Returns</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
