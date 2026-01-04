import { Button } from "@/components/ui/button";
import { getInstitution, getInstitutions } from "@/services/institutions";
import { getPlansOfInstitution } from "@/services/plans";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InstitutionDetails from "./institution-details";
import { InstitutionPlans } from "./institution-plans";
import { getDictionary, hasLocale } from "../../dictionaries";

export async function generateStaticParams() {
  const institutions = await getInstitutions();
  const locales = ['en', 'nl'];
  
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
  
  const institution = await getInstitution(id);
  if (!institution) {
    const dict = await getDictionary(lang);
    return {
      title: dict.notFound.title,
      description: dict.notFound.description,
    };
  }
  return {
    title: institution?.name,
    description: `Buy in installments with ${institution?.name}`,
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

  const dict = await getDictionary(lang);
  const institution = await getInstitution(id);
  const plans = await getPlansOfInstitution(id);

  if (!institution) {
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
          <InstitutionDetails institution={institution} lang={lang} />
        </section>
        <section>
          <InstitutionPlans plans={plans ?? []} lang={lang} />
        </section>
      </article>
    </main>
  );
}

