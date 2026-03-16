import { Html, Head, Main, NextScript } from 'next/document';

export default function AppDocument({ locale }: { locale?: string }) {
  return (
    <Html lang={locale || 'vi'}>
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/jpeg" href="/images/logo clb.jpg" />
        <link rel="apple-touch-icon" href="/images/logo clb.jpg" />

        {/* Google Fonts: non-render-blocking pattern */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400;1,9..40,500&family=Dancing+Script:wght@400;500;600;700&display=swap"
        />

        {/* JSON-LD Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Câu lạc bộ Tri thức Du lịch',
              alternateName: 'CLB Tri thức Du lịch',
              url: 'https://clbtrithuc.vn',
              description:
                'Cộng đồng tri thức cho travel agents, tour operators và hospitality managers tại Việt Nam vùng Đông Nam Bộ và Mekong.',
              foundingDate: '2015-11-11',
              areaServed: ['VN', 'KH', 'LA', 'MM', 'TH'],
              inLanguage: ['vi', 'en', 'zh', 'fr', 'ko', 'de'],
              sameAs: [
                'https://www.facebook.com/clbtrithuc',
                'https://www.youtube.com/@clbtrithuc',
              ],
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
