import { Router, Response } from 'express';
import { z }                from 'zod';
import { prisma }           from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { getLevel }         from '@arabic/shared';
import { comparePassword, hashPassword } from '../lib/auth';

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
    role:             user.role,
    xp:               user.xp,
    xpLevel:          user.xpLevel,
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
function sanitize(str: string): string {
  return str.replace(/[<>]/g, '').trim();
}

const updateSchema = z.object({
  name:   z.string().min(2).max(50).transform(sanitize).optional(),
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

// PATCH /api/user/password
const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(6),
});

userRouter.patch('/password', async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = passwordSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0].message });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user || !user.passwordHash) {
    res.status(400).json({ ok: false, error: 'Password login not configured' });
    return;
  }

  const valid = await comparePassword(parsed.data.currentPassword, user.passwordHash);
  if (!valid) {
    res.status(401).json({ ok: false, error: 'Current password is incorrect' });
    return;
  }

  const newHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({ where: { id: req.userId! }, data: { passwordHash: newHash } });
  res.json({ ok: true });
});

// PATCH /api/user/spin — save SPIN quiz answers
userRouter.patch('/spin', async (req: AuthRequest, res: Response): Promise<void> => {
  const { answers } = req.body;
  if (!answers || typeof answers !== 'object') {
    res.status(400).json({ ok: false, error: 'Invalid answers' });
    return;
  }
  await prisma.user.update({
    where: { id: req.userId! },
    data: { spinAnswers: JSON.stringify(answers) },
  });
  res.json({ ok: true });
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
