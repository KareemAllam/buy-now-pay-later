import { getDictionary, hasLocale } from "../../../../dictionaries";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getInstitution } from "@/services/institutions";
import { DeleteInstitutionForm } from "./delete-institution-form";

export default async function DeleteInstitutionPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${lang}/signin`);
  }

  if (session.user.role !== 'admin') {
    redirect(`/${lang}/dashboard`);
  }

  const institution = await getInstitution(id);

  if (!institution) {
    notFound();
  }

  const dict = getDictionary(lang as any);

  return (
    <main>
      <article className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Delete Institution
        </h1>
        <p className="text-muted-foreground mb-6">
          Are you sure you want to delete this institution?
        </p>
        <DeleteInstitutionForm institution={institution} lang={lang as any} />
      </article>
    </main>
  );
}

