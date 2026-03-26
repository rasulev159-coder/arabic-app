import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateStreak } from '../services/streak';

vi.mock('../lib/prisma', () => ({
  prisma: {
    streak: {
      findUnique: vi.fn(),
      create:     vi.fn(),
      update:     vi.fn(),
    },
  },
}));

describe('updateStreak', () => {
  const { prisma } = require('../lib/prisma');

  beforeEach(() => vi.clearAllMocks());

  it('creates streak with current=1 for new user', async () => {
    prisma.streak.findUnique.mockResolvedValueOnce(null);
    prisma.streak.create.mockResolvedValueOnce({ current: 1, longest: 1 });

    const result = await updateStreak('user-1');
    expect(result.current).toBe(1);
    expect(prisma.streak.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ current: 1 }) })
    );
  });

  it('does not increment streak if already active today', async () => {
    const today = new Date();
    prisma.streak.findUnique.mockResolvedValueOnce({
      userId: 'user-1', current: 5, longest: 7, lastActivity: today,
    });

    const result = await updateStreak('user-1');
    expect(result.current).toBe(5);
    expect(prisma.streak.update).not.toHaveBeenCalled();
  });

  it('increments streak by 1 if last activity was yesterday', async () => {
    const yesterday = new Date(Date.now() - 86_400_000);
    prisma.streak.findUnique.mockResolvedValueOnce({
      userId: 'user-1', current: 3, longest: 7, lastActivity: yesterday,
    });
    prisma.streak.update.mockResolvedValueOnce({ current: 4, longest: 7 });

    const result = await updateStreak('user-1');
    expect(result.current).toBe(4);
    expect(prisma.streak.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ current: 4 }) })
    );
  });

  it('resets streak to 1 if more than 1 day missed', async () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 86_400_000);
    prisma.streak.findUnique.mockResolvedValueOnce({
      userId: 'user-1', current: 10, longest: 10, lastActivity: threeDaysAgo,
    });
    prisma.streak.update.mockResolvedValueOnce({ current: 1, longest: 10 });

    const result = await updateStreak('user-1');
    expect(result.current).toBe(1);
    expect(prisma.streak.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ current: 1 }) })
    );
  });

  it('updates longest if new current exceeds it', async () => {
    const yesterday = new Date(Date.now() - 86_400_000);
    prisma.streak.findUnique.mockResolvedValueOnce({
      userId: 'user-1', current: 9, longest: 9, lastActivity: yesterday,
    });
    prisma.streak.update.mockResolvedValueOnce({ current: 10, longest: 10 });

    const result = await updateStreak('user-1');
    expect(result.longest).toBe(10);
  });
});
