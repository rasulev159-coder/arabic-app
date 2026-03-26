import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { requireAdmin } from '../middleware/requireAdmin';

export const analyticsRouter = Router();

const eventSchema = z.object({
  event: z.string().min(1).max(100),
  data: z.any().optional(),
});

// POST /api/analytics/event - Log event (authenticated)
analyticsRouter.post('/event', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0].message });
    return;
  }

  const { event, data } = parsed.data;

  await prisma.analyticsEvent.create({
    data: {
      userId: req.userId,
      event,
      data: data !== undefined ? JSON.stringify(data) : null,
    },
  });

  res.json({ ok: true, data: null });
});

// GET /api/analytics/summary - Admin only: aggregated stats
analyticsRouter.get('/summary', requireAuth, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [totalUsers, dailyActiveUsers, lessonsCompleted, modeEvents] = await Promise.all([
    // Total users
    prisma.user.count(),

    // Daily active: users with sessions today
    prisma.studySession.findMany({
      where: { date: { gte: todayStart } },
      select: { userId: true },
      distinct: ['userId'],
    }),

    // Total lessons completed
    prisma.dailyLesson.count({ where: { completed: true } }),

    // Popular modes from study sessions
    prisma.studySession.groupBy({
      by: ['mode'],
      _count: { mode: true },
      orderBy: { _count: { mode: 'desc' } },
    }),
  ]);

  const popularModes = modeEvents.map((m) => ({
    mode: m.mode,
    count: m._count.mode,
  }));

  res.json({
    ok: true,
    data: {
      totalUsers,
      dailyActiveUsers: dailyActiveUsers.length,
      lessonsCompleted,
      popularModes,
    },
  });
});
