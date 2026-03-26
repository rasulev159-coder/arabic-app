import { Router, Response } from 'express';
import { z }                from 'zod';
import { prisma }           from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { broadcastToRoom, sendToUser } from '../lib/ws';
import { checkAndUnlockAchievements }  from '../services/achievements';
import { updateStreak } from '../services/streak';

export const challengesRouter = Router();

// POST /api/challenges — create challenge
challengesRouter.post('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = z.object({
    mode: z.enum(['flashcard','quiz','speed','lightning','memory','listen','find','write']),
  }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0].message });
    return;
  }

  const challenge = await prisma.challenge.create({
    data: {
      challengerId: req.userId!,
      mode:         parsed.data.mode,
      seed:         Math.floor(Math.random() * 1_000_000),
      expiresAt:    new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    include: {
      challenger: { select: { id: true, name: true, avatar: true } },
    },
  });

  res.status(201).json({ ok: true, data: formatChallenge(challenge) });
});

// GET /api/challenges/:token (public — no auth required)
challengesRouter.get('/:token', async (req: AuthRequest, res: Response): Promise<void> => {
  const challenge = await prisma.challenge.findUnique({
    where: { shareToken: req.params.token },
    include: {
      challenger: { select: { id: true, name: true, avatar: true } },
      opponent:   { select: { id: true, name: true, avatar: true } },
    },
  });

  if (!challenge) {
    res.status(404).json({ ok: false, error: 'Challenge not found' });
    return;
  }
  if (new Date() > challenge.expiresAt) {
    res.status(410).json({ ok: false, error: 'Challenge expired' });
    return;
  }

  res.json({ ok: true, data: formatChallenge(challenge) });
});

// POST /api/challenges/:token/accept
challengesRouter.post('/:token/accept', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const challenge = await prisma.challenge.findUnique({ where: { shareToken: req.params.token } });
  if (!challenge) {
    res.status(404).json({ ok: false, error: 'Challenge not found' });
    return;
  }
  if (challenge.challengerId === req.userId!) {
    res.status(400).json({ ok: false, error: 'Cannot accept your own challenge' });
    return;
  }
  if (challenge.status !== 'pending') {
    res.status(400).json({ ok: false, error: 'Challenge already accepted' });
    return;
  }

  const updated = await prisma.challenge.update({
    where: { id: challenge.id },
    data:  { opponentId: req.userId!, status: 'active' },
    include: {
      challenger: { select: { id: true, name: true, avatar: true } },
      opponent:   { select: { id: true, name: true, avatar: true } },
    },
  });

  // Notify challenger via WS
  const opponent = await prisma.user.findUnique({ where: { id: req.userId! }, select: { name: true } });
  broadcastToRoom(challenge.id, { type: 'challenge:joined', data: { opponentName: opponent!.name } }, req.userId!);

  res.json({ ok: true, data: formatChallenge(updated) });
});

// POST /api/challenges/:token/result
challengesRouter.post('/:token/result', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = z.object({
    score:       z.number().int().min(0),
    durationSec: z.number().int().min(0),
  }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0].message });
    return;
  }

  const challenge = await prisma.challenge.findUnique({
    where: { shareToken: req.params.token },
    include: {
      challenger: { select: { id: true, name: true, avatar: true } },
      opponent:   { select: { id: true, name: true, avatar: true } },
    },
  });

  if (!challenge) {
    res.status(404).json({ ok: false, error: 'Challenge not found' });
    return;
  }

  const isChallenger = challenge.challengerId === req.userId!;
  const isOpponent   = challenge.opponentId   === req.userId!;
  if (!isChallenger && !isOpponent) {
    res.status(403).json({ ok: false, error: 'Not a participant' });
    return;
  }

  const updateData = isChallenger
    ? { challengerScore: parsed.data.score }
    : { opponentScore: parsed.data.score };

  const updated = await prisma.challenge.update({
    where: { id: challenge.id },
    data:  updateData,
  });

  // Notify the other party
  broadcastToRoom(challenge.id, { type: 'challenge:result', data: { userId: req.userId!, score: parsed.data.score } }, req.userId!);

  // Check if both submitted
  const bothDone = updated.challengerScore !== null && updated.opponentScore !== null;
  if (bothDone) {
    const cScore = updated.challengerScore!;
    const oScore = updated.opponentScore!;
    const winnerId = cScore >= oScore ? updated.challengerId : updated.opponentId!;

    await prisma.challenge.update({ where: { id: challenge.id }, data: { status: 'completed' } });

    broadcastToRoom(challenge.id, {
      type: 'challenge:complete',
      data: { winnerId, challengerScore: cScore, opponentScore: oScore },
    });

    // Award winner achievement
    const streak = await updateStreak(winnerId);
    await checkAndUnlockAchievements(winnerId, {
      mode: challenge.mode, score: Math.max(cScore, oScore),
      totalQ: 12, durationSec: parsed.data.durationSec,
      streak, hour: new Date().getHours(),
    });
  }

  res.json({ ok: true, data: formatChallenge(updated as any) });
});

// ── Helper ────────────────────────────────────────────────────────────────────
function formatChallenge(c: any) {
  return {
    id:              c.id,
    shareToken:      c.shareToken,
    mode:            c.mode,
    seed:            c.seed,
    status:          c.status,
    challenger:      c.challenger,
    opponent:        c.opponent ?? null,
    challengerScore: c.challengerScore ?? null,
    opponentScore:   c.opponentScore   ?? null,
    expiresAt:       c.expiresAt instanceof Date ? c.expiresAt.toISOString() : c.expiresAt,
  };
}
