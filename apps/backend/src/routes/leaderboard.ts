import { Router, Response } from 'express';
import { prisma }           from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';

export const leaderboardRouter = Router();
leaderboardRouter.use(requireAuth);

// GET /api/leaderboard/speed?mode=speed
leaderboardRouter.get('/speed', async (req: AuthRequest, res: Response): Promise<void> => {
  const mode = (req.query.mode as string) ?? 'speed';

  // Best score per user for this mode
  const records = await prisma.$queryRaw<Array<{
    userId: string; name: string; avatar: string | null;
    score: number; durationSec: number; date: Date;
  }>>`
    SELECT DISTINCT ON (sr."userId")
      sr."userId", u.name, u.avatar, sr.score, sr."durationSec", sr.date
    FROM speed_records sr
    JOIN users u ON u.id = sr."userId"
    WHERE sr.mode = ${mode}
    ORDER BY sr."userId", sr.score DESC, sr."durationSec" ASC
  `;

  const sorted = records
    .sort((a, b) => b.score - a.score || a.durationSec - b.durationSec)
    .slice(0, 50)
    .map((r, i) => ({
      rank:        i + 1,
      userId:      r.userId,
      name:        r.name,
      avatar:      r.avatar,
      score:       r.score,
      durationSec: r.durationSec,
      date:        r.date.toISOString(),
    }));

  res.json({ ok: true, data: sorted });
});

// GET /api/leaderboard/streak
leaderboardRouter.get('/streak', async (_req: AuthRequest, res: Response): Promise<void> => {
  const streaks = await prisma.streak.findMany({
    orderBy: { longest: 'desc' },
    take: 50,
    include: { user: { select: { name: true, avatar: true } } },
  });

  const data = streaks.map((s, i) => ({
    rank:   i + 1,
    userId: s.userId,
    name:   s.user.name,
    avatar: s.user.avatar,
    score:  s.longest,
    date:   s.lastActivity.toISOString(),
  }));

  res.json({ ok: true, data });
});
