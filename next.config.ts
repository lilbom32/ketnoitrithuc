import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  i18n: {
    locales: ['vi', 'en', 'zh', 'fr', 'ko', 'de'],
    defaultLocale: 'vi',
    localeDetection: false,
  },

  transpilePackages: ['@uiw/react-md-editor', '@uiw/react-markdown-preview'],
};

const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG || 'clb-tri-thuc',
  project: process.env.SENTRY_PROJECT || 'clb-website',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: process.env.NODE_ENV === 'development',
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
