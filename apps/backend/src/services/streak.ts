import { prisma } from '../lib/prisma';

export async function updateStreak(userId: string): Promise<{ current: number; longest: number }> {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const streak = await prisma.streak.findUnique({ where: { userId } });

  if (!streak) {
    const created = await prisma.streak.create({
      data: { userId, current: 1, longest: 1, lastActivity: now },
    });
    return { current: created.current, longest: created.longest };
  }

  const last     = new Date(streak.lastActivity);
  const lastDay  = new Date(last.getFullYear(), last.getMonth(), last.getDate());
  const diffDays = Math.round((today.getTime() - lastDay.getTime()) / 86400_000);

  let newCurrent = streak.current;
  if (diffDays === 0) {
    // Already logged today — no change
    return { current: streak.current, longest: streak.longest };
  } else if (diffDays === 1) {
    newCurrent = streak.current + 1;
  } else {
    newCurrent = 1; // streak broken
  }

  const newLongest = Math.max(newCurrent, streak.longest);
  const updated = await prisma.streak.update({
    where: { userId },
    data: { current: newCurrent, longest: newLongest, lastActivity: now },
  });

  return { current: updated.current, longest: updated.longest };
}
