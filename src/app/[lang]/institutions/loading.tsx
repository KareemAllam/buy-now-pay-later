import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

function InstitutionCardSkeleton() {
  return (
    <Card className="flex flex-row p-0 overflow-hidden">
      {/* Image Section - Left */}
      <div className="w-48 h-[180px] border-r">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content Section - Right */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Location */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Badges */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        {/* Button */}
        <Skeleton className="h-9 w-32 rounded-full mt-auto" />
      </div>
    </Card>
  );
}

export default function InstitutionsLoading() {
  return (
    <main>
      <article className="container mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <Skeleton className="h-10 w-64 mb-3" />
          <Skeleton className="h-6 w-full max-w-2xl" />
          <Skeleton className="h-6 w-4/5 max-w-2xl mt-2" />
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-6">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </div>

        {/* Institutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <InstitutionCardSkeleton key={i} />
          ))}
        </div>
      </article>
    </main>
  );
}

