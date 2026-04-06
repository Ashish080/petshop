'use client';

import { useEffect } from 'react';

interface ActivityTrackerProps {
  type: 'view' | 'add-to-cart' | 'checkout-start';
  productId?: string;
  productName?: string;
  category?: string;
}

export function ActivityTracker({ type, productId, productName, category }: ActivityTrackerProps) {
  useEffect(() => {
    const logActivity = async () => {
      try {
        await fetch('/api/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, productId, productName, category }),
        });
      } catch (err) {
        // Silent fail for analytics
      }
    };

    logActivity();
  }, [type, productId, productName, category]);

  return null;
}
