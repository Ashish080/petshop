import { create } from 'zustand';
import { Product } from '@/types';
import toast from 'react-hot-toast';

interface WishlistState {
  items: Product[];
  loading: boolean;
  initialized: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  loading: false,
  initialized: false,

  fetchWishlist: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const res = await fetch('/api/user/wishlist');
      const data = await res.json();
      if (data.success) {
        set({ items: data.data, initialized: true });
      }
    } catch (err) {
      console.error('Fetch Wishlist Err:', err);
    } finally {
      set({ loading: false });
    }
  },

  toggleWishlist: async (product: Product) => {
    const isRemove = get().isInWishlist(product?._id);
    
    // Optimistic Update
    const current = get().items;
    if (isRemove) {
       set({ items: current.filter(p => p._id !== product._id) });
    } else {
       set({ items: [...current, product] });
    }

    try {
      const res = await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id })
      });
      const data = await res.json();
      if (!data.success) {
        // Rollback
        set({ items: current });
        toast.error(data.error || 'Failed to sync wishlist');
      } else {
        toast.success(data.action === 'added' ? 'Added to favorites!' : 'Removed from favorites');
      }
    } catch (err) {
      set({ items: current });
      toast.error('Sync error');
    }
  },

  isInWishlist: (productId: string) => {
    return get().items.some(p => p._id === productId);
  }
}));
