'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Cart } from '@/types/product';

interface CartContextType {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, variant?: { variantName: string; selectedOption: string }) => void;
  updateQuantity: (productId: string, quantity: number, variant?: { variantName: string; selectedOption: string }) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateTotals = (items: CartItem[]): Omit<Cart, 'itemCount'> => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 5000 ? 0 : 100; // Free shipping above ₹5000
  const total = subtotal + tax + shipping;

  return { items, subtotal, tax, shipping, total };
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    itemCount: 0
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart);
          const totals = calculateTotals(parsed.items || []);
          setCart({
            ...totals,
            itemCount: parsed.items?.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0
          });
        } catch (e) {
          console.error('Failed to parse cart from localStorage');
        }
      }
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify({ items: cart.items }));
    }
  }, [cart.items, isLoaded]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existingIndex = prev.items.findIndex(
        i => i.productId === item.productId && 
             JSON.stringify(i.variant) === JSON.stringify(item.variant)
      );

      let newItems;
      if (existingIndex > -1) {
        newItems = prev.items.map((i, index) => 
          index === existingIndex 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        newItems = [...prev.items, item];
      }

      const totals = calculateTotals(newItems);
      return {
        ...totals,
        itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0)
      };
    });
  };

  const removeFromCart = (productId: string, variant?: { variantName: string; selectedOption: string }) => {
    setCart(prev => {
      const newItems = prev.items.filter(
        i => !(i.productId === productId && 
               JSON.stringify(i.variant) === JSON.stringify(variant))
      );

      const totals = calculateTotals(newItems);
      return {
        ...totals,
        itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0)
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number, variant?: { variantName: string; selectedOption: string }) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }

    setCart(prev => {
      const newItems = prev.items.map(i => 
        (i.productId === productId && JSON.stringify(i.variant) === JSON.stringify(variant))
          ? { ...i, quantity }
          : i
      );

      const totals = calculateTotals(newItems);
      return {
        ...totals,
        itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0)
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      itemCount: 0
    });
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      itemCount: cart.itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
