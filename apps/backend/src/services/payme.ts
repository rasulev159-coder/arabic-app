import { prisma } from '../lib/prisma';
import { activateSubscription } from './subscription';
import { PLANS, PlanType } from '../config/subscription';

// Payme amounts are in TIYIN: 1 sum = 100 tiyin
const SUM_TO_TIYIN = 100;

// Payme error codes
const ERRORS = {
  WRONG_AMOUNT:   { code: -31001, message: { ru: 'Неверная сумма', uz: 'Noto\'g\'ri summa', en: 'Wrong amount' } },
  ORDER_NOT_FOUND:{ code: -31050, message: { ru: 'Заказ не найден', uz: 'Buyurtma topilmadi', en: 'Order not found' } },
  ALREADY_PAID:   { code: -31051, message: { ru: 'Уже оплачен', uz: 'Allaqachon to\'langan', en: 'Already paid' } },
  CANNOT_PERFORM: { code: -31008, message: { ru: 'Невозможно выполнить', uz: 'Bajarib bo\'lmaydi', en: 'Cannot perform' } },
  AUTH_ERROR:     { code: -32504, message: { ru: 'Ошибка авторизации', uz: 'Avtorizatsiya xatosi', en: 'Auth error' } },
  METHOD_NOT_FOUND:{ code: -32601, message: { ru: 'Метод не найден', uz: 'Metod topilmadi', en: 'Method not found' } },
};

function paymeError(id: string | number | null, error: typeof ERRORS[keyof typeof ERRORS]) {
  return {
    jsonrpc: '2.0',
    id,
    error: { code: error.code, message: error.message },
  };
}

function paymeResult(id: string | number | null, result: Record<string, any>) {
  return {
    jsonrpc: '2.0',
    id,
    result,
  };
}

/**
 * Verify Basic auth header against PAYME_SECRET_KEY
 */
export function verifyPaymeAuth(authHeader: string | undefined): boolean {
  if (!authHeader?.startsWith('Basic ')) return false;
  const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf-8');
  // Payme sends "Paycom:<SECRET_KEY>"
  const [, secret] = decoded.split(':');
  return secret === process.env.PAYME_SECRET_KEY;
}

/**
 * Handle Payme JSON-RPC request
 */
export async function handlePaymeRequest(body: any, authHeader: string | undefined) {
  const { id, method, params } = body;

  // Auth check (except for CheckPerformTransaction in some configs)
  if (!verifyPaymeAuth(authHeader)) {
    return paymeError(id, ERRORS.AUTH_ERROR);
  }

  switch (method) {
    case 'CheckPerformTransaction':
      return checkPerformTransaction(id, params);
    case 'CreateTransaction':
      return createTransaction(id, params);
    case 'PerformTransaction':
      return performTransaction(id, params);
    case 'CancelTransaction':
      return cancelTransaction(id, params);
    case 'CheckTransaction':
      return checkTransaction(id, params);
    case 'GetStatement':
      return getStatement(id, params);
    default:
      return paymeError(id, ERRORS.METHOD_NOT_FOUND);
  }
}

async function checkPerformTransaction(id: any, params: any) {
  const orderId = params?.account?.order_id;
  if (!orderId) return paymeError(id, ERRORS.ORDER_NOT_FOUND);

  const payment = await prisma.payment.findUnique({ where: { orderId } });
  if (!payment) return paymeError(id, ERRORS.ORDER_NOT_FOUND);
  if (payment.status === 'paid') return paymeError(id, ERRORS.ALREADY_PAID);
  if (payment.status === 'cancelled') return paymeError(id, ERRORS.CANNOT_PERFORM);

  // Verify amount in tiyin
  const expectedTiyin = payment.amount * SUM_TO_TIYIN;
  if (params.amount !== expectedTiyin) return paymeError(id, ERRORS.WRONG_AMOUNT);

  return paymeResult(id, { allow: true });
}

async function createTransaction(id: any, params: any) {
  const orderId = params?.account?.order_id;
  const paymeId = params?.id;
  const time = params?.time;

  if (!orderId) return paymeError(id, ERRORS.ORDER_NOT_FOUND);

  const payment = await prisma.payment.findUnique({ where: { orderId } });
  if (!payment) return paymeError(id, ERRORS.ORDER_NOT_FOUND);

  // If already has a different payme transaction
  if (payment.externalId && payment.externalId !== paymeId) {
    return paymeError(id, ERRORS.CANNOT_PERFORM);
  }

  if (payment.status === 'paid') return paymeError(id, ERRORS.ALREADY_PAID);
  if (payment.status === 'cancelled') return paymeError(id, ERRORS.CANNOT_PERFORM);

  // Verify amount
  const expectedTiyin = payment.amount * SUM_TO_TIYIN;
  if (params.amount !== expectedTiyin) return paymeError(id, ERRORS.WRONG_AMOUNT);

  // Save payme transaction ID
  await prisma.payment.update({
    where: { orderId },
    data: {
      externalId: paymeId,
      status: 'processing',
      metadata: JSON.stringify({ payme_time: time }),
    },
  });

  return paymeResult(id, {
    create_time: time,
    transaction: payment.id,
    state: 1,
  });
}

async function performTransaction(id: any, params: any) {
  const paymeId = params?.id;
  if (!paymeId) return paymeError(id, ERRORS.ORDER_NOT_FOUND);

  const payment = await prisma.payment.findFirst({ where: { externalId: paymeId } });
  if (!payment) return paymeError(id, ERRORS.ORDER_NOT_FOUND);

  if (payment.status === 'paid') {
    return paymeResult(id, {
      perform_time: payment.completedAt?.getTime() ?? Date.now(),
      transaction: payment.id,
      state: 2,
    });
  }

  if (payment.status === 'cancelled') {
    return paymeError(id, ERRORS.CANNOT_PERFORM);
  }

  // Mark as paid and activate subscription
  const now = new Date();
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: 'paid', completedAt: now },
  });

  await activateSubscription(payment.userId, payment.planType as PlanType);

  return paymeResult(id, {
    perform_time: now.getTime(),
    transaction: payment.id,
    state: 2,
  });
}

async function cancelTransaction(id: any, params: any) {
  const paymeId = params?.id;
  const reason = params?.reason;

  if (!paymeId) return paymeError(id, ERRORS.ORDER_NOT_FOUND);

  const payment = await prisma.payment.findFirst({ where: { externalId: paymeId } });
  if (!payment) return paymeError(id, ERRORS.ORDER_NOT_FOUND);

  // If already paid, we can't cancel (refund logic would go here)
  if (payment.status === 'paid') {
    // Payme allows cancelling paid transactions (refund)
    // For now, mark as cancelled
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'cancelled',
        errorMessage: `Cancelled by Payme. Reason: ${reason}`,
      },
    });

    return paymeResult(id, {
      cancel_time: Date.now(),
      transaction: payment.id,
      state: -2, // cancelled after completion
    });
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: 'cancelled',
      errorMessage: `Cancelled by Payme. Reason: ${reason}`,
    },
  });

  return paymeResult(id, {
    cancel_time: Date.now(),
    transaction: payment.id,
    state: -1, // cancelled before completion
  });
}

async function checkTransaction(id: any, params: any) {
  const paymeId = params?.id;
  if (!paymeId) return paymeError(id, ERRORS.ORDER_NOT_FOUND);

  const payment = await prisma.payment.findFirst({ where: { externalId: paymeId } });
  if (!payment) return paymeError(id, ERRORS.ORDER_NOT_FOUND);

  const meta = payment.metadata ? JSON.parse(payment.metadata) : {};

  let state = 1; // created
  if (payment.status === 'paid') state = 2;
  if (payment.status === 'cancelled' && payment.completedAt) state = -2;
  if (payment.status === 'cancelled' && !payment.completedAt) state = -1;

  return paymeResult(id, {
    create_time: meta.payme_time ?? payment.createdAt.getTime(),
    perform_time: payment.completedAt?.getTime() ?? 0,
    cancel_time: payment.status === 'cancelled' ? Date.now() : 0,
    transaction: payment.id,
    state,
    reason: null,
  });
}

async function getStatement(id: any, params: any) {
  const from = params?.from;
  const to = params?.to;

  const payments = await prisma.payment.findMany({
    where: {
      provider: 'payme',
      createdAt: {
        gte: new Date(from),
        lte: new Date(to),
      },
      externalId: { not: null },
    },
  });

  const transactions = payments.map((p) => {
    const meta = p.metadata ? JSON.parse(p.metadata) : {};
    let state = 1;
    if (p.status === 'paid') state = 2;
    if (p.status === 'cancelled' && p.completedAt) state = -2;
    if (p.status === 'cancelled' && !p.completedAt) state = -1;

    return {
      id: p.externalId,
      time: meta.payme_time ?? p.createdAt.getTime(),
      amount: p.amount * SUM_TO_TIYIN,
      account: { order_id: p.orderId },
      create_time: meta.payme_time ?? p.createdAt.getTime(),
      perform_time: p.completedAt?.getTime() ?? 0,
      cancel_time: p.status === 'cancelled' ? Date.now() : 0,
      transaction: p.id,
      state,
      reason: null,
    };
  });

  return paymeResult(id, { transactions });
}
