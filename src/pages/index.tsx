import { useState, useCallback, lazy, Suspense } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import type { GetStaticProps } from 'next';
import { Navigation } from '@/sections/Navigation';
import { Hero } from '@/sections/Hero';
import { ScrollToTop } from '@/components/ScrollToTop';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { siteConfig } from '@/config/site';

// Preloader must be client-only: it reads window timing and has no meaningful SSR output.
// Without ssr:false the preloader would flash on every server render causing hydration mismatch.
const Preloader = dynamic(
  () => import('@/components/Preloader').then((m) => ({ default: m.Preloader })),
  { ssr: false }
);

// Below-fold sections: code-split for faster LCP + smaller initial JS payload.
const News           = lazy(() => import('@/sections/News').then((m) => ({ default: m.News })));
const Events         = lazy(() => import('@/sections/Events').then((m) => ({ default: m.Events })));
const Courses        = lazy(() => import('@/sections/Courses').then((m) => ({ default: m.Courses })));
const Services       = lazy(() => import('@/sections/Services').then((m) => ({ default: m.Services })));
const Museum         = lazy(() => import('@/sections/Museum').then((m) => ({ default: m.Museum })));
const SocialProof    = lazy(() => import('@/sections/SocialProof').then((m) => ({ default: m.SocialProof })));
const FAQ            = lazy(() => import('@/sections/FAQ').then((m) => ({ default: m.FAQ })));
const ContactForm    = lazy(() => import('@/sections/ContactForm').then((m) => ({ default: m.ContactForm })));
const Footer         = lazy(() => import('@/sections/Footer').then((m) => ({ default: m.Footer })));

function SectionSkeleton({ minHeight = '300px' }: { minHeight?: string }) {
  return (
    <div aria-hidden="true" style={{ minHeight }} className="w-full animate-pulse bg-gray-100" />
  );
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const handlePreloaderComplete = useCallback(() => setIsLoading(false), []);

  return (
    <>
      <Head>
        <title>{siteConfig.title}</title>
        <meta name="description" content={siteConfig.description} />
        <meta name="keywords" content={siteConfig.keywords} />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#1E2761" />
        <link rel="canonical" href={siteConfig.canonical} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteConfig.canonical} />
        <meta property="og:title" content={siteConfig.title} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:image" content={`${siteConfig.canonical}${siteConfig.ogImage}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="vi_VN" />
        <meta property="og:site_name" content="Câu lạc bộ Tri thức Du lịch" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteConfig.title} />
        <meta name="twitter:description" content={siteConfig.description} />
        <meta name="twitter:image" content={`${siteConfig.canonical}${siteConfig.ogImage}`} />
      </Head>

      <Preloader onComplete={handlePreloaderComplete} />

      <div 
        suppressHydrationWarning
        className={`min-h-screen bg-[#F5F7FA] ${isLoading ? 'overflow-hidden max-h-screen' : ''}`}
      >
        <Navigation />

        <main>
          <Hero isReady={!isLoading} />

          <ErrorBoundary section="Tin Tức" compact>
            <Suspense fallback={<SectionSkeleton minHeight="500px" />}>
              <News />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary section="Sự Kiện" compact>
            <Suspense fallback={<SectionSkeleton minHeight="500px" />}>
              <Events />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary section="Khóa Học" compact>
            <Suspense fallback={<SectionSkeleton minHeight="500px" />}>
              <Courses />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary section="Sản Phẩm & Dịch Vụ" compact>
            <Suspense fallback={<SectionSkeleton minHeight="500px" />}>
              <Services />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary section="Về Chúng Tôi" compact>
            <Suspense fallback={<SectionSkeleton minHeight="600px" />}>
              <Museum />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary section="Cảm Nhận & Thành Tựu" compact>
            <Suspense fallback={<SectionSkeleton minHeight="500px" />}>
              <SocialProof />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary section="FAQ" compact>
            <Suspense fallback={<SectionSkeleton minHeight="400px" />}>
              <FAQ />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary section="Đăng Ký" compact>
            <Suspense fallback={<SectionSkeleton minHeight="500px" />}>
              <ContactForm />
            </Suspense>
          </ErrorBoundary>
        </main>

        <ErrorBoundary section="Footer" compact>
          <Suspense fallback={<SectionSkeleton minHeight="200px" />}>
            <Footer />
          </Suspense>
        </ErrorBoundary>

        <ScrollToTop />
      </div>
    </>
  );
}

// getStaticProps enables SSG: Next.js pre-renders this page at build time.
// The page shell renders with full HTML for Googlebot (real SEO), not an empty SPA shell.
export const getStaticProps: GetStaticProps = async () => {
  return { props: {} };
};
