import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { requireAdmin } from '../middleware/requireAdmin';
import { prisma } from '../lib/prisma';
import { processNotifications } from '../services/notifications';

export const notificationsRouter = Router();

// POST /api/notifications/subscribe — save push subscription
notificationsRouter.post('/subscribe', requireAuth, async (req: AuthRequest, res: Response) => {
  const { subscription } = req.body;
  if (!subscription) {
    res.status(400).json({ ok: false, error: 'Missing subscription' });
    return;
  }
  await prisma.user.update({
    where: { id: req.userId },
    data: { pushSubscription: JSON.stringify(subscription) },
  });
  res.json({ ok: true });
});

// POST /api/notifications/unsubscribe — remove push subscription
notificationsRouter.post('/unsubscribe', requireAuth, async (req: AuthRequest, res: Response) => {
  await prisma.user.update({
    where: { id: req.userId },
    data: { pushSubscription: null },
  });
  res.json({ ok: true });
});

// POST /api/notifications/send — manually trigger notification processing (admin only)
notificationsRouter.post('/send', requireAuth, requireAdmin, async (_req: AuthRequest, res: Response) => {
  const results = await processNotifications();
  res.json({ ok: true, data: { sent: results.length, details: results } });
});

// GET /api/notifications/log — view notification history (admin only)
notificationsRouter.get('/log', requireAuth, requireAdmin, async (_req: AuthRequest, res: Response) => {
  const logs = await prisma.notificationLog.findMany({
    orderBy: { sentAt: 'desc' },
    take: 100,
    include: { user: { select: { email: true, name: true } } },
  });
  res.json({ ok: true, data: logs });
});
