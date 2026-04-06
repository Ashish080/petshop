'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

interface SyncAction {
    id: string;
    url: string;
    method: 'POST' | 'PATCH' | 'PUT';
    body: any;
    timestamp: number;
    retryCount: number;
}

export function useOfflineSync() {
    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [pendingActions, setPendingActions] = useState<SyncAction[]>([]);

    // 1. Monitor Connectivity
    useEffect(() => {
        const updateStatus = () => {
            const online = navigator.onLine;
            setIsOnline(online);
            if (online) {
                toast.success('Connection restored. Syncing pending updates...', { 
                   icon: '📡',
                   duration: 3000 
                });
            } else {
                toast.error('You are currently Offline. Actions will be queued.', { 
                   icon: '📶',
                   duration: 5000 
                });
            }
        };

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        
        // Load initial queue from localStorage
        const saved = localStorage.getItem('rider_sync_queue');
        if (saved) setPendingActions(JSON.parse(saved));

        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);
        };
    }, []);

    // 2. Persist Queue
    useEffect(() => {
        localStorage.setItem('rider_sync_queue', JSON.stringify(pendingActions));
    }, [pendingActions]);

    // 3. Process Sync Queue
    const processQueue = useCallback(async () => {
        if (!isOnline || pendingActions.length === 0 || isSyncing) return;

        setIsSyncing(true);
        const actions = [...pendingActions].sort((a, b) => a.timestamp - b.timestamp);
        const successfulIds: string[] = [];

        for (const action of actions) {
            try {
                const res = await fetch(action.url, {
                    method: action.method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(action.body)
                });
                
                if (res.ok) {
                    successfulIds.push(action.id);
                } else {
                    // Stop processing this branch on server error to preserve order
                    break; 
                }
            } catch (err) {
                // Network error - stay in queue
                break;
            }
        }

        setPendingActions(prev => prev.filter(a => !successfulIds.includes(a.id)));
        setIsSyncing(false);
    }, [isOnline, pendingActions, isSyncing]);

    // Auto-trigger sync when back online
    useEffect(() => {
        if (isOnline && pendingActions.length > 0) {
            processQueue();
        }
    }, [isOnline, pendingActions.length, processQueue]);

    // 4. Register Mission Update
    const syncRequest = useCallback(async (url: string, method: 'POST' | 'PATCH' | 'PUT', body: any) => {
        const actionId = `sync_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        if (isOnline) {
            try {
                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                if (res.ok) return true;
                throw new Error('Server Error');
            } catch (err) {
                // Fallback to queue if request fails while ostensibly online
            }
        }

        // Add to queue if offline or request failed
        const newAction: SyncAction = {
            id: actionId,
            url,
            method,
            body,
            timestamp: Date.now(),
            retryCount: 0
        };

        setPendingActions(prev => [...prev, newAction]);
        toast('Action Queued (Offline Mode)', { icon: '📦' });
        return false;
    }, [isOnline]);

    return { 
        isOnline, 
        isSyncing, 
        pendingCount: pendingActions.length,
        syncRequest 
    };
}
