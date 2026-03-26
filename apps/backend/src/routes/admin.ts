import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/requireAuth';
import { LETTERS } from '@arabic/shared';

export const adminRouter = Router();

// GET /api/admin/letters — returns all letters merged with overrides
adminRouter.get('/letters', async (_req: AuthRequest, res: Response): Promise<void> => {
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

// PATCH /api/admin/letters/:code — update override for a letter
const letterOverrideSchema = z.object({
  nameRu:        z.string().optional(),
  nameUz:        z.string().optional(),
  nameEn:        z.string().optional(),
  associationRu: z.string().optional(),
  associationUz: z.string().optional(),
  associationEn: z.string().optional(),
});

adminRouter.patch('/letters/:code', async (req: AuthRequest, res: Response): Promise<void> => {
  const { code } = req.params;
  const letter = LETTERS.find(l => l.code === code);
  if (!letter) {
    res.status(404).json({ ok: false, error: 'Letter not found' });
    return;
  }

  const parsed = letterOverrideSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0].message });
    return;
  }

  const override = await prisma.letterOverride.upsert({
    where: { letterCode: code },
    update: parsed.data,
    create: { letterCode: code, ...parsed.data },
  });

  res.json({ ok: true, data: override });
});

// GET /api/admin/users — returns all users with roles
adminRouter.get('/users', async (_req: AuthRequest, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      language: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ ok: true, data: users });
});

// PATCH /api/admin/users/:id/role — change user role
const roleSchema = z.object({
  role: z.enum(['user', 'admin']),
});

adminRouter.patch('/users/:id/role', async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = roleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: parsed.error.issues[0].message });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) {
    res.status(404).json({ ok: false, error: 'User not found' });
    return;
  }

  const updated = await prisma.user.update({
    where: { id: req.params.id },
    data: { role: parsed.data.role },
    select: { id: true, email: true, name: true, role: true },
  });

  res.json({ ok: true, data: updated });
});
