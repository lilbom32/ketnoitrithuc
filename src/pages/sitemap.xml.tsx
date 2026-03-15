/**
 * /sitemap.xml — Dynamic sitemap generated server-side.
 * Includes static pages + all published articles from Supabase.
 */
import type { GetServerSideProps } from 'next';
import { createAdminClient } from '@/lib/supabase';

const BASE_URL = 'https://clbtrithuc.vn';

const STATIC_PAGES = [
  { url: '/',               changefreq: 'weekly',  priority: '1.0' },
  { url: '/kien-thuc',      changefreq: 'daily',   priority: '0.9' },
  { url: '/ve-chung-toi',   changefreq: 'monthly', priority: '0.7' },
  { url: '/su-kien',        changefreq: 'weekly',  priority: '0.8' },
  { url: '/viec-lam',       changefreq: 'daily',   priority: '0.8' },
  { url: '/tai-nguyen',     changefreq: 'weekly',  priority: '0.8' },
  { url: '/doi-tac',        changefreq: 'monthly', priority: '0.6' },
  { url: '/san-pham',       changefreq: 'monthly', priority: '0.7' },
  { url: '/co-hoi',         changefreq: 'weekly',  priority: '0.7' },
  { url: '/hoi-dap',        changefreq: 'monthly', priority: '0.6' },
  { url: '/dang-ky',        changefreq: 'monthly', priority: '0.5' },
  { url: '/dang-nhap',      changefreq: 'monthly', priority: '0.3' },
];

function buildSitemap(
  staticPages: typeof STATIC_PAGES,
  articles: { slug: string; updated_at: string }[]
): string {
  const today = new Date().toISOString().split('T')[0];

  const staticEntries = staticPages
    .map(
      (p) => `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join('\n');

  const articleEntries = articles
    .map(
      (a) => `  <url>
    <loc>${BASE_URL}/kien-thuc/${a.slug}</loc>
    <lastmod>${new Date(a.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${articleEntries}
</urlset>`;
}

// Next.js requires a default export even for API-style pages
function SitemapXML() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const admin = createAdminClient();
  const { data: articles } = await admin
    .from('articles')
    .select('slug, updated_at')
    .eq('published', true)
    .returns<{ slug: string; updated_at: string }[]>();

  const xml = buildSitemap(STATIC_PAGES, articles ?? []);

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();

  return { props: {} };
};

export default SitemapXML;
