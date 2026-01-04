'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, WifiOff, ServerCrash } from 'lucide-react';
import Link from 'next/link';
import { getErrorType, ErrorType, isOnline } from '@/lib/errors';
import { use } from 'react';

const translations: Record<string, Record<string, string>> = {
  en: {
    title: "Browse Institutions",
    description: "Explore our network of schools and universities. Find the perfect institution that matches your educational goals and preferences.",
    connectionError: "Connection Error",
    connectionErrorDescription: "Unable to connect to the server. Please check your internet connection and try again.",
    offlineDescription: "You are currently offline. Please check your internet connection and try again.",
    connectionErrorDetails: "This could be due to a poor network connection or the server being temporarily unavailable.",
    serviceError: "Service Error",
    serviceErrorDescription: "The backend service encountered an error while processing your request.",
    serviceErrorDetails: "Our servers are experiencing issues. Please try again in a few moments. If the problem persists, contact support.",
    somethingWentWrong: "Something Went Wrong",
    somethingWentWrongDescription: "An unexpected error occurred while loading institutions.",
    genericErrorDetails: "Please try again. If the problem persists, contact support.",
    tryAgain: "Try again",
    goHome: "Go home",
    waitingForConnection: "Waiting for connection...",
  },
  nl: {
    title: "Blader door Instellingen",
    description: "Verken ons netwerk van scholen en universiteiten. Vind de perfecte instelling die aansluit bij uw onderwijsdoelen en voorkeuren.",
    connectionError: "Verbindingsfout",
    connectionErrorDescription: "Kan geen verbinding maken met de server. Controleer uw internetverbinding en probeer het opnieuw.",
    offlineDescription: "U bent momenteel offline. Controleer uw internetverbinding en probeer het opnieuw.",
    connectionErrorDetails: "Dit kan te wijten zijn aan een slechte netwerkverbinding of dat de server tijdelijk niet beschikbaar is.",
    serviceError: "Servicefout",
    serviceErrorDescription: "De backend-service heeft een fout ondervonden bij het verwerken van uw verzoek.",
    serviceErrorDetails: "Onze servers ondervinden problemen. Probeer het over een paar momenten opnieuw. Als het probleem aanhoudt, neem contact op met ondersteuning.",
    somethingWentWrong: "Er is iets misgegaan",
    somethingWentWrongDescription: "Er is een onverwachte fout opgetreden bij het laden van instellingen.",
    genericErrorDetails: "Probeer het opnieuw. Als het probleem aanhoudt, neem contact op met ondersteuning.",
    tryAgain: "Probeer opnieuw",
    goHome: "Ga naar home",
    waitingForConnection: "Wachten op verbinding...",
  },
};

export default function Error({
  error,
  reset,
  params,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const [isClientOnline, setIsClientOnline] = useState(true);
  const errorType = getErrorType(error);
  const t = translations[lang] || translations.en;

  useEffect(() => {
    console.error('Institutions page error:', error);
    setIsClientOnline(isOnline());
    
    const handleOnline = () => setIsClientOnline(true);
    const handleOffline = () => setIsClientOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error]);

  const getErrorDetails = () => {
    switch (errorType) {
      case ErrorType.NETWORK_ERROR:
        return {
          icon: WifiOff,
          title: t.connectionError,
          message: isClientOnline ? t.connectionErrorDescription : t.offlineDescription,
          description: t.connectionErrorDetails,
        };
      case ErrorType.BACKEND_ERROR:
        return {
          icon: ServerCrash,
          title: t.serviceError,
          message: error.message || t.serviceErrorDescription,
          description: t.serviceErrorDetails,
        };
      default:
        return {
          icon: AlertCircle,
          title: t.somethingWentWrong,
          message: error.message || t.somethingWentWrongDescription,
          description: t.genericErrorDetails,
        };
    }
  };

  const errorDetails = getErrorDetails();
  const IconComponent = errorDetails.icon;

  return (
    <main>
      <article className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t.title}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {t.description}
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
              {t.tryAgain}
            </Button>
            <Button asChild variant="outline">
              <Link href={`/${lang}`}>{t.goHome}</Link>
            </Button>
          </div>

          {errorType === ErrorType.NETWORK_ERROR && !isClientOnline && (
            <p className="text-xs text-muted-foreground mt-4">
              {t.waitingForConnection}
            </p>
          )}
        </div>
      </article>
    </main>
  );
}

