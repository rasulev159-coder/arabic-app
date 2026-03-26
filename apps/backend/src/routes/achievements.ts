import { Router, Response } from 'express';
import { prisma }           from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';

export const achievementsRouter = Router();
achievementsRouter.use(requireAuth);

// GET /api/achievements
achievementsRouter.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const [all, unlocked] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { key: 'asc' } }),
    prisma.userAchievement.findMany({
      where: { userId: req.userId! },
      select: { achievementId: true, unlockedAt: true },
    }),
  ]);

  const unlockedMap = new Map(unlocked.map(u => [u.achievementId, u.unlockedAt]));

  const data = all.map(a => ({
    id:         a.id,
    key:        a.key,
    nameRu:     a.nameRu,
    nameUz:     a.nameUz,
    nameEn:     a.nameEn,
    descRu:     a.descRu,
    descUz:     a.descUz,
    descEn:     a.descEn,
    icon:       a.icon,
    unlockedAt: unlockedMap.get(a.id)?.toISOString() ?? null,
  }));

  res.json({ ok: true, data });
});
