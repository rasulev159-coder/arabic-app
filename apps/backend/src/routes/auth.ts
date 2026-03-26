import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { OAuth2Client } from 'google-auth-library';
import { prisma }          from '../lib/prisma';
import { redis }           from '../lib/redis';
import { hashPassword, comparePassword, signAccess, signRefresh, verifyRefresh } from '../lib/auth';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { getLevel }        from '@arabic/shared';

export const authRouter = Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Schemas ───────────────────────────────────────────────────────────────────
const registerSchema = z.object({
  email:    z.string().email(),
  name:     z.string().min(2).max(50),
  password: z.string().min(8).max(100),
  language: z.enum(['ru', 'uz', 'en']).optional(),
});

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string(),
});

// ── Helpers ───────────────────────────────────────────────────────────────────
async function buildUserPublic(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      streak: true,
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

function setRefreshCookie(res: Response, token: string): void {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   30 * 24 * 60 * 60 * 1000,
  });
}

// ── POST /api/auth/register ───────────────────────────────────────────────────
authRouter.post('/register', async (req: Request, res: Response): Promise<void> => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0].message });
    return;
  }
  const { email, name, password, language } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(400).json({ ok: false, error: 'Email already registered', code: 'EMAIL_TAKEN' });
    return;
  }

  const user = await prisma.user.create({
    data: { email, name, passwordHash: await hashPassword(password), language: language ?? 'ru' },
  });

  const accessToken  = signAccess({ userId: user.id, email: user.email });
  const refreshToken = signRefresh({ userId: user.id, email: user.email });
  setRefreshCookie(res, refreshToken);

  res.status(201).json({ ok: true, data: { accessToken, refreshToken, user: await buildUserPublic(user.id) } });
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0].message });
    return;
  }
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user?.passwordHash || !(await comparePassword(password, user.passwordHash))) {
    res.status(401).json({ ok: false, error: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });
    return;
  }

  const accessToken  = signAccess({ userId: user.id, email: user.email });
  const refreshToken = signRefresh({ userId: user.id, email: user.email });
  setRefreshCookie(res, refreshToken);

  res.json({ ok: true, data: { accessToken, refreshToken, user: await buildUserPublic(user.id) } });
});

// ── POST /api/auth/refresh ────────────────────────────────────────────────────
authRouter.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken ?? req.body?.refreshToken;
  if (!token) {
    res.status(401).json({ ok: false, error: 'No refresh token', code: 'NO_TOKEN' });
    return;
  }

  // Check blacklist
  const blacklisted = await redis.get(`blacklist:${token}`);
  if (blacklisted) {
    res.status(401).json({ ok: false, error: 'Token revoked', code: 'TOKEN_REVOKED' });
    return;
  }

  try {
    const payload = verifyRefresh(token);
    const accessToken  = signAccess({ userId: payload.userId, email: payload.email });
    const refreshToken = signRefresh({ userId: payload.userId, email: payload.email });
    // Blacklist old token
    await redis.setex(`blacklist:${token}`, 30 * 24 * 60 * 60, '1');
    setRefreshCookie(res, refreshToken);
    res.json({ ok: true, data: { accessToken, refreshToken } });
  } catch {
    res.status(401).json({ ok: false, error: 'Invalid refresh token', code: 'INVALID_TOKEN' });
  }
});

// ── POST /api/auth/google ─────────────────────────────────────────────────────
authRouter.post('/google', async (req: Request, res: Response): Promise<void> => {
  const { idToken } = req.body as { idToken?: string };
  if (!idToken) {
    res.status(400).json({ ok: false, error: 'Missing idToken' });
    return;
  }

  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.email) throw new Error('No email in token');

    let user = await prisma.user.findUnique({ where: { googleId: payload.sub } });
    if (!user) {
      user = await prisma.user.upsert({
        where:  { email: payload.email },
        update: { googleId: payload.sub, avatar: payload.picture },
        create: {
          email:    payload.email,
          name:     payload.name ?? 'User',
          googleId: payload.sub,
          avatar:   payload.picture,
        },
      });
    }

    const accessToken  = signAccess({ userId: user.id, email: user.email });
    const refreshToken = signRefresh({ userId: user.id, email: user.email });
    setRefreshCookie(res, refreshToken);

    res.json({ ok: true, data: { accessToken, refreshToken, user: await buildUserPublic(user.id) } });
  } catch (e) {
    res.status(401).json({ ok: false, error: 'Invalid Google token' });
  }
});

// ── DELETE /api/auth/logout ───────────────────────────────────────────────────
authRouter.delete('/logout', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken;
  if (token) await redis.setex(`blacklist:${token}`, 30 * 24 * 60 * 60, '1');
  res.clearCookie('refreshToken');
  res.json({ ok: true, data: null });
});
