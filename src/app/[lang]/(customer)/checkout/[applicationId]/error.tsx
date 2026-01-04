"use client";
import { getDictionary, Locale } from '@/app/[lang]/dictionaries';
import { use } from 'react';

export default function Error({
  error,
  reset,
  params,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  params: { lang: string };
}) {
  return (
    <main>
      <article className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{error.message}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {error.message}
          </p>
        </div>
      </article>
    </main>
  );
}