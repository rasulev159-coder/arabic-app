// @ts-nocheck
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

import { authRouter }         from '../apps/backend/src/routes/auth';
import { userRouter }         from '../apps/backend/src/routes/user';
import { progressRouter }     from '../apps/backend/src/routes/progress';
import { achievementsRouter } from '../apps/backend/src/routes/achievements';
import { leaderboardRouter }  from '../apps/backend/src/routes/leaderboard';
import { challengesRouter }   from '../apps/backend/src/routes/challenges';
import { errorHandler }       from '../apps/backend/src/middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',         authRouter);
app.use('/api/user',         userRouter);
app.use('/api/progress',     progressRouter);
app.use('/api/achievements', achievementsRouter);
app.use('/api/leaderboard',  leaderboardRouter);
app.use('/api/challenges',   challengesRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use(errorHandler);

export default app;
