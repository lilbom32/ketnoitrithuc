/**
 * /api/payment/create-vnpay
 *
 * Creates a VNPay payment URL for a membership tier upgrade.
 * The client POSTs { tier: 'premium' } after the user is authenticated.
 *
 * Returns { paymentUrl } — the client redirects the browser to this URL.
 *
 * VNPay sandbox docs:
 *   https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { getAuthUser } from '@/lib/auth';

// Tier prices in VND
const TIER_PRICES: Record<string, number> = {
  premium: 499_000,
};

/** Sort params alphabetically and join as key=value&key=value */
function buildHashData(params: Record<string, string>): string {
  return Object.keys(params)
    .filter((k) => params[k])
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
}

function formatVnpDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // 1. Auth check
  const profile = await getAuthUser(req, res);
  if (!profile) return res.status(401).json({ error: 'Authentication required' });

  const { tier } = req.body as { tier?: string };
  if (!tier || !TIER_PRICES[tier]) {
    return res.status(400).json({ error: 'Invalid tier. Valid values: premium' });
  }

  const tmnCode = process.env.VNPAY_TMN_CODE;
  const hashSecret = process.env.VNPAY_HASH_SECRET;
  const vnpayUrl =
    process.env.VNPAY_URL ?? 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

  if (!tmnCode || !hashSecret) {
    console.error('[create-vnpay] Missing VNPAY_TMN_CODE or VNPAY_HASH_SECRET');
    return res.status(500).json({ error: 'Payment gateway not configured' });
  }

  const now = new Date();
  // txnRef format expected by /api/webhooks/vnpay: userId_tier_timestamp
  const txnRef = `${profile.id}_${tier}_${now.getTime()}`;
  const amount = TIER_PRICES[tier]! * 100; // VNPay requires amount × 100
  const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/dang-ky/thanh-toan-return`;

  const params: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Amount: String(amount),
    vnp_CurrCode: 'VND',
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: `CLB Tri Thuc - Nang cap ${tier} - ${profile.email ?? profile.id}`,
    vnp_OrderType: 'other',
    vnp_Locale: 'vn',
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr:
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.socket.remoteAddress ??
      '127.0.0.1',
    vnp_CreateDate: formatVnpDate(now),
  };

  const hashData = buildHashData(params);
  const secureHash = crypto
    .createHmac('sha512', hashSecret)
    .update(Buffer.from(hashData, 'utf-8'))
    .digest('hex');

  const queryString = new URLSearchParams({ ...params, vnp_SecureHash: secureHash }).toString();
  const paymentUrl = `${vnpayUrl}?${queryString}`;

  return res.status(200).json({ paymentUrl });
}
