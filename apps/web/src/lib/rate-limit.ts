import redis from './redis';

interface RateLimitConfig {
  windowMs: number;     // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

export async function rateLimit(
  identifier: string,   // IP address or user ID
  route: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  try {
    const key = `ratelimit:${route}:${identifier}`;
    const windowSeconds = Math.ceil(config.windowMs / 1000);

    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }

    const ttl = await redis.ttl(key);

    return {
      allowed: current <= config.maxRequests,
      remaining: Math.max(0, config.maxRequests - current),
      resetAt: new Date(Date.now() + ttl * 1000),
    };
  } catch (error) {
    console.error(`[RateLimit Error] ${route}:${identifier}:`, error);
    // On redis error, allow the request to prevent outage
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: new Date(),
    };
  }
}
