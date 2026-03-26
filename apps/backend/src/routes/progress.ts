import { Router, Response } from 'express';
import { z }                from 'zod';
import { prisma }           from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { checkAndUnlockAchievements } from '../services/achievements';
import { updateStreak }     from '../services/streak';
import { awardXp }          from '../services/xp';
import { updateWeaknessStats } from './weakness';
import { getLevel }         from '@arabic/shared';

export const progressRouter = Router();
progressRouter.use(requireAuth);

const sessionSchema = z.object({
  mode:        z.enum(['flashcard','quiz','speed','lightning','memory','listen','find','write']),
  score:       z.number().int().min(0),
  totalQ:      z.number().int().min(1),
  durationSec: z.number().int().min(0),
  letterResults: z.array(z.object({
    letterCode: z.string(),
    correct:    z.boolean(),
  })),
});

// GET /api/progress
progressRouter.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const rows = await prisma.letterProgress.findMany({ where: { userId: req.userId! } });
  res.json({ ok: true, data: rows.map(r => ({
    letterCode:   r.letterCode,
    known:        r.known,
    attempts:     r.attempts,
    correctCount: r.correctCount,
    lastSeen:     r.lastSeen?.toISOString() ?? null,
    masteredAt:   r.masteredAt?.toISOString() ?? null,
  })) });
});

// POST /api/progress/session
progressRouter.post('/session', async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = sessionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0].message });
    return;
  }
  const { mode, score, totalQ, durationSec, letterResults } = parsed.data;
  const userId = req.userId!;

  // Save session
  await prisma.studySession.create({ data: { userId, mode, score, totalQ, durationSec } });

  // Update letter progress
  for (const lr of letterResults) {
    const existing = await prisma.letterProgress.findUnique({
      where: { userId_letterCode: { userId, letterCode: lr.letterCode } },
    });
    if (existing) {
      await prisma.letterProgress.update({
        where: { userId_letterCode: { userId, letterCode: lr.letterCode } },
        data: {
          attempts:     { increment: 1 },
          correctCount: lr.correct ? { increment: 1 } : undefined,
          lastSeen:     new Date(),
          known:        lr.correct ? true : existing.known,
          masteredAt:   lr.correct && !existing.known ? new Date() : existing.masteredAt,
        },
      });
    } else {
      await prisma.letterProgress.create({
        data: {
          userId, letterCode: lr.letterCode,
          attempts: 1,
          correctCount: lr.correct ? 1 : 0,
          known: lr.correct,
          lastSeen: new Date(),
          masteredAt: lr.correct ? new Date() : null,
        },
      });
    }
  }

  // Speed records (for speed/lightning/memory)
  if (['speed','lightning','memory'].includes(mode)) {
    await prisma.speedRecord.create({ data: { userId, mode, score, durationSec } });
  }

  // Update streak
  const streak = await updateStreak(userId);

  // Update weakness stats
  await updateWeaknessStats(userId, letterResults);

  // Award XP
  const xpResult = await awardXp(userId, 'session_complete');
  let perfectXp = null;
  if (score === totalQ) {
    perfectXp = await awardXp(userId, 'perfect_session');
  }

  // Check achievements
  const unlocked = await checkAndUnlockAchievements(userId, {
    mode, score, totalQ, durationSec, streak,
    hour: new Date().getHours(),
  });

  res.json({ ok: true, data: { unlocked, xp: perfectXp ?? xpResult } });
});

// GET /api/progress/stats
progressRouter.get('/stats', async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId!;
  const [letters, sessions] = await Promise.all([
    prisma.letterProgress.findMany({ where: { userId } }),
    prisma.studySession.findMany({ where: { userId } }),
  ]);

  const knownCount    = letters.filter(l => l.known).length;
  const totalAttempts = letters.reduce((s, l) => s + l.attempts, 0);
  const totalCorrect  = letters.reduce((s, l) => s + l.correctCount, 0);

  res.json({ ok: true, data: {
    knownCount,
    totalAttempts,
    totalCorrect,
    accuracy:     totalAttempts ? Math.round(totalCorrect / totalAttempts * 100) : 0,
    totalSessions: sessions.length,
    totalTimeSec:  sessions.reduce((s, sess) => s + sess.durationSec, 0),
    level: getLevel(knownCount),
    letters: letters.map(r => ({
      letterCode:   r.letterCode,
      known:        r.known,
      attempts:     r.attempts,
      correctCount: r.correctCount,
      lastSeen:     r.lastSeen?.toISOString() ?? null,
      masteredAt:   r.masteredAt?.toISOString() ?? null,
    })),
  }});
});

// GET /api/progress/chart?days=30
progressRouter.get('/chart', async (req: AuthRequest, res: Response): Promise<void> => {
  const days = Math.min(Number(req.query.days ?? 30), 90);
  const since = new Date(Date.now() - days * 86400_000);

  const sessions = await prisma.studySession.findMany({
    where: { userId: req.userId!, date: { gte: since } },
    orderBy: { date: 'asc' },
  });

  // Group by date
  const map = new Map<string, { correct: number; attempts: number }>();
  for (const s of sessions) {
    const key = s.date.toISOString().slice(0, 10);
    const cur = map.get(key) ?? { correct: 0, attempts: 0 };
    map.set(key, { correct: cur.correct + s.score, attempts: cur.attempts + s.totalQ });
  }

  const data = Array.from(map.entries()).map(([date, v]) => ({ date, ...v }));
  res.json({ ok: true, data });
});
