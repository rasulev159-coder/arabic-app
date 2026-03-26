import { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../lib/auth';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ ok: false, error: 'Unauthorized', code: 'NO_TOKEN' });
    return;
  }
  const token = header.slice(7);
  try {
    const payload = verifyAccess(token);
    req.userId    = payload.userId;
    req.userEmail = payload.email;
    next();
  } catch {
    res.status(401).json({ ok: false, error: 'Token expired or invalid', code: 'INVALID_TOKEN' });
  }
}
