import { Button } from '@/components/ui/button';
import { SearchX, ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <article className="container mx-auto px-4 py-8 md:py-12">
        <Button asChild variant="outline" className="mb-8">
          <Link href="/institutions">
            <ArrowLeft className="h-4 w-4" />
            Back to Institutions
          </Link>
        </Button>

        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl opacity-50" />
              <SearchX className="h-16 w-16 text-muted-foreground mb-4 relative z-10" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Institution Not Found</h1>

          <p className="text-foreground font-medium mb-3 max-w-md text-lg">
            The institution you're looking for doesn't exist or may have been removed.
          </p>

          <p className="text-muted-foreground text-sm mb-8 max-w-lg">
            The page you requested could not be found. It may have been moved, deleted, or the URL might be incorrect.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild variant="default" size="lg">
              <Link href="/institutions">
                <Building2 className="h-4 w-4" />
                Browse All Institutions
              </Link>
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t w-full max-w-md">
            <p className="text-xs text-muted-foreground">
              Need help? Check that the URL is correct or browse our available institutions.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}

