import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock prisma before importing the service
vi.mock('../lib/prisma', () => ({
  prisma: {
    achievement: {
      findMany: vi.fn(),
    },
    userAchievement: {
      findMany: vi.fn(),
      create:   vi.fn(),
    },
    letterProgress: {
      count: vi.fn(),
    },
    studySession: {
      aggregate: vi.fn(),
    },
  },
}));

import { checkAndUnlockAchievements } from '../services/achievements';

describe('checkAndUnlockAchievements', () => {
  const { prisma } = require('../lib/prisma');

  const baseCtx = {
    mode:        'flashcard',
    score:       0,
    totalQ:      28,
    durationSec: 200,
    streak:      { current: 1 },
    hour:        12,
  };

  const mockAchievements = [
    {
      id: 'ach-1', key: 'first_letter',
      nameRu: 'Первый шаг', nameUz: 'Birinchi', nameEn: 'First Step',
      descRu: '...',        descUz: '...',       descEn: '...',
      icon: '🌱',
      condition: { type: 'letters_known', value: 1 },
    },
    {
      id: 'ach-2', key: 'perfect_quiz',
      nameRu: 'Идеальный', nameUz: 'Mukammal', nameEn: 'Perfect',
      descRu: '...',        descUz: '...',      descEn: '...',
      icon: '💯',
      condition: { type: 'perfect_session', mode: 'quiz' },
    },
    {
      id: 'ach-3', key: 'streak_3',
      nameRu: '3 дня', nameUz: '3 kun', nameEn: '3 days',
      descRu: '...',    descUz: '...',   descEn: '...',
      icon: '🔥',
      condition: { type: 'streak', value: 3 },
    },
    {
      id: 'ach-4', key: 'speed_3min',
      nameRu: 'Скоростной', nameUz: 'Tezkor', nameEn: 'Speedster',
      descRu: '...',         descUz: '...',    descEn: '...',
      icon: '⚡',
      condition: { type: 'session_speed', mode: 'flashcard', maxSec: 180, minScore: 28 },
    },
    {
      id: 'ach-5', key: 'night_owl',
      nameRu: 'Ночная сова', nameUz: 'Tungi boyqush', nameEn: 'Night Owl',
      descRu: '...',          descUz: '...',           descEn: '...',
      icon: '🦉',
      condition: { type: 'time_of_day', after: 23 },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    prisma.achievement.findMany.mockResolvedValue(mockAchievements);
    prisma.userAchievement.findMany.mockResolvedValue([]);
    prisma.letterProgress.count.mockResolvedValue(0);
    prisma.studySession.aggregate.mockResolvedValue({ _sum: { score: 0 } });
    prisma.userAchievement.create.mockResolvedValue({});
  });

  it('unlocks first_letter when 1 letter known', async () => {
    prisma.letterProgress.count.mockResolvedValue(1);
    const result = await checkAndUnlockAchievements('user-1', baseCtx);
    expect(result.some(a => a.key === 'first_letter')).toBe(true);
  });

  it('does not unlock first_letter when 0 letters known', async () => {
    prisma.letterProgress.count.mockResolvedValue(0);
    const result = await checkAndUnlockAchievements('user-1', baseCtx);
    expect(result.some(a => a.key === 'first_letter')).toBe(false);
  });

  it('unlocks perfect_quiz for perfect quiz session', async () => {
    const ctx = { ...baseCtx, mode: 'quiz', score: 12, totalQ: 12 };
    const result = await checkAndUnlockAchievements('user-1', ctx);
    expect(result.some(a => a.key === 'perfect_quiz')).toBe(true);
  });

  it('does not unlock perfect_quiz for imperfect session', async () => {
    const ctx = { ...baseCtx, mode: 'quiz', score: 10, totalQ: 12 };
    const result = await checkAndUnlockAchievements('user-1', ctx);
    expect(result.some(a => a.key === 'perfect_quiz')).toBe(false);
  });

  it('unlocks streak_3 when streak reaches 3', async () => {
    const ctx = { ...baseCtx, streak: { current: 3 } };
    const result = await checkAndUnlockAchievements('user-1', ctx);
    expect(result.some(a => a.key === 'streak_3')).toBe(true);
  });

  it('unlocks speed_3min when session is fast enough', async () => {
    const ctx = { ...baseCtx, score: 28, totalQ: 28, durationSec: 150 };
    const result = await checkAndUnlockAchievements('user-1', ctx);
    expect(result.some(a => a.key === 'speed_3min')).toBe(true);
  });

  it('does not unlock speed_3min when too slow', async () => {
    const ctx = { ...baseCtx, score: 28, totalQ: 28, durationSec: 250 };
    const result = await checkAndUnlockAchievements('user-1', ctx);
    expect(result.some(a => a.key === 'speed_3min')).toBe(false);
  });

  it('unlocks night_owl at hour 23', async () => {
    const ctx = { ...baseCtx, hour: 23 };
    const result = await checkAndUnlockAchievements('user-1', ctx);
    expect(result.some(a => a.key === 'night_owl')).toBe(true);
  });

  it('does not unlock already-unlocked achievements', async () => {
    prisma.letterProgress.count.mockResolvedValue(5);
    prisma.userAchievement.findMany.mockResolvedValue([{ achievementId: 'ach-1' }]);
    const result = await checkAndUnlockAchievements('user-1', { ...baseCtx });
    expect(result.some(a => a.key === 'first_letter')).toBe(false);
  });

  it('returns empty array when nothing is earned', async () => {
    const result = await checkAndUnlockAchievements('user-1', baseCtx);
    expect(result).toHaveLength(0);
  });
});
