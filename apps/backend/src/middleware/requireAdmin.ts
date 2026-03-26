import { Response, NextFunction } from 'express';
import { AuthRequest } from './requireAuth';
import { prisma } from '../lib/prisma';

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user || user.role !== 'admin') {
    res.status(403).json({ ok: false, error: 'Admin access required' });
    return;
  }
  next();
}
