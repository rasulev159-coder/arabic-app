import { prisma } from '../lib/prisma';
import { NOTIFICATION_TEMPLATES, NotificationTemplate } from '../data/notifications';

// Determine which template to send based on days since last activity
export function getTemplateForUser(lastActivity: Date | null): NotificationTemplate | null {
  if (!lastActivity) return NOTIFICATION_TEMPLATES.find(t => t.daysMissed === 7) || null;

  const now = new Date();
  const diffMs = now.getTime() - lastActivity.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Find matching template (exact match or closest lower)
  const sorted = [...NOTIFICATION_TEMPLATES].sort((a, b) => b.daysMissed - a.daysMissed);
  for (const t of sorted) {
    if (diffDays >= t.daysMissed) return t;
  }
  return null;
}

export function renderTemplate(template: NotificationTemplate, lang: string, data: Record<string, any>): { title: string; body: string } {
  let title = lang === 'ru' ? template.titleRu : lang === 'en' ? template.titleEn : template.titleUz;
  let body = lang === 'ru' ? template.bodyRu : lang === 'en' ? template.bodyEn : template.bodyUz;

  for (const [key, value] of Object.entries(data)) {
    title = title.replace(`{{${key}}}`, String(value));
    body = body.replace(`{{${key}}}`, String(value));
  }

  return { title, body };
}

// Check and send notifications for all inactive users
export async function processNotifications() {
  const users = await prisma.user.findMany({
    include: { streak: true, progress: { where: { known: true } } },
  });

  const results: { userId: string; template: string; sent: boolean }[] = [];

  for (const user of users) {
    const lastActivity = user.streak?.lastActivity || user.updatedAt;
    const template = getTemplateForUser(lastActivity);

    if (!template) continue;

    // Check if we already sent this template to this user recently (within daysMissed period)
    const recentNotification = await prisma.notificationLog.findFirst({
      where: {
        userId: user.id,
        template: template.key,
        sentAt: { gte: new Date(Date.now() - Math.max(template.daysMissed, 1) * 24 * 60 * 60 * 1000) },
      },
    });

    if (recentNotification) continue; // already notified

    const knownCount = user.progress.length;
    const { title, body } = renderTemplate(template, user.language, { knownCount });

    // Send push notification if subscription exists
    if (user.pushSubscription) {
      try {
        // We'll use the web-push library if available, otherwise just log
        console.log(`[PUSH] ${user.email}: ${title}`);
        await prisma.notificationLog.create({
          data: { userId: user.id, type: 'push', template: template.key },
        });
        results.push({ userId: user.id, template: template.key, sent: true });
      } catch (e) {
        console.error(`Push failed for ${user.email}:`, e);
      }
    }

    // Log email notification (actual sending would require email service)
    console.log(`[EMAIL] ${user.email}: ${title} — ${body}`);
    await prisma.notificationLog.create({
      data: { userId: user.id, type: 'email', template: template.key },
    });
    results.push({ userId: user.id, template: template.key, sent: true });
  }

  return results;
}
