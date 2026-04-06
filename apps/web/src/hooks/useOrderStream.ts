'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

export type ConnectionState = 'connecting' | 'connected' | 'reconnecting' | 'closed';

export interface OrderStreamUpdate {
  type: 'init' | 'update';
  orderStatus: string;
  riderId?: string;
  updatedAt?: string;
}

interface UseOrderStreamOptions {
  orderId: string | null;
  /** Disable streaming for terminal states to save connections */
  enabled?: boolean;
  onUpdate: (data: OrderStreamUpdate) => void;
}

const TERMINAL_STATUSES = new Set(['delivered', 'cancelled']);

/**
 * useOrderStream — Production-grade SSE hook
 *
 * Features:
 * - Exponential backoff reconnection (1s → 2s → 4s → 8s → max 30s)
 * - Deduplication: ignores events with the same status as last received
 * - Connection state tracking (connecting | connected | reconnecting | closed)
 * - Immediate cleanup on unmount (no memory leaks)
 * - Auto-stops retrying on terminal states
 */
export function useOrderStream({
  orderId,
  enabled = true,
  onUpdate,
}: UseOrderStreamOptions): ConnectionState {
  const esRef          = useRef<EventSource | null>(null);
  const retryTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef  = useRef(0);
  const lastStatusRef  = useRef<string | null>(null);
  const isMountedRef   = useRef(true);
  const [connState, setConnState] = useState<ConnectionState>('connecting');

  // Stable ref for onUpdate so reconnect doesn't recreate the closure
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => { onUpdateRef.current = onUpdate; }, [onUpdate]);

  const cleanup = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
  }, []);

  const connect = useCallback(() => {
    if (!orderId || !enabled || !isMountedRef.current) return;

    cleanup();
    setConnState(retryCountRef.current > 0 ? 'reconnecting' : 'connecting');

    const es = new EventSource(`/api/orders/${orderId}/stream`);
    esRef.current = es;

    es.onopen = () => {
      if (!isMountedRef.current) return;
      retryCountRef.current = 0; // reset backoff on successful connect
      setConnState('connected');
    };

    es.onmessage = (event: MessageEvent) => {
      if (!isMountedRef.current) return;
      try {
        const data: OrderStreamUpdate = JSON.parse(event.data);

        // Deduplication: skip if same status as last received
        if (data.orderStatus && data.orderStatus === lastStatusRef.current) return;
        lastStatusRef.current = data.orderStatus ?? null;

        onUpdateRef.current(data);

        // Auto-close once terminal state is confirmed
        if (TERMINAL_STATUSES.has(data.orderStatus)) {
          es.close();
          setConnState('closed');
        }
      } catch {
        // Malformed JSON — ignore, stay connected
      }
    };

    es.onerror = () => {
      if (!isMountedRef.current) return;
      es.close();
      esRef.current = null;

      // Don't retry if we're in a terminal state
      if (lastStatusRef.current && TERMINAL_STATUSES.has(lastStatusRef.current)) {
        setConnState('closed');
        return;
      }

      // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 30s (capped)
      const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 30_000);
      retryCountRef.current += 1;
      setConnState('reconnecting');

      retryTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) connect();
      }, delay);
    };
  }, [orderId, enabled, cleanup]);

  useEffect(() => {
    isMountedRef.current = true;
    connect();

    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [connect, cleanup]);

  return connState;
}
