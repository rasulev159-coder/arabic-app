import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const settingsRouter = Router();

const DEFAULT_SECTIONS: Record<string, boolean> = {
  games: true,
  textbook: true,
  quran: true,
  challenges: true,
  leaderboard: true,
  achievements: true,
  daily_lesson: true,
  donate: true,
  weakness: true,
  roadmap: true,
};

// GET /api/settings/sections — public
settingsRouter.get('/sections', async (_req: Request, res: Response) => {
  let settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: { id: 'singleton', sections: JSON.stringify(DEFAULT_SECTIONS) } });
  }
  const sections = { ...DEFAULT_SECTIONS, ...JSON.parse(settings.sections || '{}') };
  res.json({ ok: true, data: sections });
});
