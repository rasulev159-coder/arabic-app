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
  const [allAchievements, userAchievements, knownCount, lightningTotal, totalSessions, challengeWins, perfectQuizCount] = await Promise.all([
    prisma.achievement.findMany(),
    prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true } }),
    prisma.letterProgress.count({ where: { userId, known: true } }),
    prisma.studySession.aggregate({ where: { userId, mode: 'lightning' }, _sum: { score: true } }),
    prisma.studySession.count({ where: { userId } }),
    prisma.$queryRawUnsafe<[{ count: bigint }]>(
      `SELECT COUNT(*) as count FROM challenges
       WHERE status = 'completed' AND (
         ("challengerId" = $1 AND "challengerScore" > "opponentScore") OR
         ("opponentId" = $1 AND "opponentScore" > "challengerScore")
       )`,
      userId,
    ),
    prisma.$queryRawUnsafe<[{ count: bigint }]>(
      `SELECT COUNT(*) as count FROM study_sessions WHERE "userId" = $1 AND mode = 'quiz' AND score = "totalQ" AND "totalQ" > 0`,
      userId,
    ),
  ]);

  const unlocked = new Set(userAchievements.map(a => a.achievementId));
  const newlyUnlocked: AchievementDto[] = [];
  const winCount = Number(challengeWins[0]?.count ?? 0);
  const perfectQuizzes = Number(perfectQuizCount[0]?.count ?? 0);

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
      case 'perfect_count':
        earned = cond.mode === ctx.mode && perfectQuizzes >= Number(cond.value);
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
      case 'challenge_win':
        earned = winCount >= Number(cond.value);
        break;
      case 'time_of_day':
        if (cond.after !== undefined) earned = ctx.hour >= Number(cond.after);
        if (cond.before !== undefined) earned = ctx.hour < Number(cond.before);
        break;
      case 'total_sessions':
        earned = totalSessions >= Number(cond.value);
        break;
      case 'textbook_chapters':
        // Tracked on frontend, cannot check here
        break;
    }

    if (earned) {
      await prisma.userAchievement.create({ data: { userId, achievementId: ach.id } });
      unlocked.add(ach.id);
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

  // Check for near-completion notifications (>=80% progress)
  await checkNearCompletionNotifications(userId, allAchievements, unlocked, {
    knownCount,
    streak: ctx.streak.current,
    lightningTotal: lightningTotal._sum.score ?? 0,
    totalSessions,
    winCount,
    perfectQuizzes,
  });

  return newlyUnlocked;
}

interface ProgressContext {
  knownCount: number;
  streak: number;
  lightningTotal: number;
  totalSessions: number;
  winCount: number;
  perfectQuizzes: number;
}

async function checkNearCompletionNotifications(
  userId: string,
  allAchievements: any[],
  unlockedIds: Set<string>,
  pCtx: ProgressContext,
) {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Get recent notifications to avoid spamming
  const recentNotifs = await prisma.notificationLog.findMany({
    where: {
      userId,
      template: 'achievement_near',
      sentAt: { gte: oneDayAgo },
    },
    select: { id: true, type: true },
  });

  // If notified in last 24h, skip
  if (recentNotifs.length > 0) return;

  for (const ach of allAchievements) {
    if (unlockedIds.has(ach.id)) continue;

    const cond = ach.condition as Record<string, unknown>;
    let current = 0;
    let target = 1;

    switch (cond.type) {
      case 'letters_known':
        target = Number(cond.value);
        current = pCtx.knownCount;
        break;
      case 'streak':
        target = Number(cond.value);
        current = pCtx.streak;
        break;
      case 'total_correct_mode':
        target = Number(cond.value);
        current = pCtx.lightningTotal;
        break;
      case 'total_sessions':
        target = Number(cond.value);
        current = pCtx.totalSessions;
        break;
      case 'challenge_win':
        target = Number(cond.value);
        current = pCtx.winCount;
        break;
      case 'perfect_count':
        target = Number(cond.value);
        current = pCtx.perfectQuizzes;
        break;
      default:
        continue; // skip types we can't easily calculate progress for
    }

    const percentage = target > 0 ? (current / target) * 100 : 0;

    if (percentage >= 80 && percentage < 100) {
      const remaining = target - current;
      const message = `${current}/${target} ${ach.nameUz} — yana ${remaining} ta va yutuq sizniki! 🏆`;

      await prisma.notificationLog.create({
        data: {
          userId,
          type: 'push',
          template: 'achievement_near',
        },
      });

      // Log the message for debugging
      console.log(`[achievement_near] userId=${userId}: ${message}`);
      return; // Only one notification per session
    }
  }
}
