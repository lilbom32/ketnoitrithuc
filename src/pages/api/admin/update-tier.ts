import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';
import type { MembershipTier } from '@/lib/database.types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, tier } = req.body;
  const adminSecret = req.headers['x-admin-secret'];

  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!userId || !tier || !['free', 'premium', 'visitor'].includes(tier)) {
    return res.status(400).json({ error: 'Missing or invalid parameters' });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('profiles')
    .update({ membership_tier: tier as MembershipTier })
    .eq('id', userId);

  if (error) {
    console.error('[admin/update-tier] error:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
