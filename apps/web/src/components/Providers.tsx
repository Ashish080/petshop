'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { ReactNode, useEffect } from 'react';
import { CartOwnerSync } from '@/components/CartOwnerSync';
import { SmoothScroll } from '@/components/ui/SmoothScroll';
import { AnimatePresence } from 'framer-motion';
import CartDrawer from '@/components/layout/CartDrawer';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.error('SW registration failed:', err);
      });
    }
  }, []);

  return (
    <SessionProvider>
      <CartOwnerSync />
      <SmoothScroll>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
        <CartDrawer />
      </SmoothScroll>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text-primary)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--color-border)',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-danger)',
              secondary: '#fff',
            },
          },
        }}
      />
    </SessionProvider>
  );
}
