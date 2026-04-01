import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const donateRouter = Router();

// GET /api/donate — public, returns donate config
donateRouter.get('/', async (_req: Request, res: Response) => {
  let config = await prisma.donateConfig.findUnique({ where: { id: 'singleton' } });
  if (!config) {
    config = await prisma.donateConfig.create({ data: { id: 'singleton' } });
  }
  res.json({
    ok: true,
    data: {
      enabled: config.enabled,
      title: config.title,
      description: config.description,
      cardNumber: config.cardNumber,
      cardHolder: config.cardHolder,
      links: JSON.parse(config.links || '[]'),
    },
  });
});
