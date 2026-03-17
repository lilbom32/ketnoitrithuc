import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { SentryErrorBoundary } from '@/components/SentryErrorBoundary';
import '@/index.css';
import i18n from '@/i18n';

export default function App({ Component, pageProps, router }: AppProps) {
  // Sync i18next with Next.js locale BEFORE first render — prevents hydration mismatch.
  // Server uses fallbackLng; client used LanguageDetector → different outputs.
  if (router?.locale && i18n.language !== router.locale) {
    i18n.language = router.locale;
    (i18n as { resolvedLanguage?: string }).resolvedLanguage = router.locale;
  }

  // Keep i18next in sync when user navigates (client-side locale change).
  // NOTE: Cannot check i18n.language !== router.locale here — the synchronous mutation
  // above already sets i18n.language, so the condition would always be false and
  // changeLanguage() would never fire. Always call it to trigger the 'languageChanged'
  // event so all useTranslation() subscribers re-render with the correct language.
  useEffect(() => {
    if (router?.locale) {
      i18n.changeLanguage(router.locale);
    }
  }, [router?.locale]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <SentryErrorBoundary>
        <Component {...pageProps} />
      </SentryErrorBoundary>
    </ThemeProvider>
  );
}
