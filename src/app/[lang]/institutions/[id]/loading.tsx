import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function PlanCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-5 w-1/2" />
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}

export default function InstitutionDetailLoading() {
  return (
    <main>
      <article className="container mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <Button variant="outline" className="mb-8" disabled>
          <Skeleton className="h-4 w-4 mr-2" />
          <Skeleton className="h-4 w-40" />
        </Button>

        {/* Institution Details Section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
            <div className="flex-1">
              {/* Institution Name */}
              <Skeleton className="h-12 w-3/4 mb-4" />

              {/* Location */}
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-6 w-48" />
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section>
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <PlanCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}

