import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

function jsonResponse(res: Response, status: number, msg: string) {
  res.status(status).json({ ok: false, error: msg, code: 'RATE_LIMITED' });
}

/** 100 req / min — for /api/auth/* */
export const authLimiter = rateLimit({
  windowMs:    60_000,
  max:         100,
  standardHeaders: true,
  legacyHeaders:   false,
  handler: (_req: Request, res: Response) =>
    jsonResponse(res, 429, 'Too many auth requests, please try again later'),
});

/** 500 req / min — for all other /api/* */
export const apiLimiter = rateLimit({
  windowMs:    60_000,
  max:         500,
  standardHeaders: true,
  legacyHeaders:   false,
  handler: (_req: Request, res: Response) =>
    jsonResponse(res, 429, 'Too many requests, please try again later'),
});
