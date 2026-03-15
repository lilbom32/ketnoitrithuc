/**
 * Next.js Edge Middleware — membership gating for CLB Kết nối tri thức.
 *
 * Runs on Vercel Edge Network (before the page renders).
 * Uses @supabase/ssr to validate the session JWT without a round-trip to Node.js.
 *
 * Route protection rules:
 *   /dashboard/*          → require any authenticated user (free or premium)
 *   /api/download/*       → handled in the API route itself (more granular tier check)
 *   /api/webhooks/*       → public (VNPay/Stripe call these directly, no session)
 *   everything else       → public (landing page, marketing, i18n locale routes)
 */
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';

const PROTECTED_PREFIXES = ['/dashboard'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept protected routes
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  // Create a Supabase client that can read/write cookies on the Edge
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('cookie') ?? '').map(({ name, value }) => ({
            name,
            value: value ?? '',
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Validate session — getUser() verifies the JWT with Supabase's JWKS
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Not authenticated → redirect to home with a login prompt flag
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('auth', 'required');
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated — let the request through.
  // Fine-grained tier checks (free vs premium) happen inside the page/API route.
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico
     * - public folder assets (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/|fonts/).*)',
  ],
};
