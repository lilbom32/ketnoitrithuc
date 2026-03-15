/**
 * /api/webhooks/vnpay
 *
 * VNPay IPN (Instant Payment Notification) handler.
 *
 * VNPay POSTs to this URL after a payment attempt (success or failure).
 * We verify the HMAC-SHA512 signature, then upgrade the user's membership tier.
 *
 * Docs: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html#ipn-url
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase';
import type { ProfileUpdate } from '@/lib/database.types';

export const config = { api: { bodyParser: true } };

/** Sort query params alphabetically and join as key=value&key=value */
function buildHashData(params: Record<string, string>): string {
  return Object.keys(params)
    .filter((k) => k !== 'vnp_SecureHash' && k !== 'vnp_SecureHashType' && params[k])
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
}

function verifySignature(params: Record<string, string>, secretKey: string): boolean {
  const hashData = buildHashData(params);
  const expected = crypto
    .createHmac('sha512', secretKey)
    .update(Buffer.from(hashData, 'utf-8'))
    .digest('hex');
  return expected === params.vnp_SecureHash;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // VNPay sends GET for IPN return URL, POST for server-to-server IPN
  const params = (req.method === 'POST' ? req.body : req.query) as Record<string, string>;

  const secret = process.env.VNPAY_HASH_SECRET;
  if (!secret) {
    return res.status(500).json({ RspCode: '99', Message: 'Server configuration error' });
  }

  // 1. Verify HMAC signature
  if (!verifySignature(params, secret)) {
    return res.status(200).json({ RspCode: '97', Message: 'Invalid signature' });
  }

  const responseCode = params.vnp_ResponseCode;
  const txnRef = params.vnp_TxnRef; // format: "userId_tier_timestamp"
  const amount = parseInt(params.vnp_Amount ?? '0') / 100; // VNPay sends amount × 100

  // 2. Only process successful payments
  if (responseCode !== '00') {
    console.log(`[VNPay] Payment failed for ${txnRef}: code ${responseCode}`);
    return res.status(200).json({ RspCode: '00', Message: 'Confirmed' });
  }

  // 3. Parse order reference to get userId and target tier
  const parts = txnRef?.split('_');
  if (!parts || parts.length < 2) {
    return res.status(200).json({ RspCode: '01', Message: 'Invalid order reference' });
  }
  const [userId, tierRaw] = parts;
  const tier = tierRaw === 'premium' ? 'premium' : 'free';

  // 4. Upgrade membership in Supabase
  const admin = createAdminClient();
  const update: ProfileUpdate = { membership_tier: tier, updated_at: new Date().toISOString() };
  const { error } = await admin.from('profiles').update(update).eq('id', userId!);

  if (error) {
    console.error('[VNPay] Failed to upgrade membership:', error.message);
    return res.status(200).json({ RspCode: '99', Message: 'Database error' });
  }

  console.log(`[VNPay] Upgraded user ${userId} to ${tier} (${amount} VND)`);
  return res.status(200).json({ RspCode: '00', Message: 'Confirmed' });
}
