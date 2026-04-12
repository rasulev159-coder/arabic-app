import { Response, NextFunction } from 'express';
import { AuthRequest } from './requireAuth';
import { prisma } from '../lib/prisma';
import { AI_LIMITS } from '../config/aiLimits';

export async function aiRateLimit(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) { res.status(401).json({ ok: false, error: 'Unauthorized' }); return; }

  let plan = user.plan as 'free' | 'pro';

  // Check if pro expired
  if (plan === 'pro' && user.planExpiresAt && user.planExpiresAt < new Date()) {
    await prisma.user.update({ where: { id: user.id }, data: { plan: 'free' } });
    plan = 'free';
  }

  const limits = AI_LIMITS[plan];
  const today = new Date().toISOString().slice(0, 10);
  const lastDate = user.lastAiRequestDate?.toISOString().slice(0, 10);

  let dailyCount = user.dailyAiRequests;
  if (lastDate !== today) {
    dailyCount = 0; // reset for new day
  }

  if (plan === 'free' && dailyCount >= limits.dailyRequests) {
    res.status(429).json({
      ok: false,
      error: 'daily_limit_reached',
      limit: limits.dailyRequests,
      used: dailyCount,
      plan: 'free',
    });
    return;
  }

  // Increment counter
  await prisma.user.update({
    where: { id: user.id },
    data: {
      dailyAiRequests: dailyCount + 1,
      lastAiRequestDate: new Date(),
    },
  });

  // Attach model info to request
  (req as any).aiModel = limits.model;
  (req as any).aiMaxTokens = limits.maxTokens;
  (req as any).aiPlan = plan;
  (req as any).aiDailyUsed = dailyCount + 1;
  (req as any).aiDailyLimit = plan === 'free' ? limits.dailyRequests : null;

  next();
}
