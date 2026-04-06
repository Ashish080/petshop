'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartUIStore } from '@/store/cartStore';

export default function CartPage() {
    const router = useRouter();
    const { openCart } = useCartUIStore();

    useEffect(() => {
        openCart();
        router.replace('/products');
    }, [openCart, router]);

    return null;
}
