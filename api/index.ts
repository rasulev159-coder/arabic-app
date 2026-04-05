// @ts-nocheck
import 'tsconfig-paths/register';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import type { VercelRequest, VercelResponse } from '@vercel/node';

process.env.TS_NODE_BASEURL = __dirname + '/..';

const app = express();

app.use(helmet());
const ALLOWED_ORIGINS = ['https://arabic-app-ruddy.vercel.app', 'http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.some(o => origin.startsWith(o.replace(/\/$/, '')))) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
}));
app.use(cookieParser());

// Parse JSON body - but handle Vercel's pre-parsed body too
app.use((req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('application/json') && typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
    } catch {}
  }
  if (!req.body || typeof req.body !== 'object') {
    express.json()(req, res, next);
  } else {
    next();
  }
});

try {
  const { authRouter }         = require('../apps/backend/src/routes/auth');
  const { userRouter }         = require('../apps/backend/src/routes/user');
  const { progressRouter }     = require('../apps/backend/src/routes/progress');
  const { achievementsRouter } = require('../apps/backend/src/routes/achievements');
  const { leaderboardRouter }  = require('../apps/backend/src/routes/leaderboard');
  const { challengesRouter }   = require('../apps/backend/src/routes/challenges');
  const { adminRouter }        = require('../apps/backend/src/routes/admin');
  const { letterRouter }       = require('../apps/backend/src/routes/letters');
  const { dailyRouter }        = require('../apps/backend/src/routes/daily');
  const { weaknessRouter }     = require('../apps/backend/src/routes/weakness');
  const { analyticsRouter }    = require('../apps/backend/src/routes/analytics');
  const { donateRouter }       = require('../apps/backend/src/routes/donate');
  const { settingsRouter }     = require('../apps/backend/src/routes/settings');
  const { notificationsRouter } = require('../apps/backend/src/routes/notifications');
  const { errorHandler }       = require('../apps/backend/src/middleware/errorHandler');
  const { requireAuth }        = require('../apps/backend/src/middleware/requireAuth');
  const { requireAdmin }       = require('../apps/backend/src/middleware/requireAdmin');
  const { authLimiter, apiLimiter } = require('../apps/backend/src/middleware/rateLimiter');

  app.use('/api/auth',         authLimiter, authRouter);
  app.use('/api/user',         apiLimiter, userRouter);
  app.use('/api/progress',     apiLimiter, progressRouter);
  app.use('/api/achievements', apiLimiter, achievementsRouter);
  app.use('/api/leaderboard',  apiLimiter, leaderboardRouter);
  app.use('/api/challenges',   apiLimiter, challengesRouter);
  app.use('/api/admin',        requireAuth, requireAdmin, adminRouter);
  app.use('/api/letters',      letterRouter);
  app.use('/api/daily',        dailyRouter);
  app.use('/api/weakness',     weaknessRouter);
  app.use('/api/analytics',    analyticsRouter);
  app.use('/api/donate',       donateRouter);
  app.use('/api/settings',     settingsRouter);
  app.use('/api/notifications', notificationsRouter);
  app.use(errorHandler);
} catch (err) {
  app.use('/api', (_req, res) => {
    res.status(500).json({ error: 'Failed to load routes', details: String(err) });
  });
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Vercel handler wrapper
export default function handler(req: VercelRequest, res: VercelResponse) {
  // Ensure body is available to Express
  if (req.body && typeof req.body === 'object') {
    (req as any)._body = true;  // Tell express.json() body is already parsed
  }
  return app(req as any, res as any);
}
