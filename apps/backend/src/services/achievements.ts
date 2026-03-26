import { prisma } from '../lib/prisma';
import { AchievementDto } from '@arabic/shared';

interface CheckContext {
  mode:        string;
  score:       number;
  totalQ:      number;
  durationSec: number;
  streak:      { current: number };
  hour:        number;
}

export async function checkAndUnlockAchievements(
  userId: string,
  ctx: CheckContext,
): Promise<AchievementDto[]> {
  const [allAchievements, userAchievements, knownCount, lightningTotal] = await Promise.all([
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true } }),
    prisma.letterProgress.count({ where: { userId, known: true } }),
    prisma.studySession.aggregate({ where: { userId, mode: 'lightning' }, _sum: { score: true } }),
  ]);

  const unlocked = new Set(userAchievements.map(a => a.achievementId));
  const newlyUnlocked: AchievementDto[] = [];

  for (const ach of allAchievements) {
    if (unlocked.has(ach.id)) continue;

    const cond = ach.condition as Record<string, unknown>;
    let earned = false;

    switch (cond.type) {
      case 'letters_known':
        earned = knownCount >= Number(cond.value);
        break;
      case 'streak':
        earned = ctx.streak.current >= Number(cond.value);
        break;
      case 'perfect_session':
        earned = cond.mode === ctx.mode && ctx.score === ctx.totalQ && ctx.totalQ > 0;
        break;
      case 'session_speed':
        earned = cond.mode === ctx.mode
          && ctx.durationSec <= Number(cond.maxSec)
          && ctx.score >= Number(cond.minScore);
        break;
      case 'total_correct_mode':
        earned = cond.mode === ctx.mode
          && (lightningTotal._sum.score ?? 0) >= Number(cond.value);
        break;
      case 'time_of_day':
        if (cond.after !== undefined) earned = ctx.hour >= Number(cond.after);
        if (cond.before !== undefined) earned = ctx.hour < Number(cond.before);
        break;
    }

    if (earned) {
      await prisma.userAchievement.create({ data: { userId, achievementId: ach.id } });
      newlyUnlocked.push({
        id:         ach.id,
        key:        ach.key as any,
        nameRu:     ach.nameRu,
        nameUz:     ach.nameUz,
        nameEn:     ach.nameEn,
        descRu:     ach.descRu,
        descUz:     ach.descUz,
        descEn:     ach.descEn,
        icon:       ach.icon,
        unlockedAt: new Date().toISOString(),
      });
    }
  }

  return newlyUnlocked;
}
