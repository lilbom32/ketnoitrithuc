import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import vi from './locales/vi.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import zh from './locales/zh.json';
import ko from './locales/ko.json';
import de from './locales/de.json';

// Explicit broad type prevents react-i18next from inferring strict key unions,
// which would break dynamic t() calls in Hero.tsx and Navigation.tsx.
const resources: Record<string, { translation: Record<string, unknown> }> = {
  vi: { translation: vi as Record<string, unknown> },
  en: { translation: en as Record<string, unknown> },
  fr: { translation: fr as Record<string, unknown> },
  zh: { translation: zh as Record<string, unknown> },
  ko: { translation: ko as Record<string, unknown> },
  de: { translation: de as Record<string, unknown> },
};

// Do NOT use i18next-browser-languagedetector — it causes hydration mismatch:
// server uses fallbackLng (vi), client uses navigator → different text on first paint.
// Next.js i18n provides locale via router.locale; we sync in _app.tsx before render.
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'vi',
    debug: false,
    interpolation: { escapeValue: false },
  });
}

export default i18n;
