// @ts-nocheck
import 'tsconfig-paths/register';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// Set paths for tsconfig-paths
process.env.TS_NODE_BASEURL = __dirname + '/..';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ strict: false }));
app.use(cookieParser());

// Lazy load routes to catch import errors
try {
  const { authRouter }         = require('../apps/backend/src/routes/auth');
  const { userRouter }         = require('../apps/backend/src/routes/user');
  const { progressRouter }     = require('../apps/backend/src/routes/progress');
  const { achievementsRouter } = require('../apps/backend/src/routes/achievements');
  const { leaderboardRouter }  = require('../apps/backend/src/routes/leaderboard');
  const { challengesRouter }   = require('../apps/backend/src/routes/challenges');
  const { errorHandler }       = require('../apps/backend/src/middleware/errorHandler');

  app.use('/api/auth',         authRouter);
  app.use('/api/user',         userRouter);
  app.use('/api/progress',     progressRouter);
  app.use('/api/achievements', achievementsRouter);
  app.use('/api/leaderboard',  leaderboardRouter);
  app.use('/api/challenges',   challengesRouter);
  app.use(errorHandler);
} catch (err) {
  app.use('/api', (_req, res) => {
    res.status(500).json({ error: 'Failed to load routes', details: String(err) });
  });
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

export default app;
