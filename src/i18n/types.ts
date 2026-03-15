/**
 * i18n type declarations for CLB Kết nối tri thức.
 *
 * This file makes `useTranslation()` fully type-safe:
 *   - `t('nav.about')` → OK
 *   - `t('nav.doesnotexist')` → TypeScript error
 *
 * The Vietnamese locale (vi.json) is the canonical shape. All other locales
 * must mirror this structure — TypeScript will NOT enforce other locale files,
 * but the fallback mechanism in i18next ensures vi.json values fill gaps.
 */

import type vi from './locales/vi.json';

export type TranslationKeys = typeof vi;

// Recursive helper to build dot-notation key union from a nested object type
type DotNotation<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends Record<string, unknown>
    ? DotNotation<T[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof T & string];

export type TKey = DotNotation<TranslationKeys>;
