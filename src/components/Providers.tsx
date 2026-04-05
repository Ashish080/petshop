'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartOwnerSync } from '@/components/CartOwnerSync';
import { SmoothScroll } from '@/components/ui/SmoothScroll';
import { AnimatePresence } from 'framer-motion';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CartOwnerSync />
      <AuthProvider>
        <CartProvider>
          <SmoothScroll>
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </SmoothScroll>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#363636',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#FF7A00',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

