import { prisma } from '../lib/prisma';

// XP rewards
const XP_REWARDS = {
  session_complete: 10,
  perfect_session: 25,
  daily_lesson_complete: 50,
  streak_bonus: 5, // per streak day
  challenge_win: 30,
  achievement_unlock: 20,
  first_letter: 15,
  review_complete: 10,
};

// Level thresholds: level N requires totalXP >= threshold[N]
function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function calculateLevel(totalXp: number): { level: number; currentXp: number; nextLevelXp: number } {
  let level = 1;
  let accumulated = 0;
  while (true) {
    const needed = xpForLevel(level);
    if (accumulated + needed > totalXp) {
      return { level, currentXp: totalXp - accumulated, nextLevelXp: needed };
    }
    accumulated += needed;
    level++;
    if (level > 100) break; // safety cap
  }
  return { level: 100, currentXp: 0, nextLevelXp: 0 };
}

export async function awardXp(userId: string, reason: keyof typeof XP_REWARDS, multiplier = 1): Promise<{ newXp: number; newLevel: number; leveledUp: boolean }> {
  const amount = Math.round(XP_REWARDS[reason] * multiplier);
  const user = await prisma.user.update({
    where: { id: userId },
    data: { xp: { increment: amount } },
  });
  const { level } = calculateLevel(user.xp);
  const leveledUp = level > user.xpLevel;
  if (leveledUp) {
    await prisma.user.update({ where: { id: userId }, data: { xpLevel: level } });
  }
  // Log analytics
  await prisma.analyticsEvent.create({
    data: { userId, event: 'xp_earned', data: JSON.stringify({ reason, amount, total: user.xp, level }) },
  }).catch(() => {});
  return { newXp: user.xp, newLevel: level, leveledUp };
}

export { XP_REWARDS };
