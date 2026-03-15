/**
 * /kien-thuc/[slug] — Single article page
 *
 * Renders article Markdown as HTML via the `marked` library.
 * Supports :::info and :::cta custom block syntax (post-processing).
 *
 * getStaticPaths pre-renders all published articles at build time.
 * ISR revalidates every 60 s for live edits.
 */
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react';
import { marked } from 'marked';
import { createAdminClient } from '@/lib/supabase';
import type { ArticleRow } from '@/lib/database.types';

const BASE_URL = 'https://clbtrithuc.vn';

interface Props {
  article: ArticleRow;
  htmlContent: string;
}

const ArticlePage: NextPage<Props> = ({ article, htmlContent }) => {
  const [copied, setCopied] = useState(false);

  const date = new Date(article.created_at).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const canonicalUrl = `${BASE_URL}/kien-thuc/${article.slug}`;
  const ogImage = article.cover_image_url ?? `${BASE_URL}/images/og-default.jpg`;
  const description = article.excerpt ?? article.title;

  function share(platform: 'facebook' | 'twitter' | 'linkedin') {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(canonicalUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`,
    };
    window.open(urls[platform], '_blank', 'noopener,width=600,height=500');
  }

  function copyLink() {
    navigator.clipboard.writeText(canonicalUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <Head>
        <title>{article.title} | CLB Kết nối tri thức</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="CLB Kết nối tri thức" />
        <meta property="article:published_time" content={article.created_at} />
        {article.author && <meta property="article:author" content={article.author} />}

        {/* Twitter / X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* JSON-LD Article */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: article.title,
              description,
              image: ogImage,
              url: canonicalUrl,
              datePublished: article.created_at,
              dateModified: article.updated_at,
              author: article.author
                ? { '@type': 'Person', name: article.author }
                : { '@type': 'Organization', name: 'CLB Kết nối tri thức' },
              publisher: {
                '@type': 'Organization',
                name: 'CLB Kết nối tri thức',
                url: BASE_URL,
                logo: { '@type': 'ImageObject', url: `${BASE_URL}/images/logo clb.jpg` },
              },
            }),
          }}
        />
      </Head>

      <main className="min-h-screen bg-white">
        {/* Cover */}
        {article.cover_image_url && (
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        {/* Article header */}
        <div className="max-w-3xl mx-auto px-4 py-10">
          <Link
            href="/kien-thuc"
            className="text-sm text-gray-400 hover:text-[#1E2761] mb-6 inline-flex items-center gap-1 transition-colors"
          >
            ← Kho Tri Thức
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${
              article.category === 'thuc-chien'
                ? 'bg-[#E63946] text-white'
                : 'bg-[#1E2761] text-white'
            }`}>
              {article.category === 'thuc-chien' ? 'Thực Chiến' : 'Tri Thức'}
            </span>
            <span className="text-xs text-gray-400">{article.reading_time} phút đọc</span>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl leading-tight mb-4">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">{article.excerpt}</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              {article.author && <span className="font-medium text-gray-600">{article.author}</span>}
              <span>{date}</span>
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 mr-1">Chia sẻ:</span>
              <button
                onClick={() => share('facebook')}
                aria-label="Chia sẻ lên Facebook"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button
                onClick={() => share('twitter')}
                aria-label="Chia sẻ lên X"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/5 text-black hover:bg-black hover:text-white transition-all"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                onClick={() => share('linkedin')}
                aria-label="Chia sẻ lên LinkedIn"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </button>
              <button
                onClick={copyLink}
                aria-label="Sao chép link"
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-[#1E2761] hover:text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Article body */}
          <div
            className="prose prose-lg max-w-none mt-8
              prose-headings:font-serif prose-headings:text-[#1E2761]
              prose-a:text-[#E63946] prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-[#E63946] prose-blockquote:text-gray-600
              prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </main>
    </>
  );
};

/** Convert :::info and :::cta custom blocks to styled HTML */
function processCustomBlocks(html: string): string {
  return html
    .replace(
      /:::info\n([\s\S]*?):::/g,
      '<div class="my-6 p-4 bg-[#CADCFC]/20 border-l-4 border-[#1E2761] rounded-r-lg">$1</div>'
    )
    .replace(
      /:::cta\n([\s\S]*?):::/g,
      '<div class="my-8 p-6 bg-[#1E2761] text-white rounded-xl">$1</div>'
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const admin = createAdminClient();
  const { data } = await admin
    .from('articles')
    .select('slug')
    .eq('published', true)
    .returns<{ slug: string }[]>();

  const paths = (data ?? []).map((a) => ({ params: { slug: a.slug } }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const admin = createAdminClient();

  const { data: article } = await admin
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single<ArticleRow>();

  if (!article) {
    return { notFound: true };
  }

  const rawHtml = await marked(article.content ?? '');
  const htmlContent = processCustomBlocks(rawHtml);

  return {
    props: { article, htmlContent },
    revalidate: 60,
  };
};

export default ArticlePage;
