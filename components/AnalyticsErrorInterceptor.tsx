'use client';

import { useEffect } from 'react';

export default function AnalyticsErrorInterceptor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event &&
        event.reason &&
        (event.reason.name === 'AnalyticsSDKApiError' ||
          (event.reason.message && typeof event.reason.message === 'string' && event.reason.message.includes('Failed to fetch')))
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
