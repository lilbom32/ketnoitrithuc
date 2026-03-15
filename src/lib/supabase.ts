import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/**
 * Browser/client-side Supabase client (uses anon key).
 * Uses createBrowserClient from @supabase/ssr so the session is stored
 * in cookies (not localStorage), allowing server-side API routes to read it.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-side admin client (uses service role key — bypasses RLS).
 * Import ONLY in API routes or getServerSideProps. Never expose to the client bundle.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('[Supabase] SUPABASE_SERVICE_ROLE_KEY must be set for admin operations');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
