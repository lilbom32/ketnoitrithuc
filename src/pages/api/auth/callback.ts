/**
 * /api/auth/callback
 *
 * Supabase Auth redirect target after email confirmation, OAuth, or magic link.
 * Exchanges the `code` query param for a session cookie, then redirects the user
 * to the dashboard (or wherever `next` points).
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase';
import type { ProfileInsert } from '@/lib/database.types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code, next = '/' } = req.query as Record<string, string>;

  if (!code) {
    return res.status(400).json({ error: 'Missing code parameter' });
  }

  const supabase = createServerSupabaseClient(req, res);
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.error('[auth/callback] exchangeCodeForSession failed:', error?.message);
    return res.redirect(`/?auth_error=${encodeURIComponent(error?.message ?? 'Unknown error')}`);
  }

  // Upsert profile row on first login (trigger also handles this, but belt-and-suspenders).
  const admin = createAdminClient();
  const profileInsert: ProfileInsert = {
    id: data.user.id,
    email: data.user.email ?? null,
    full_name: (data.user.user_metadata?.full_name as string) ?? null,
    membership_tier: (['free', 'premium'].includes(data.user.user_metadata?.membership_tier)
      ? data.user.user_metadata.membership_tier : 'free') as any,
    phone: (data.user.user_metadata?.phone as string) ?? null,
  };
  await admin.from('profiles').upsert(profileInsert, { onConflict: 'id', ignoreDuplicates: true });

  return res.redirect(next);
}
