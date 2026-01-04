'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, WifiOff, ServerCrash } from 'lucide-react';
import Link from 'next/link';
import { getErrorType, ErrorType, isOnline } from '@/lib/errors';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isClientOnline, setIsClientOnline] = useState(true);
  const errorType = getErrorType(error);

  useEffect(() => {
    // Log error to error reporting service
    console.error('Institutions page error:', error);

    // Check online status
    setIsClientOnline(isOnline());

    // Listen for online/offline events
    const handleOnline = () => setIsClientOnline(true);
    const handleOffline = () => setIsClientOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error]);

  // Determine error details based on type
  const getErrorDetails = () => {
    switch (errorType) {
      case ErrorType.NETWORK_ERROR:
        return {
          icon: WifiOff,
          title: 'Connection Error',
          message: isClientOnline
            ? 'Unable to connect to the server. Please check your internet connection and try again.'
            : 'You are currently offline. Please check your internet connection and try again.',
          description: 'This could be due to a poor network connection or the server being temporarily unavailable.',
        };
      case ErrorType.BACKEND_ERROR:
        return {
          icon: ServerCrash,
          title: 'Service Error',
          message: error.message || 'The backend service encountered an error while processing your request.',
          description: 'Our servers are experiencing issues. Please try again in a few moments. If the problem persists, contact support.',
        };
      default:
        return {
          icon: AlertCircle,
          title: 'Something Went Wrong',
          message: error.message || 'An unexpected error occurred while loading institutions.',
          description: 'Please try again. If the problem persists, contact support.',
        };
    }
  };

  const errorDetails = getErrorDetails();
  const IconComponent = errorDetails.icon;

  return (
    <main>
      <article className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Browse Institutions</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore our network of schools and universities. Find the perfect institution
            that matches your educational goals and preferences.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6">
            <div className="relative">
              <IconComponent className="h-16 w-16 text-destructive mb-4" />
              {errorType === ErrorType.NETWORK_ERROR && !isClientOnline && (
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full border-2 border-background" />
              )}
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-2">{errorDetails.title}</h2>

          <p className="text-foreground font-medium mb-3 max-w-md">
            {errorDetails.message}
          </p>

          <p className="text-muted-foreground text-sm mb-6 max-w-lg">
            {errorDetails.description}
          </p>

          <div className="flex gap-4">
            <Button onClick={reset} variant="default" disabled={!isClientOnline && errorType === ErrorType.NETWORK_ERROR}>
              Try again
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go home</Link>
            </Button>
          </div>

          {errorType === ErrorType.NETWORK_ERROR && !isClientOnline && (
            <p className="text-xs text-muted-foreground mt-4">
              Waiting for connection...
            </p>
          )}
        </div>
      </article>
    </main>
  );
}