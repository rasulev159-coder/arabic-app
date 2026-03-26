import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { awardXp } from '../services/xp';
import { updateStreak } from '../services/streak';

export const dailyRouter = Router();
dailyRouter.use(requireAuth);

const AVAILABLE_MODES = ['quiz', 'speed', 'find', 'lightning', 'listen'];

function pickRandomModes(): string[] {
  const count = 2 + Math.floor(Math.random() * 2); // 2 or 3
  const shuffled = [...AVAILABLE_MODES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

// GET /api/daily - Get today's lesson for current user
dailyRouter.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId!;
  const date = todayString();

  let lesson = await prisma.dailyLesson.findUnique({
    where: { userId_date: { userId, date } },
  });

  if (!lesson) {
    const modes = pickRandomModes();
    lesson = await prisma.dailyLesson.create({
      data: {
        userId,
        date,
        modes: JSON.stringify(modes),
      },
    });
  }

  res.json({
    ok: true,
    data: {
      id: lesson.id,
      date: lesson.date,
      modes: JSON.parse(lesson.modes),
      completed: lesson.completed,
      score: lesson.score,
      xpEarned: lesson.xpEarned,
    },
  });
});

const completeSchema = z.object({
  score: z.number().int().min(0),
});

// POST /api/daily/complete - Mark today's lesson complete
dailyRouter.post('/complete', async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = completeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0].message });
    return;
  }

  const userId = req.userId!;
  const date = todayString();
  const { score } = parsed.data;

  const existing = await prisma.dailyLesson.findUnique({
    where: { userId_date: { userId, date } },
  });

  if (!existing) {
    res.status(404).json({ ok: false, error: 'No daily lesson found for today' });
    return;
  }

  if (existing.completed) {
    res.status(400).json({ ok: false, error: 'Daily lesson already completed' });
    return;
  }

  // Award XP
  const xpResult = await awardXp(userId, 'daily_lesson_complete');

  // Update streak
  await updateStreak(userId);

  const lesson = await prisma.dailyLesson.update({
    where: { userId_date: { userId, date } },
    data: {
      completed: true,
      score,
      xpEarned: 50, // matches XP_REWARDS.daily_lesson_complete
      completedAt: new Date(),
    },
  });

  res.json({
    ok: true,
    data: {
      lesson: {
        id: lesson.id,
        date: lesson.date,
        modes: JSON.parse(lesson.modes),
        completed: lesson.completed,
        score: lesson.score,
        xpEarned: lesson.xpEarned,
      },
      xp: {
        newXp: xpResult.newXp,
        newLevel: xpResult.newLevel,
        leveledUp: xpResult.leveledUp,
      },
    },
  });
});
