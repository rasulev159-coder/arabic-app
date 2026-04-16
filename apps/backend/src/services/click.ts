import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { activateSubscription } from './subscription';
import { PlanType } from '../config/subscription';

// Click error codes
const CLICK_ERRORS = {
  SUCCESS: 0,
  SIGN_FAILED: -1,
  WRONG_AMOUNT: -2,
  ACTION_NOT_FOUND: -3,
  ALREADY_PAID: -4,
  ORDER_NOT_FOUND: -5,
  TRANSACTION_ERROR: -6,
  UPDATE_FAILED: -7,
  USER_NOT_FOUND: -8,
  TRANSACTION_CANCELLED: -9,
};

/**
 * Verify Click signature.
 * MD5(click_trans_id + service_id + SECRET_KEY + merchant_trans_id + amount + action + sign_time)
 */
function verifyClickSign(params: any): boolean {
  const secretKey = process.env.CLICK_SECRET_KEY || '';
  const signString = [
    params.click_trans_id,
    params.service_id,
    secretKey,
    params.merchant_trans_id,
    params.amount,
    params.action,
    params.sign_time,
  ].join('');

  const expectedSign = crypto.createHash('md5').update(signString).digest('hex');
  return expectedSign === params.sign_string;
}

/**
 * Handle Click Prepare request (action=0)
 */
export async function handleClickPrepare(params: any) {
  // Verify signature
  if (!verifyClickSign(params)) {
    return {
      error: CLICK_ERRORS.SIGN_FAILED,
      error_note: 'Invalid sign',
      click_trans_id: params.click_trans_id,
      merchant_trans_id: params.merchant_trans_id,
    };
  }

  const orderId = params.merchant_trans_id;
  const payment = await prisma.payment.findUnique({ where: { orderId } });

  if (!payment) {
    return {
      error: CLICK_ERRORS.ORDER_NOT_FOUND,
      error_note: 'Order not found',
      click_trans_id: params.click_trans_id,
      merchant_trans_id: orderId,
    };
  }

  if (payment.status === 'paid') {
    return {
      error: CLICK_ERRORS.ALREADY_PAID,
      error_note: 'Already paid',
      click_trans_id: params.click_trans_id,
      merchant_trans_id: orderId,
    };
  }

  if (payment.status === 'cancelled') {
    return {
      error: CLICK_ERRORS.TRANSACTION_CANCELLED,
      error_note: 'Transaction cancelled',
      click_trans_id: params.click_trans_id,
      merchant_trans_id: orderId,
    };
  }

  // Verify amount
  if (Number(params.amount) !== payment.amount) {
    return {
      error: CLICK_ERRORS.WRONG_AMOUNT,
      error_note: 'Wrong amount',
      click_trans_id: params.click_trans_id,
      merchant_trans_id: orderId,
    };
  }

  // Save click_trans_id
  await prisma.payment.update({
    where: { orderId },
    data: {
      externalId: String(params.click_trans_id),
      status: 'processing',
    },
  });

  return {
    error: CLICK_ERRORS.SUCCESS,
    error_note: 'Success',
    click_trans_id: params.click_trans_id,
    merchant_trans_id: orderId,
    merchant_prepare_id: payment.id,
  };
}

/**
 * Handle Click Complete request (action=1)
 */
export async function handleClickComplete(params: any) {
  // Verify signature
  if (!verifyClickSign(params)) {
    return {
      error: CLICK_ERRORS.SIGN_FAILED,
      error_note: 'Invalid sign',
      click_trans_id: params.click_trans_id,
      merchant_trans_id: params.merchant_trans_id,
    };
  }

  const orderId = params.merchant_trans_id;
  const payment = await prisma.payment.findUnique({ where: { orderId } });

  if (!payment) {
    return {
      error: CLICK_ERRORS.ORDER_NOT_FOUND,
      error_note: 'Order not found',
      click_trans_id: params.click_trans_id,
      merchant_trans_id: orderId,
    };
  }

  if (payment.status === 'paid') {
    return {
      error: CLICK_ERRORS.ALREADY_PAID,
      error_note: 'Already paid',
      click_trans_id: params.click_trans_id,
      merchant_trans_id: orderId,
      merchant_confirm_id: payment.id,
    };
  }

  if (payment.status === 'cancelled') {
    return {
      error: CLICK_ERRORS.TRANSACTION_CANCELLED,
      error_note: 'Transaction cancelled',
      click_trans_id: params.click_trans_id,
      merchant_trans_id: orderId,
    };
  }

  // Check if Click reports an error
  if (Number(params.error) < 0) {
    await prisma.payment.update({
      where: { orderId },
      data: {
        status: 'cancelled',
        errorMessage: `Click error: ${params.error_note || params.error}`,
      },
    });
    return {
      error: params.error,
      error_note: params.error_note || 'Transaction error',
      click_trans_id: params.click_trans_id,
      merchant_trans_id: orderId,
    };
  }

  // Verify amount
  if (Number(params.amount) !== payment.amount) {
    return {
      error: CLICK_ERRORS.WRONG_AMOUNT,
      error_note: 'Wrong amount',
      click_trans_id: params.click_trans_id,
      merchant_trans_id: orderId,
    };
  }

  // Mark as paid and activate subscription
  const now = new Date();
  await prisma.payment.update({
    where: { orderId },
    data: {
      status: 'paid',
      completedAt: now,
      externalId: String(params.click_trans_id),
    },
  });

  await activateSubscription(payment.userId, payment.planType as PlanType);

  return {
    error: CLICK_ERRORS.SUCCESS,
    error_note: 'Success',
    click_trans_id: params.click_trans_id,
    merchant_trans_id: orderId,
    merchant_confirm_id: payment.id,
  };
}
