import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import { createAdminClient } from './supabase';
import type { MembershipTier, ProfileRow } from './database.types';

/**
 * Create a Supabase client scoped to a Pages Router API request.
 * Reads/writes session cookies so getUser() works server-side.
 */
export function createServerSupabaseClient(req: NextApiRequest, res: NextApiResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(req.headers.cookie ?? '').map(({ name, value }) => ({
            name,
            value: value ?? '',
          }));
        },
        setAll(cookiesToSet) {
          res.setHeader(
            'Set-Cookie',
            cookiesToSet.map(({ name, value, options }) =>
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );
}

/** Monthly download limits per membership tier. */
export const DOWNLOAD_LIMITS: Record<MembershipTier, number> = {
  visitor: 0,
  free: 10,
  premium: Infinity,
};

/**
 * Returns the authenticated user's profile, or null if not authenticated.
 * Uses the server-side client so the JWT is validated on the server.
 */
export async function getAuthUser(req: NextApiRequest, res: NextApiResponse) {
  const client = createServerSupabaseClient(req, res);
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) return null;

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<ProfileRow>();

  // Auto-create profile if missing (e.g. user bypassed /api/auth/callback)
  if (!profile) {
    const { data: created } = await admin
      .from('profiles')
      .upsert(
        { id: user.id, email: user.email ?? null, membership_tier: 'free' },
        { onConflict: 'id', ignoreDuplicates: true }
      )
      .select()
      .single<ProfileRow>();
    return created;
  }

  return profile;
}

/**
 * Enforce membership tier on an API route.
 * Returns true if the user's tier meets the requirement, false otherwise.
 */
export function hasTierAccess(
  userTier: MembershipTier | null | undefined,
  requiredTier: MembershipTier
): boolean {
  const order: MembershipTier[] = ['visitor', 'free', 'premium'];
  const userLevel = order.indexOf(userTier ?? 'visitor');
  const requiredLevel = order.indexOf(requiredTier);
  return userLevel >= requiredLevel;
}
