import { prisma } from '../lib/prisma';
import { PLANS, PlanType } from '../config/subscription';
import crypto from 'crypto';

/**
 * Activate subscription for user. If already pro, extends from current expiry.
 */
export async function activateSubscription(userId: string, planType: PlanType) {
  const plan = PLANS[planType];
  if (!plan) throw new Error(`Unknown plan: ${planType}`);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error(`User not found: ${userId}`);

  const now = new Date();
  let baseDate = now;

  // If user is already pro and subscription hasn't expired, extend from expiry date
  if (user.plan === 'pro' && user.planExpiresAt && user.planExpiresAt > now) {
    baseDate = user.planExpiresAt;
  }

  const expiresAt = new Date(baseDate);
  expiresAt.setDate(expiresAt.getDate() + plan.days);

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: 'pro',
      planExpiresAt: expiresAt,
    },
  });

  return { plan: 'pro', planExpiresAt: expiresAt };
}

/**
 * Deactivate all expired pro subscriptions.
 */
export async function deactivateExpiredSubscriptions() {
  const result = await prisma.user.updateMany({
    where: {
      plan: 'pro',
      planExpiresAt: { lt: new Date() },
    },
    data: { plan: 'free' },
  });
  return result.count;
}

/**
 * Generate unique order ID: ORD-YYYYMMDD-xxxx
 */
export function generateOrderId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = crypto.randomBytes(4).toString('hex');
  return `ORD-${date}-${rand}`;
}
