import { Router, Request, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { prisma } from '../lib/prisma';
import { PLANS, PlanType } from '../config/subscription';
import { generateOrderId, deactivateExpiredSubscriptions } from '../services/subscription';
import { handlePaymeRequest } from '../services/payme';
import { handleClickPrepare, handleClickComplete } from '../services/click';

export const subscriptionRouter: Router = Router();

// ENV vars (set in .env):
// PAYME_MERCHANT_ID, PAYME_SECRET_KEY, PAYME_CHECKOUT_URL
// CLICK_MERCHANT_ID, CLICK_SERVICE_ID, CLICK_SECRET_KEY
// APP_URL (for callback URLs, e.g. https://arabic-app-ruddy.vercel.app)

// ── GET /api/subscription ──────────────────────────────────────────────────
// Current plan status, prices, payment history
subscriptionRouter.get('/subscription', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) { res.status(401).json({ ok: false, error: 'Unauthorized' }); return; }

  let plan = user.plan;
  if (plan === 'pro' && user.planExpiresAt && user.planExpiresAt < new Date()) {
    plan = 'free';
  }

  const today = new Date().toISOString().slice(0, 10);
  const lastDate = user.lastAiRequestDate?.toISOString().slice(0, 10);
  const dailyUsed = lastDate === today ? user.dailyAiRequests : 0;

  const daysLeft = plan === 'pro' && user.planExpiresAt
    ? Math.max(0, Math.ceil((user.planExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const payments = await prisma.payment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      amount: true,
      currency: true,
      provider: true,
      status: true,
      planType: true,
      createdAt: true,
      completedAt: true,
    },
  });

  res.json({
    ok: true,
    data: {
      plan,
      planExpiresAt: user.planExpiresAt,
      daysLeft,
      dailyUsed,
      dailyLimit: plan === 'free' ? 10 : null,
      prices: {
        monthly: PLANS.monthly.price,
        yearly: PLANS.yearly.price,
      },
      payments,
    },
  });
});

// ── POST /api/subscription/create ──────────────────────────────────────────
// Create payment and return redirect URL
subscriptionRouter.post('/subscription/create', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const { planType, provider } = req.body as { planType?: string; provider?: string };

  if (!planType || !['monthly', 'yearly'].includes(planType)) {
    res.status(400).json({ ok: false, error: 'Invalid planType. Use "monthly" or "yearly".' });
    return;
  }
  if (!provider || !['payme', 'click'].includes(provider)) {
    res.status(400).json({ ok: false, error: 'Invalid provider. Use "payme" or "click".' });
    return;
  }

  const plan = PLANS[planType as PlanType];
  const amount = plan.price.UZS;
  const orderId = generateOrderId();
  const appUrl = process.env.APP_URL || 'https://arabic-app-ruddy.vercel.app';
  const callbackUrl = `${appUrl}/pro?payment=success`;

  // Create payment record
  await prisma.payment.create({
    data: {
      userId: req.userId!,
      amount,
      currency: 'UZS',
      provider,
      status: 'pending',
      planDays: plan.days,
      planType,
      orderId,
    },
  });

  let redirectUrl: string;

  if (provider === 'payme') {
    const merchantId = process.env.PAYME_MERCHANT_ID || '';
    const checkoutUrl = process.env.PAYME_CHECKOUT_URL || 'https://checkout.paycom.uz';
    const amountInTiyin = amount * 100;

    // Payme checkout URL format: base64(m=MERCHANT_ID;ac.order_id=XXX;a=AMOUNT_IN_TIYIN;c=CALLBACK_URL)
    const params = `m=${merchantId};ac.order_id=${orderId};a=${amountInTiyin};c=${encodeURIComponent(callbackUrl)}`;
    const encoded = Buffer.from(params).toString('base64');
    redirectUrl = `${checkoutUrl}/${encoded}`;
  } else {
    // Click
    const serviceId = process.env.CLICK_SERVICE_ID || '';
    const merchantId = process.env.CLICK_MERCHANT_ID || '';
    redirectUrl = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${amount}&transaction_param=${orderId}&return_url=${encodeURIComponent(callbackUrl)}`;
  }

  res.json({
    ok: true,
    data: { orderId, redirectUrl },
  });
});

// ── POST /api/payments/payme/webhook ───────────────────────────────────────
// Payme JSON-RPC webhook (NO auth middleware - called by Payme)
subscriptionRouter.post('/payments/payme/webhook', async (req: Request, res: Response): Promise<void> => {
  const result = await handlePaymeRequest(req.body, req.headers.authorization);
  res.json(result);
});

// ── POST /api/payments/click/prepare ───────────────────────────────────────
// Click prepare endpoint (NO auth middleware - called by Click)
subscriptionRouter.post('/payments/click/prepare', async (req: Request, res: Response): Promise<void> => {
  const result = await handleClickPrepare(req.body);
  res.json(result);
});

// ── POST /api/payments/click/complete ──────────────────────────────────────
// Click complete endpoint (NO auth middleware - called by Click)
subscriptionRouter.post('/payments/click/complete', async (req: Request, res: Response): Promise<void> => {
  const result = await handleClickComplete(req.body);
  res.json(result);
});

// ── GET /api/cron/check-subscriptions ──────────────────────────────────────
// Deactivate expired subscriptions (called by cron or Vercel cron)
subscriptionRouter.get('/cron/check-subscriptions', async (_req: Request, res: Response): Promise<void> => {
  const count = await deactivateExpiredSubscriptions();
  res.json({ ok: true, data: { deactivated: count } });
});
