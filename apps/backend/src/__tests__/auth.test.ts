/**
 * Integration tests for /api/auth
 * Run with: pnpm --filter=backend test
 *
 * Requires: TEST_DATABASE_URL set to a test postgres instance
 * or the tests will mock prisma automatically.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { authRouter } from '../routes/auth';
import { errorHandler } from '../middleware/errorHandler';

// ── Mock Prisma ───────────────────────────────────────────────────────────────
vi.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique:          vi.fn(),
      findUniqueOrThrow:   vi.fn(),
      create:              vi.fn(),
      update:              vi.fn(),
    },
    letterProgress: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    streak: {
      findUnique: vi.fn().mockResolvedValue(null),
    },
  },
}));

vi.mock('../lib/redis', () => ({
  redis: {
    get:    vi.fn().mockResolvedValue(null),
    setex:  vi.fn().mockResolvedValue('OK'),
  },
}));

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use(errorHandler);

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('POST /api/auth/register', () => {
  const { prisma } = require('../lib/prisma');

  beforeEach(() => vi.clearAllMocks());

  it('returns 400 for invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'not-an-email', name: 'Test', password: '12345678' });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('returns 400 for short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', name: 'Test', password: '1234' });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('returns 400 if email already taken', async () => {
    prisma.user.findUnique.mockResolvedValueOnce({ id: '1', email: 'test@example.com' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', name: 'Test', password: '12345678' });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('EMAIL_TAKEN');
  });

  it('returns 201 with tokens on success', async () => {
    prisma.user.findUnique.mockResolvedValueOnce(null); // no existing user
    prisma.user.create.mockResolvedValueOnce({
      id: 'user-1', email: 'new@example.com', name: 'New User',
      avatar: null, language: 'ru', createdAt: new Date(),
    });
    prisma.user.findUniqueOrThrow.mockResolvedValueOnce({
      id: 'user-1', email: 'new@example.com', name: 'New User',
      avatar: null, language: 'ru', createdAt: new Date(),
      streak: null, progress: [],
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'new@example.com', name: 'New User', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe('new@example.com');
  });
});

describe('POST /api/auth/login', () => {
  const { prisma } = require('../lib/prisma');
  const bcrypt = require('bcryptjs');

  beforeEach(() => vi.clearAllMocks());

  it('returns 401 for wrong credentials', async () => {
    prisma.user.findUnique.mockResolvedValueOnce(null);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'password123' });
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });

  it('returns 200 with tokens for valid credentials', async () => {
    const hash = await bcrypt.hash('correctpassword', 12);
    prisma.user.findUnique.mockResolvedValueOnce({
      id: 'user-1', email: 'user@example.com',
      passwordHash: hash, name: 'User',
    });
    prisma.user.findUniqueOrThrow.mockResolvedValueOnce({
      id: 'user-1', email: 'user@example.com', name: 'User',
      avatar: null, language: 'ru', createdAt: new Date(),
      streak: null, progress: [],
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'correctpassword' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });
});

describe('Validation', () => {
  it('returns 400 for missing body fields', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });
});
