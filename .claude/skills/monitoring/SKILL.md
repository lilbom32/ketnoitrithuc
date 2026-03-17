---
name: monitoring
description: Setup error tracking and performance monitoring with Sentry for the CLB Tri Thức project. Includes error capture, performance monitoring, session replay, and alerting.
---

# Monitoring Skill — CLB Tri Thức

## Mục tiêu
Thiết lập Sentry để track errors, monitor performance, và nhận alerts khi có vấn đề — giúp phát hiện và fix bugs nhanh hơn.

---

## Quick Start

### Setup lần đầu
```bash
# Install Sentry SDK
npm install @sentry/nextjs

# Auto-configure với Sentry wizard
npx @sentry/wizard@latest -i nextjs

# Hoặc manual setup (xem dưới)
```

### Required Environment Variables
```bash
# .env.local
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=sntrys_xxx  # For source maps upload
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

---

## PHẦN 1: Sentry Configuration

### 1.1 Next.js Config (withSentryConfig)

**next.config.ts** (update):
```typescript
import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  
  i18n: {
    locales: ['vi', 'en', 'zh', 'fr', 'ko', 'de'],
    defaultLocale: 'vi',
    localeDetection: false,
  },
  
  transpilePackages: ['@uiw/react-md-editor', '@uiw/react-markdown-preview'],
};

// Sentry webpack plugin options
const sentryWebpackPluginOptions = {
  org: 'clb-tri-thuc',           // Thay bằng org của bạn
  project: 'clb-website',        // Thay bằng project name
  
  // Upload source maps chỉ ở production
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  
  // Performance monitoring
  hideSourceMaps: true,
  disableLogger: process.env.NODE_ENV === 'development',
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
```

### 1.2 Sentry Client Config

**sentry.client.config.ts** (root):
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Environment
  environment: process.env.NODE_ENV,
  
  // Tracing (performance monitoring)
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,      // 10% sessions
  replaysOnErrorSampleRate: 1.0,       // 100% khi có error
  
  integrations: [
    // Browser profiling (optional)
    Sentry.browserProfilingIntegration(),
    
    // Replay integration
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: true,
      blockAllMedia: false,
    }),
    
    // Capture console errors
    Sentry.captureConsoleIntegration({
      levels: ['error', 'warn'],
    }),
  ],
  
  // Before send hook (filter sensitive data)
  beforeSend(event) {
    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers['Authorization'];
      delete event.request.headers['Cookie'];
    }
    
    // Remove sensitive user data
    if (event.user) {
      delete event.user.email;
      delete event.user.ip_address;
    }
    
    return event;
  },
  
  // Ignore common non-actionable errors
  ignoreErrors: [
    // Browser extensions
    /^ResizeObserver loop limit exceeded$/,
    /^Non-Error promise rejection captured$/,
    // Network errors
    /^Network Error$/,
    /^Failed to fetch$/,
  ],
});
```

### 1.3 Sentry Server Config

**sentry.server.config.ts** (root):
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Server traces
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Disable in development
  enabled: process.env.NODE_ENV !== 'development',
});
```

### 1.4 Sentry Edge Config

**sentry.edge.config.ts** (root):
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  enabled: process.env.NODE_ENV !== 'development',
});
```

---

## PHẦN 2: Error Boundary (React)

### 2.1 Custom Error Boundary

**src/components/SentryErrorBoundary.tsx**:
```typescript
'use client';

import * as Sentry from '@sentry/nextjs';
import { ErrorBoundary as SentryErrorBoundaryComponent } from '@sentry/nextjs';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface FallbackProps {
  error: Error;
  componentStack: string | null;
  eventId: string | null;
  resetError(): void;
}

function ErrorFallback({ error, eventId, resetError }: FallbackProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by Sentry:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-serif text-[#1E2761] mb-4">
          Đã có lỗi xảy ra
        </h1>
        <p className="text-gray-600 mb-6">
          Chúng tôi đã ghi nhận lỗi này và sẽ khắc phục sớm nhất có thể.
        </p>
        
        {eventId && (
          <p className="text-sm text-gray-400 mb-6">
            Mã lỗi: {eventId}
          </p>
        )}
        
        <div className="flex gap-4 justify-center">
          <Button onClick={resetError} variant="default">
            Thử lại
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  children: React.ReactNode;
}

export function SentryErrorBoundary({ children }: Props) {
  return (
    <SentryErrorBoundaryComponent
      fallback={ErrorFallback}
      onError={(error, componentStack, eventId) => {
        console.log('Error reported to Sentry:', eventId);
      }}
    >
      {children}
    </SentryErrorBoundaryComponent>
  );
}
```

### 2.2 Update _app.tsx

**src/pages/_app.tsx**:
```typescript
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { SentryErrorBoundary } from '@/components/SentryErrorBoundary';
import '@/index.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SentryErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="light">
        <Component {...pageProps} />
      </ThemeProvider>
    </SentryErrorBoundary>
  );
}
```

---

## PHẦN 3: API Route Error Handling

### 3.1 Example API Route with Sentry

**src/pages/api/download/[documentId].ts**:
```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';
import { createServerSupabaseClient, getAuthUser } from '@/lib/auth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  Sentry.setTransactionName('api.download.document');
  
  try {
    const { documentId } = req.query;
    
    Sentry.addBreadcrumb({
      category: 'api',
      message: `Download request for document ${documentId}`,
      level: 'info',
    });
    
    const user = await getAuthUser(req, res);
    
    if (!user) {
      Sentry.addBreadcrumb({
        category: 'auth',
        message: 'Unauthorized download attempt',
        level: 'warning',
      });
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // ... download logic
    
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        api: 'download',
        documentId: req.query.documentId as string,
      },
      extra: {
        userId: req.headers['x-user-id'],
      },
    });
    
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default Sentry.withSentryAPI(handler, 'api/download/[documentId]');
```

---

## PHẦN 4: Custom Error Tracking

### 4.1 Track Custom Errors

**src/lib/errors.ts**:
```typescript
import * as Sentry from '@sentry/nextjs';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function captureAppError(error: AppError) {
  Sentry.captureException(error, {
    tags: {
      errorCode: error.code,
      statusCode: error.statusCode,
    },
    extra: error.context,
  });
}

export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

export function setUserContext(userId: string, email?: string) {
  Sentry.setUser({
    id: userId,
    email: email ? hashEmail(email) : undefined,
  });
}

export function clearUserContext() {
  Sentry.setUser(null);
}

function hashEmail(email: string): string {
  return email.split('@')[0] + '@***';
}
```

---

## PHẦN 5: Performance Monitoring

### 5.1 Custom Transactions

**src/lib/performance.ts**:
```typescript
import * as Sentry from '@sentry/nextjs';

export async function measurePerformance<T>(
  name: string,
  operation: () => Promise<T>,
  tags?: Record<string, string>
): Promise<T> {
  const transaction = Sentry.startTransaction({
    name,
    op: 'function',
    tags,
  });

  try {
    const result = await operation();
    transaction.setStatus('ok');
    return result;
  } catch (error) {
    transaction.setStatus('error');
    throw error;
  } finally {
    transaction.finish();
  }
}
```

### 5.2 Web Vitals

**src/pages/_app.tsx** (thêm vào):
```typescript
import type { NextWebVitalsMetric } from 'next/app';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  import('@sentry/nextjs').then((Sentry) => {
    Sentry.captureMessage(
      `Web Vital: ${metric.name}`,
      metric.label === 'web-vital' ? 'info' : 'debug'
    );
  });
}
```

---

## PHẦN 6: Sentry Dashboard Setup

### 6.1 Project Structure trong Sentry
```
CLB Tri Thức (Organization)
├── clb-website (Project)
│   ├── Issues
│   ├── Performance
│   ├── Replays
│   ├── Alerts
│   └── Releases
```

### 6.2 Alert Rules

**High Priority Alerts**:
- Error rate > 1% trong 5 phút
- New error xuất hiện lần đầu
- Performance regression > 20%

**Setup trong Sentry UI**:
1. Settings → Alerts
2. Create Alert Rule
3. Conditions: `event.severity >= error`
4. Actions: Send email + Slack webhook

### 6.3 Slack Integration
```bash
# Trong Sentry Dashboard
Settings → Integrations → Slack
→ Install → Chọn channel #alerts
```

---

## PHẦN 7: Best Practices

### Security & Privacy
1. **Never log PII** — Hash/remove email, phone, addresses
2. **Filter sensitive headers** — Authorization, Cookie
3. **Mask inputs in Replay** — Passwords, credit cards
4. **Use beforeSend hook** — Review all data before sending

### Sampling Strategy
| Environment | Traces | Replay | Reason |
|-------------|--------|--------|--------|
| Production | 10% | 10% sessions, 100% errors | Cost + Performance |
| Staging | 50% | 50% | Debug ready |
| Development | 0% | 0% | Disable |

### Error Prioritization
1. **P0 (Critical)** — Site down, payment failures
2. **P1 (High)** — Feature broken, user blocked
3. **P2 (Medium)** — Workaround available
4. **P3 (Low)** — Cosmetic issues

---

## Quick Reference

| Task | Code |
|------|------|
| Capture error | `Sentry.captureException(error)` |
| Capture message | `Sentry.captureMessage('text', 'level')` |
| Add breadcrumb | `Sentry.addBreadcrumb({ category, message })` |
| Set user | `Sentry.setUser({ id, email })` |
| Set tag | `Sentry.setTag('key', 'value')` |
| Start transaction | `Sentry.startTransaction({ name })` |

---

## Integration với CI/CD

Xem skill `cicd` để tích hợp Sentry releases vào deployment workflow.

**Release tracking**:
```yaml
- name: Create Sentry Release
  uses: getsentry/action-release@v1
  env:
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
    SENTRY_ORG: clb-tri-thuc
    SENTRY_PROJECT: clb-website
  with:
    environment: production
    version: ${{ github.sha }}
    sourcemaps: './.next'
```
