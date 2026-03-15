'use client';

import * as Sentry from '@sentry/nextjs';
import { ErrorBoundary as SentryErrorBoundaryComponent } from '@sentry/nextjs';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface FallbackProps {
  error: unknown;
  componentStack: string;
  eventId: string;
  resetError(): void;
}

function ErrorFallback({ error, eventId, resetError }: FallbackProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by Sentry:', error instanceof Error ? error.message : error);
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
