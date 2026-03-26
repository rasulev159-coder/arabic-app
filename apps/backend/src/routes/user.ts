import { Router, Response } from 'express';
import { z }                from 'zod';
import { prisma }           from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { getLevel }         from '@arabic/shared';

export const userRouter = Router();
userRouter.use(requireAuth);

async function buildPublic(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      streak:   true,
      progress: { where: { known: true }, select: { id: true } },
    },
  });
  const knownCount = user.progress.length;
  return {
    id:               user.id,
    email:            user.email,
    name:             user.name,
    avatar:           user.avatar,
    language:         user.language,
    createdAt:        user.createdAt.toISOString(),
    level:            getLevel(knownCount),
    knownLettersCount: knownCount,
    streak: {
      current:      user.streak?.current      ?? 0,
      longest:      user.streak?.longest      ?? 0,
      lastActivity: user.streak?.lastActivity.toISOString() ?? null,
    },
  };
}

// GET /api/user/me
userRouter.get('/me', async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await buildPublic(req.userId!);
  res.json({ ok: true, data: user });
});

// PATCH /api/user/me
const updateSchema = z.object({
  name:   z.string().min(2).max(50).optional(),
  avatar: z.string().url().optional(),
});

userRouter.patch('/me', async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0].message });
    return;
  }
  await prisma.user.update({ where: { id: req.userId! }, data: parsed.data });
  res.json({ ok: true, data: await buildPublic(req.userId!) });
});

// PATCH /api/user/language
userRouter.patch('/language', async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = z.object({ language: z.enum(['ru', 'uz', 'en']) }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: 'Invalid language' });
    return;
  }
  await prisma.user.update({ where: { id: req.userId! }, data: { language: parsed.data.language } });
  res.json({ ok: true, data: { language: parsed.data.language } });
});
