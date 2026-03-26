import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { LETTERS } from '@arabic/shared';

export const letterRouter = Router();

// GET /api/letters — returns all letters merged with overrides (public)
letterRouter.get('/', async (_req: Request, res: Response): Promise<void> => {
  const overrides = await prisma.letterOverride.findMany();
  const overrideMap = new Map(overrides.map(o => [o.letterCode, o]));

  const merged = LETTERS.map(letter => {
    const ov = overrideMap.get(letter.code);
    if (!ov) return letter;
    return {
      ...letter,
      nameRu:        ov.nameRu        ?? letter.nameRu,
      nameUz:        ov.nameUz        ?? letter.nameUz,
      nameEn:        ov.nameEn        ?? letter.nameEn,
      associationRu: ov.associationRu ?? undefined,
      associationUz: ov.associationUz ?? undefined,
      associationEn: ov.associationEn ?? undefined,
    };
  });

  res.json({ ok: true, data: merged });
});
