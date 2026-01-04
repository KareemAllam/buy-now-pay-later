import { Button } from '@/components/ui/button';
import { SearchX, ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';
import { getDictionary, hasLocale } from '../../dictionaries';
import { notFound } from 'next/navigation';

export default async function NotFound({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const pagParams = await params;

  if (!pagParams?.lang || !hasLocale(pagParams?.lang)) {
    notFound();
  }

  const dict = getDictionary(pagParams?.lang);

  return (
    <main>
      <article className="container mx-auto px-4 py-8 md:py-12">
        <Button asChild variant="outline" className="mb-8">
          <Link href={`/${pagParams?.lang}/institutions`}>
            <ArrowLeft className="h-4 w-4" />
            {dict.institutions.backToInstitutions}
          </Link>
        </Button>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl opacity-50" />
              <SearchX className="h-16 w-16 text-muted-foreground mb-4 relative z-10" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">{dict.notFound.title}</h1>

          <p className="text-foreground font-medium mb-3 max-w-md text-lg">
            {dict.notFound.description}
          </p>

          <p className="text-muted-foreground text-sm mb-8 max-w-lg">
            {dict.notFound.details}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="default" size="lg">
              <Link href={`/${pagParams?.lang}/institutions`}>
                <Building2 className="h-4 w-4" />
                {dict.notFound.browseAllInstitutions}
              </Link>
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t w-full max-w-md">
            <p className="text-xs text-muted-foreground">
              {dict.notFound.helpText}
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}

