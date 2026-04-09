'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /**
             * staleTime: 5 minutes for catalog / product data.
             *
             * Previously 1 minute — this caused unnecessary refetches every
             * time the user switched tabs or navigated back to a page.
             * Product/category data rarely changes more than once per deploy;
             * 5 minutes is a safe balance between freshness and performance.
             *
             * For real-time data (stock levels, order status), override
             * staleTime at the individual useQuery call site:
             *   useQuery({ ..., staleTime: 0 })  ← always fresh
             *   useQuery({ ..., staleTime: 30_000 })  ← 30 second window
             */
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000,   // 10 minutes (previously cacheTime)
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            // Surface mutation errors in development
            onError: process.env.NODE_ENV === 'development'
              ? (error) => console.error('[ReactQuery mutation error]', error)
              : undefined,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools: only loaded in development — zero production bundle impact */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
}
