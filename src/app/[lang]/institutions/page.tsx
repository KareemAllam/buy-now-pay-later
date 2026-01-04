import { Metadata } from "next";
import { School } from "lucide-react";
import { getVisibleInstitutions } from "@/services/institutions";
import { getDictionary, hasLocale } from "../dictionaries";
import { notFound } from "next/navigation";
import { InstitutionsTabs } from "./institutions-tabs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {
      title: "Browse our Institutions",
      description: "Browse our network of schools and universities",
    };
  }

  const dict = getDictionary(lang);

  return {
    title: dict.institutions.title,
    description: dict.institutions.description,
  };
}

export default async function InstitutionsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const institutions = await getVisibleInstitutions();

  return (
    <main>
      <article className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-12 flex flex-col items-start">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{dict.institutions.title}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {dict.institutions.description}
          </p>
        </div>

        {/* Institutions Tabs */}
        {institutions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <School className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">{dict.institutions.noInstitutions}</h2>
            <p className="text-muted-foreground">
              {dict.institutions.noInstitutionsDescription}
            </p>
          </div>
        ) : (
          <InstitutionsTabs institutions={institutions} lang={lang} />
        )}
      </article>
    </main>
  );
}

