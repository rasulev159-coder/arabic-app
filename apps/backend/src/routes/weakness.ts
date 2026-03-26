import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';

export const weaknessRouter = Router();
weaknessRouter.use(requireAuth);

// GET /api/weakness - Get user's weakness stats sorted by accuracy ascending
weaknessRouter.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId!;

  const stats = await prisma.weaknessStats.findMany({
    where: { userId },
    orderBy: { accuracy: 'asc' },
  });

  res.json({
    ok: true,
    data: stats.map((s) => ({
      letterCode: s.letterCode,
      totalErrors: s.totalErrors,
      totalSeen: s.totalSeen,
      accuracy: s.accuracy,
      nextReviewAt: s.nextReviewAt?.toISOString() ?? null,
    })),
  });
});

// GET /api/weakness/review - Get letters that need review (nextReviewAt <= now, limit 10)
weaknessRouter.get('/review', async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId!;

  const stats = await prisma.weaknessStats.findMany({
    where: {
      userId,
      nextReviewAt: { lte: new Date() },
    },
    orderBy: { accuracy: 'asc' },
    take: 10,
  });

  res.json({
    ok: true,
    data: stats.map((s) => ({
      letterCode: s.letterCode,
      totalErrors: s.totalErrors,
      totalSeen: s.totalSeen,
      accuracy: s.accuracy,
      nextReviewAt: s.nextReviewAt?.toISOString() ?? null,
    })),
  });
});

// Helper: update weakness stats for a set of letter results
export async function updateWeaknessStats(
  userId: string,
  letterResults: { letterCode: string; correct: boolean }[]
): Promise<void> {
  for (const lr of letterResults) {
    const existing = await prisma.weaknessStats.findUnique({
      where: { userId_letterCode: { userId, letterCode: lr.letterCode } },
    });

    const now = new Date();

    if (existing) {
      const newTotalSeen = existing.totalSeen + 1;
      const newTotalErrors = existing.totalErrors + (lr.correct ? 0 : 1);
      const newAccuracy = newTotalSeen > 0 ? (newTotalSeen - newTotalErrors) / newTotalSeen : 0;

      // Calculate next review based on accuracy
      const nextReviewAt = calculateNextReview(newAccuracy, now);

      await prisma.weaknessStats.update({
        where: { userId_letterCode: { userId, letterCode: lr.letterCode } },
        data: {
          totalSeen: newTotalSeen,
          totalErrors: newTotalErrors,
          accuracy: newAccuracy,
          lastSeen: now,
          nextReviewAt,
        },
      });
    } else {
      const totalErrors = lr.correct ? 0 : 1;
      const accuracy = lr.correct ? 1 : 0;
      const nextReviewAt = calculateNextReview(accuracy, now);

      await prisma.weaknessStats.create({
        data: {
          userId,
          letterCode: lr.letterCode,
          totalSeen: 1,
          totalErrors,
          accuracy,
          lastSeen: now,
          nextReviewAt,
        },
      });
    }
  }
}

function calculateNextReview(accuracy: number, from: Date): Date {
  const ms = from.getTime();
  if (accuracy < 0.5) {
    return new Date(ms + 1 * 24 * 60 * 60 * 1000); // 1 day
  } else if (accuracy <= 0.8) {
    return new Date(ms + 3 * 24 * 60 * 60 * 1000); // 3 days
  } else {
    return new Date(ms + 7 * 24 * 60 * 60 * 1000); // 7 days
  }
}
