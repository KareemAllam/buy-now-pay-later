import { Metadata } from "next";
import { School } from "lucide-react";
import { InstitutionsTabs } from "./institutions-tabs";
import { getInstitutions } from "@/services/institutions";

export const metadata: Metadata = {
  title: "Browse our Institutions",
  description: "Browse our network of schools and universities",
};

export default async function InstitutionsPage() {
  const institutions = await getInstitutions();

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

        {/* Institutions Tabs */}
        {institutions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <School className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No institutions available</h2>
            <p className="text-muted-foreground">
              Check back later for new institutions.
            </p>
          </div>
        ) : (
          <InstitutionsTabs institutions={institutions} />
        )}
      </article>
    </main>
  );
}
