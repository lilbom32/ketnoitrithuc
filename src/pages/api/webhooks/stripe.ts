/**
 * /api/webhooks/stripe
 *
 * Stripe webhook handler for subscription lifecycle events.
 * Verifies the Stripe-Signature header before processing any event.
 *
 * Relevant events:
 *   - customer.subscription.created   → upgrade to premium
 *   - customer.subscription.updated   → handle plan change
 *   - customer.subscription.deleted   → downgrade to free
 *   - invoice.payment_failed          → notify user / grace period logic
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase';
import type { ProfileUpdate, ProfileRow } from '@/lib/database.types';

// Stripe requires the raw body for webhook signature verification.
// Disable Next.js body parsing so we can read the raw buffer.
export const config = { api: { bodyParser: false } };

async function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecret || !webhookSecret) {
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  const stripe = new Stripe(stripeSecret);
  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Stripe] Webhook signature verification failed:', message);
    return res.status(400).json({ error: `Webhook error: ${message}` });
  }

  const admin = createAdminClient();

  async function setUserTier(stripeCustomerId: string, tier: 'free' | 'premium') {
    // Look up Supabase user by stripe_customer_id stored in profile metadata
    // For simplicity we store stripe_customer_id in profiles.avatar_url field until
    // the schema is extended. In production: add a stripe_customer_id column.
    const { data: profiles } = await admin
      .from('profiles')
      .select('id')
      .eq('avatar_url', stripeCustomerId)
      .limit(1)
      .returns<Pick<ProfileRow, 'id'>[]>();

    if (!profiles?.length) {
      console.warn('[Stripe] No profile found for customer:', stripeCustomerId);
      return;
    }

    const update: ProfileUpdate = { membership_tier: tier, updated_at: new Date().toISOString() };
    await admin.from('profiles').update(update).eq('id', profiles[0].id);

    console.log(`[Stripe] Set user ${profiles[0].id} to ${tier}`);
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const isActive = sub.status === 'active' || sub.status === 'trialing';
      await setUserTier(sub.customer as string, isActive ? 'premium' : 'free');
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await setUserTier(sub.customer as string, 'free');
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.warn('[Stripe] Payment failed for customer:', invoice.customer);
      // TODO: send email notification via Resend / Supabase Edge Function
      break;
    }
    default:
      // Unhandled event type — not an error, just ignore
      break;
  }

  return res.status(200).json({ received: true });
}
