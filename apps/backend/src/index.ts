import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

import { validateEnv }        from './lib/env';
validateEnv(); // ← fail fast if env is misconfigured

import { authRouter }         from './routes/auth';
import { userRouter }         from './routes/user';
import { progressRouter }     from './routes/progress';
import { achievementsRouter } from './routes/achievements';
import { leaderboardRouter }  from './routes/leaderboard';
import { challengesRouter }   from './routes/challenges';
import { adminRouter }        from './routes/admin';
import { letterRouter }       from './routes/letters';
import { dailyRouter }        from './routes/daily';
import { weaknessRouter }     from './routes/weakness';
import { analyticsRouter }    from './routes/analytics';
import { errorHandler }       from './middleware/errorHandler';
import { authLimiter, apiLimiter } from './middleware/rateLimiter';
import { requireAuth }        from './middleware/requireAuth';
import { requireAdmin }       from './middleware/requireAdmin';
import { setupWs }            from './lib/ws';

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',         authLimiter,  authRouter);
app.use('/api/user',         apiLimiter,   userRouter);
app.use('/api/progress',     apiLimiter,   progressRouter);
app.use('/api/achievements', apiLimiter,   achievementsRouter);
app.use('/api/leaderboard',  apiLimiter,   leaderboardRouter);
app.use('/api/challenges',   apiLimiter,   challengesRouter);
app.use('/api/admin',        apiLimiter,   requireAuth, requireAdmin, adminRouter);
app.use('/api/letters',      apiLimiter,   letterRouter);
app.use('/api/daily',        apiLimiter,   dailyRouter);
app.use('/api/weakness',     apiLimiter,   weaknessRouter);
app.use('/api/analytics',    apiLimiter,   analyticsRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// ── WebSocket ────────────────────────────────────────────────────────────────
setupWs(wss);

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT ?? 4000);
const server = httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket ready`);
  console.log(`🌍 ENV: ${process.env.NODE_ENV ?? 'development'}`);
});

// ── Graceful Shutdown ─────────────────────────────────────────────────────────
async function shutdown(signal: string) {
  console.log(`\n🛑 ${signal} received — shutting down gracefully...`);
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('⚠️  Forced shutdown after timeout');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
