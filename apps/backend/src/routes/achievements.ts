import { Router, Response } from 'express';
import { prisma }           from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { ACHIEVEMENTS_SEED, AchievementProgressDto } from '@arabic/shared';

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

// GET /api/achievements/progress
achievementsRouter.get('/progress', async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId!;

  const [
    allAchievements,
    userAchievements,
    knownCount,
    streak,
    lightningTotal,
    totalSessions,
    challengeWins,
    perfectQuizCount,
    flashcardBest,
    memoryBest,
    hasNightSession,
    hasEarlySession,
  ] = await Promise.all([
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true, unlockedAt: true },
    }),
    prisma.letterProgress.count({ where: { userId, known: true } }),
    prisma.streak.findUnique({ where: { userId } }),
    prisma.studySession.aggregate({
      where: { userId, mode: 'lightning' },
      _sum: { score: true },
    }),
    prisma.studySession.count({ where: { userId } }),
    prisma.challenge.count({
      where: { status: 'completed', OR: [
        { challengerId: userId, challengerScore: { not: null }, opponentScore: { not: null } },
        { opponentId: userId, challengerScore: { not: null }, opponentScore: { not: null } },
      ]},
    }),
    // Count perfect quizzes (score === totalQ, mode=quiz)
    prisma.$queryRawUnsafe<[{ count: bigint }]>(
      `SELECT COUNT(*) as count FROM study_sessions WHERE "userId" = $1 AND mode = 'quiz' AND score = "totalQ" AND "totalQ" > 0`,
      userId,
    ),
    // Best flashcard session (min durationSec where score >= 28)
    prisma.studySession.findFirst({
      where: { userId, mode: 'flashcard', score: { gte: 28 } },
      orderBy: { durationSec: 'asc' },
      select: { durationSec: true },
    }),
    // Best memory session
    prisma.studySession.findFirst({
      where: { userId, mode: 'memory', score: { gte: 28 } },
      orderBy: { durationSec: 'asc' },
      select: { durationSec: true },
    }),
    // Night sessions (hour >= 23)
    prisma.$queryRawUnsafe<[{ count: bigint }]>(
      `SELECT COUNT(*) as count FROM study_sessions WHERE "userId" = $1 AND EXTRACT(HOUR FROM date) >= 23`,
      userId,
    ),
    // Early sessions (hour < 7)
    prisma.$queryRawUnsafe<[{ count: bigint }]>(
      `SELECT COUNT(*) as count FROM study_sessions WHERE "userId" = $1 AND EXTRACT(HOUR FROM date) < 7`,
      userId,
    ),
  ]);

  // Count actual challenge wins (where user is winner)
  const actualChallengeWins = await prisma.$queryRawUnsafe<[{ count: bigint }]>(
    `SELECT COUNT(*) as count FROM challenges
     WHERE status = 'completed' AND (
       ("challengerId" = $1 AND "challengerScore" > "opponentScore") OR
       ("opponentId" = $1 AND "opponentScore" > "challengerScore")
     )`,
    userId,
  );

  const unlockedMap = new Map(
    userAchievements.map(u => [u.achievementId, u.unlockedAt])
  );
  const achKeyToId = new Map(allAchievements.map(a => [a.key, a.id]));

  const seedMap = new Map(ACHIEVEMENTS_SEED.map(s => [s.key, s]));

  const currentStreak = streak?.current ?? 0;
  const perfectQuizzes = Number(perfectQuizCount[0]?.count ?? 0);
  const lightningScore = lightningTotal._sum.score ?? 0;
  const winCount = Number(actualChallengeWins[0]?.count ?? 0);
  const nightSessions = Number(hasNightSession[0]?.count ?? 0);
  const earlySessions = Number(hasEarlySession[0]?.count ?? 0);
  const flashcardBestSec = flashcardBest?.durationSec ?? null;
  const memoryBestSec = memoryBest?.durationSec ?? null;

  const progress: AchievementProgressDto[] = allAchievements.map(ach => {
    const cond = ach.condition as Record<string, unknown>;
    const seed = seedMap.get(ach.key);
    const category = seed?.category ?? 'other';
    const achId = ach.id;
    const unlockedAt = unlockedMap.get(achId);
    const isUnlocked = !!unlockedAt;

    let current: number | null = 0;
    let target = 1;
    let percentage = 0;

    switch (cond.type) {
      case 'letters_known':
        target = Number(cond.value);
        current = knownCount;
        percentage = Math.min(100, (current / target) * 100);
        break;

      case 'streak':
        target = Number(cond.value);
        current = currentStreak;
        percentage = Math.min(100, (current / target) * 100);
        break;

      case 'session_speed': {
        const maxSec = Number(cond.maxSec);
        target = maxSec;
        const mode = cond.mode as string;
        if (mode === 'flashcard') {
          current = flashcardBestSec;
        } else if (mode === 'memory') {
          current = memoryBestSec;
        } else {
          current = null;
        }
        if (current === null) {
          percentage = 0;
        } else if (current <= target) {
          percentage = 100;
        } else {
          // The closer to target, the higher the percentage
          percentage = Math.max(0, Math.min(100, (1 - (current - target) / target) * 100));
        }
        break;
      }

      case 'perfect_session':
        target = 1;
        current = Math.min(perfectQuizzes, 1);
        percentage = current >= 1 ? 100 : 0;
        break;

      case 'perfect_count':
        target = Number(cond.value);
        current = perfectQuizzes;
        percentage = Math.min(100, (current / target) * 100);
        break;

      case 'total_correct_mode':
        target = Number(cond.value);
        current = lightningScore;
        percentage = Math.min(100, (current / target) * 100);
        break;

      case 'challenge_win':
        target = Number(cond.value);
        current = winCount;
        percentage = Math.min(100, (current / target) * 100);
        break;

      case 'time_of_day':
        target = 1;
        if (cond.after !== undefined) {
          current = nightSessions > 0 ? 1 : 0;
        } else if (cond.before !== undefined) {
          current = earlySessions > 0 ? 1 : 0;
        }
        percentage = (current ?? 0) >= 1 ? 100 : 0;
        break;

      case 'textbook_chapters':
        target = Number(cond.value);
        current = 0; // tracked in frontend localStorage
        percentage = 0;
        break;

      case 'total_sessions':
        target = Number(cond.value);
        current = totalSessions;
        percentage = Math.min(100, (current / target) * 100);
        break;
    }

    if (isUnlocked) percentage = 100;

    return {
      key: ach.key,
      current,
      target,
      percentage: Math.round(percentage),
      unlocked: isUnlocked,
      unlockedAt: unlockedAt?.toISOString() ?? null,
      category,
    };
  });

  res.json({ ok: true, data: progress });
});
