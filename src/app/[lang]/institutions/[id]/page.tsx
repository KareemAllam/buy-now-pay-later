import { Button } from "@/components/ui/button";
import { getVisibleInstitutions, getInstitutionWithPlan } from "@/services/institutions";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InstitutionDetails from "./institution-details";
import { InstitutionPlans } from "./institution-plans";
import { getDictionary, hasLocale } from "../../dictionaries";

export async function generateStaticParams() {
  const institutions = await getVisibleInstitutions();
  const locales = ['en', 'ar'];

  return institutions.flatMap((institution) =>
    locales.map((lang) => ({
      lang,
      id: institution.id,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}): Promise<Metadata> {
  const { id, lang } = await params;

  if (!hasLocale(lang)) {
    return {
      title: 'Institution not found',
      description: 'Institution not found',
    };
  }

  const institution = await getInstitutionWithPlan(id);
  if (!institution) {
    const dict = getDictionary(lang);
    return {
      title: dict.notFound.title,
      description: dict.notFound.description,
    };
  }
  return {
    title: institution?.name.en,
    description: `Buy in installments with ${institution?.name.en}`,
  };
}

export default async function InstitutionPage({
  params,
}: {
  params: Promise<{ id: string; lang: string }>;
}) {
  const { id, lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = getDictionary(lang);
  const institutionWithPlan = await getInstitutionWithPlan(id)

  if (!institutionWithPlan) {
    return notFound();
  }
  return (
    <main>
      <article className="container mx-auto px-4 py-8 md:py-12">
        <Button asChild variant="outline" className="mb-8">
          <Link href={`/${lang}/institutions`}>
            <ArrowLeft className="h-4 w-4" />
            {dict.institutions.backToInstitutions}
          </Link>
        </Button>

        <section className="mb-8">
          <InstitutionDetails institution={institutionWithPlan} lang={lang} />
        </section>
        <section>
          <InstitutionPlans plans={institutionWithPlan.plans ?? []} lang={lang} />
        </section>
      </article>
    </main>
  );
}

