'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { useCartStore, setCartStorageOwnerKey, migrateLegacyCartStorage } from '@/store/cartStore';

/**
 * Persists cart only for logged-in users (`cart-storage__u-<id>`). Guest cart is memory-only.
 * Rehydrates after session is known; on login, merges guest session cart into the user cart.
 */
export function CartOwnerSync() {
  const { data: session, status } = useSession();
  const migrated = useRef(false);
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || migrated.current) return;
    migrated.current = true;
    migrateLegacyCartStorage();
  }, []);

  useEffect(() => {
    if (status === 'loading') return;

    const key = session?.user?.id ? `u-${session.user.id}` : 'guest';
    if (lastKey.current === key) return;

    const previousKey = lastKey.current;
    const guestLines =
      previousKey === 'guest' && key.startsWith('u-')
        ? useCartStore.getState().items.map((i) => ({ ...i }))
        : [];

    lastKey.current = key;
    setCartStorageOwnerKey(key);

    // Logout: drop logged-in cart from UI (guest cart is not persisted)
    if (previousKey?.startsWith('u-') && key === 'guest') {
      useCartStore.getState().clearCart();
    }

    void Promise.resolve(useCartStore.persist.rehydrate()).then(() => {
      for (const line of guestLines) {
        useCartStore.getState().addItem(line);
      }
    });
  }, [status, session?.user?.id]);

  return null;
}
