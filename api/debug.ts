import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const results: any = {};

  // Test DB
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const count = await prisma.user.count();
    results.db = { ok: true, userCount: count };
    await prisma.$disconnect();
  } catch (e: any) {
    results.db = { ok: false, error: e.message };
  }

  // Test Redis
  try {
    const Redis = require('ioredis');
    const redis = new Redis(process.env.REDIS_URL);
    await redis.ping();
    results.redis = { ok: true };
    redis.disconnect();
  } catch (e: any) {
    results.redis = { ok: false, error: e.message };
  }

  results.env = {
    hasDbUrl: !!process.env.DATABASE_URL,
    hasRedis: !!process.env.REDIS_URL,
    hasJwtAccess: !!process.env.JWT_ACCESS_SECRET,
    nodeEnv: process.env.NODE_ENV,
  };

  res.status(200).json(results);
}
