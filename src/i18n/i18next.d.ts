/**
 * Override i18next's automatic resource type inference.
 *
 * i18next v25 + react-i18next v16 infer strict key unions from the resources
 * object passed to init(). Hero.tsx and Navigation.tsx use dynamic string keys
 * (e.g. t(stat.label)), so strict inference breaks compilation.
 *
 * This declaration widens the resource type back to plain strings, which is
 * the i18next v22 and earlier behaviour.
 */

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: { [key: string]: string };
    };
  }
}

export {};
