/**
 * Redis Cache Layer
 *
 * Production-safe wrapper using SCAN instead of KEYS (KEYS blocks Redis in production).
 * Supports TTL, prefixed namespacing, and pattern-based invalidation.
 */

import redis from './redis';

interface CacheOptions {
  ttl: number;     // seconds
  prefix?: string;
}

/**
 * Cache-aside pattern: try cache first, fall back to fetcher, write back.
 */
export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  { ttl, prefix = 'cache' }: CacheOptions
): Promise<T> {
  const cacheKey = `${prefix}:${key}`;

  try {
    const hit = await redis.get(cacheKey);
    if (hit) return JSON.parse(hit) as T;
  } catch {
    // Cache read failure — continue to fetcher (fail-open)
  }

  const data = await fetcher();

  try {
    await redis.setex(cacheKey, ttl, JSON.stringify(data));
  } catch {
    // Cache write failure — non-fatal
  }

  return data;
}

/**
 * Invalidate all keys matching a pattern using SCAN (non-blocking, production-safe).
 * Never use KEYS in production — it blocks the entire Redis instance.
 *
 * @param pattern  Glob-style pattern WITHOUT the prefix. e.g. 'products:*'
 * @param prefix   Cache prefix used during write (default: 'cache')
 */
export async function invalidate(pattern: string, prefix = 'cache'): Promise<void> {
  const fullPattern = `${prefix}:${pattern}`;

  try {
    let cursor = '0';
    const keysToDelete: string[] = [];

    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        'MATCH', fullPattern,
        'COUNT', 100
      );
      cursor = nextCursor;
      keysToDelete.push(...keys);
    } while (cursor !== '0');

    if (keysToDelete.length > 0) {
      // Delete in batches of 100 to avoid large pipeline stalls
      for (let i = 0; i < keysToDelete.length; i += 100) {
        const batch = keysToDelete.slice(i, i + 100);
        await redis.del(...batch);
      }
    }
  } catch (err) {
    console.error(`[Cache] Invalidation failed for pattern ${fullPattern}:`, err);
  }
}

/**
 * Delete a single cache key directly.
 */
export async function del(key: string, prefix = 'cache'): Promise<void> {
  try {
    await redis.del(`${prefix}:${key}`);
  } catch {
    // Non-fatal
  }
}

/**
 * Write a value to cache directly (no fetcher).
 */
export async function set<T>(
  key: string,
  value: T,
  { ttl, prefix = 'cache' }: CacheOptions
): Promise<void> {
  try {
    await redis.setex(`${prefix}:${key}`, ttl, JSON.stringify(value));
  } catch {
    // Non-fatal
  }
}
