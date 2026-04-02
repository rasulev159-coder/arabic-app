import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  lazyConnect: false,
  maxRetriesPerRequest: 1,
  connectTimeout: 5000,
  retryStrategy: (times) => (times > 2 ? null : Math.min(times * 200, 1000)),
});

redis.on('error', (err) => console.error('Redis error:', err.message));
