import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

/**
 * HOC that wraps getServerSideProps to enforce ADMIN_SECRET authentication.
 * Reads from cookie `admin_secret` or query param `secret`.
 * Redirects to /admin/login on failure.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withAdminAuth<P = Record<string, never>>(
  gssp?: (ctx: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<P>>
): GetServerSideProps<any> {
  return async (ctx) => {
    const secret =
      (ctx.req.cookies['admin_secret'] as string | undefined) ||
      (ctx.query.secret as string | undefined);

    if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
      const destination = `/admin/login?next=${encodeURIComponent(ctx.resolvedUrl)}`;
      return { redirect: { destination, permanent: false } };
    }

    if (gssp) {
      return gssp(ctx);
    }

    return { props: {} as P };
  };
}

/**
 * Checks admin secret from API request headers or cookies.
 * Call this at the top of every /api/admin/* handler.
 */
export function requireAdminSecret(
  req: { headers: Record<string, string | string[] | undefined>; cookies: Partial<Record<string, string>> },
  res: { status: (code: number) => { json: (body: unknown) => void } }
): boolean {
  const headerSecret = req.headers['x-admin-secret'];
  const cookieSecret = req.cookies['admin_secret'];
  const secret = Array.isArray(headerSecret) ? headerSecret[0] : headerSecret || cookieSecret;

  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
