import { Metadata } from "next";
import { getVisibleInstitutions } from "@/services/institutions";
import { getDictionary, hasLocale } from "../dictionaries";
import { InstitutionsTabs } from "./institutions-tabs";
import { AwaitedPageParams } from "@/types/app.types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const pageParams = await params;

  if (!hasLocale(pageParams?.lang)) {
    return {
      title: "Browse our Institutions",
      description: "Browse our network of schools and universities",
    };
  }

  const dict = getDictionary(pageParams?.lang);

  return {
    title: dict.institutions.title,
    description: dict.institutions.description,
  };
}

export default async function InstitutionsPage({ params }: AwaitedPageParams) {
  const pageParams = await params;
  const dict = getDictionary(pageParams?.lang);
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

        <InstitutionsTabs institutions={institutions} lang={pageParams?.lang} />
      </article>
    </main>
  );
}

