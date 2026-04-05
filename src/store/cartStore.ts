import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, CartState } from '@/types';

const FREE_DELIVERY_THRESHOLD = parseInt(process.env.NEXT_PUBLIC_FREE_DELIVERY_THRESHOLD || '499');

const PERSIST_NAME = 'cart-storage';

const calculateTotals = (items: CartItem[]): Omit<CartState, 'itemCount'> => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 50;
  const total = subtotal + delivery;

  return { items, subtotal, delivery, total };
};

interface CartStore extends CartState {
  addItem: (item: CartItem) => void;
  removeItem: (product: string, variantName?: string) => void;
  updateQuantity: (product: string, quantity: number, variantName?: string) => void;
  clearCart: () => void;
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  delivery: 0,
  total: 0,
  itemCount: 0
};

/** Scoped per guest or logged-in user (`u-<mongodb id>`). Updated before rehydrate. */
let cartStorageOwnerKey = 'guest';

export function setCartStorageOwnerKey(key: string) {
  cartStorageOwnerKey = key;
}

/**
 * Remove legacy keys. Guest cart is not persisted anymore (only in-memory while browsing).
 */
let migrationRan = false;
export function migrateLegacyCartStorage() {
  if (typeof window === 'undefined' || migrationRan) return;
  migrationRan = true;
  try {
    localStorage.removeItem(PERSIST_NAME);
    localStorage.removeItem('cart');
    localStorage.removeItem(`${PERSIST_NAME}__guest`);
  } catch {
    /* ignore */
  }
}

function scopedStorageKey(name: string) {
  return `${name}__${cartStorageOwnerKey}`;
}

/** Guest: no localStorage — avoids “2 items in cart” when nobody is logged in after refresh. */
const browserStorage = createJSONStorage(() => ({
  getItem: (name) => {
    if (typeof window === 'undefined') return null;
    if (cartStorageOwnerKey === 'guest') return null;
    return localStorage.getItem(scopedStorageKey(name));
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined') return;
    if (cartStorageOwnerKey === 'guest') return;
    localStorage.setItem(scopedStorageKey(name), value);
  },
  removeItem: (name) => {
    if (typeof window === 'undefined') return;
    if (cartStorageOwnerKey === 'guest') return;
    localStorage.removeItem(scopedStorageKey(name));
  },
}));

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addItem: (item) => {
        set((state) => {
          const currentItems = state.items;
          const existingIndex = currentItems.findIndex(
            i => i.product === item.product && i.variantName === item.variantName
          );
          const cap =
            item.stock ??
            (existingIndex > -1 ? currentItems[existingIndex]?.stock : undefined) ??
            Number.POSITIVE_INFINITY;

          let newItems;
          if (existingIndex > -1) {
            newItems = currentItems.map((i, index) =>
              index === existingIndex
                ? {
                    ...i,
                    quantity: Math.min(i.quantity + item.quantity, cap),
                    stock: item.stock ?? i.stock,
                  }
                : i
            );
          } else {
            newItems = [
              ...currentItems,
              { ...item, quantity: Math.min(item.quantity, cap) },
            ];
          }

          const totals = calculateTotals(newItems);
          const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);

          return { ...totals, itemCount };
        });
      },

      removeItem: (product, variantName) => {
        const newItems = get().items.filter(
          i => !(i.product === product && i.variantName === variantName)
        );

        const totals = calculateTotals(newItems);
        const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);

        set({ ...totals, itemCount });
      },

      updateQuantity: (product, quantity, variantName) => {
        if (quantity <= 0) {
          get().removeItem(product, variantName);
          return;
        }

        set((state) => {
          const newItems = state.items.map((i) => {
            if (i.product !== product || i.variantName !== variantName) return i;
            const cap = i.stock ?? Number.POSITIVE_INFINITY;
            return { ...i, quantity: Math.min(quantity, cap) };
          });

          const totals = calculateTotals(newItems);
          const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);

          return { ...totals, itemCount };
        });
      },

      clearCart: () => {
        set(initialState);
      }
    }),
    {
      name: PERSIST_NAME,
      storage: browserStorage,
      skipHydration: true,
    }
  )
);
