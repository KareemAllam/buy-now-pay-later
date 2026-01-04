import { Button } from "@/components/ui/button";
import { getInstitution, getVisibleInstitutions } from "@/services/institutions";
import { getPlansOfInstitution } from "@/services/plans";
import { AwaitedPageParams } from "@/types/app.types";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale, Locale } from "../../dictionaries";
import Loading from "../loading";
import InstitutionDetails from "./institution-details";
import { InstitutionPlans } from "./institution-plans";

type Props = {
  params: Promise<{ id: string; lang: Locale }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


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

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const { id, lang } = await params

  if (!lang || !id || !hasLocale(lang)) {
    return {
      title: 'Institution not found',
      description: 'Institution not found',
    };
  }

  const institution = await getInstitution(id);
  const plans = await getPlansOfInstitution(id);

  if (!institution || !plans) {
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

export default async function InstitutionPage({ params }: AwaitedPageParams<{ id: string }>) {
  const pagParams = await params;

  if (!pagParams?.lang || !pagParams?.id) {
    <Loading />
  }

  const dict = getDictionary(pagParams?.lang);

  const institution = await getInstitution(pagParams?.id);
  const plans = await getPlansOfInstitution(pagParams?.id);


  if (!institution || !plans) {
    return notFound();
  }
  return (
    <main>
      <article className="container mx-auto px-4 py-8 md:py-12">
        <Button asChild variant="ghost" className="mb-8">
          <Link href={`/${pagParams?.lang}/institutions`}>
            <ArrowLeft className="h-4 w-4" />
            {dict.institutions.backToInstitutions}
          </Link>
        </Button>

        <section className="mb-8">
          <InstitutionDetails institution={institution} lang={pagParams?.lang} />
        </section>
        <section>
          <InstitutionPlans plans={plans ?? []} lang={pagParams?.lang} />
        </section>
      </article>
    </main>
  );
}

