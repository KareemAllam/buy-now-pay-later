import { Button } from "@/components/ui/button";
import { getInstitution, getInstitutions } from "@/services/institutions";
import { getPlansOfInstitution } from "@/services/plans";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InstitutionDetails from "./institution-details";
import { InstitutionPlans } from "./institution-plans";

export async function generateStaticParams() {
  const institutions = await getInstitutions();
  return institutions.map((institution) => ({
    params: {
      id: institution.id,
    },
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const institution = await getInstitution(id);
  if (!institution) {
    return {
      title: 'Institution not found',
      description: 'Institution not found',
    };
  }
  return {
    title: institution?.name,
    description: `Buy in installments with ${institution?.name}`,
  };
}

export default async function InstitutionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const institution = await getInstitution(id);
  const plans = await getPlansOfInstitution(id);

  if (!institution) {
    return notFound();
  }

  return (
    <main>
      <article className="container mx-auto px-4 py-8 md:py-12">
        <Button asChild variant="outline" className="mb-8">
          <Link href="/institutions">
            <ArrowLeft className="h-4 w-4" />
            Back to Institutions
          </Link>
        </Button>

        <section className="mb-8">
          <InstitutionDetails institution={institution} />
        </section>
        <section>
          <InstitutionPlans plans={plans ?? []} />
        </section>
      </article>
    </main>
  );
}