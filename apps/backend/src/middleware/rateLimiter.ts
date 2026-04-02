import { Request, Response, NextFunction } from 'express';
import { redis } from '../lib/redis';

/**
 * Redis-based rate limiter that works on Vercel serverless.
 * In-memory rate-limit doesn't persist across serverless invocations,
 * so we use Redis to track request counts per IP.
 */
function createRedisLimiter(prefix: string, windowSec: number, maxRequests: number) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim()
        || req.headers['x-real-ip']?.toString()
        || req.ip
        || 'unknown';
      const key = `rl:${prefix}:${ip}`;
      const current = await redis.incr(key);
      if (current === 1) {
        await redis.expire(key, windowSec);
      }
      if (current > maxRequests) {
        res.status(429).json({
          ok: false,
          error: 'Too many requests, please try again later',
          code: 'RATE_LIMITED',
        });
        return;
      }
      next();
    } catch {
      // If Redis is down, let the request through (fail-open)
      next();
    }
  };
}

/** 20 req / min per IP — for /api/auth/* (login, register) */
export const authLimiter = createRedisLimiter('auth', 60, 20);

/** 200 req / min per IP — for all other /api/* */
export const apiLimiter = createRedisLimiter('api', 60, 200);

/** 5 registrations / hour per IP */
export const registerLimiter = createRedisLimiter('reg', 3600, 5);
