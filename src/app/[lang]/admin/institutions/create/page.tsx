import { getDictionary, hasLocale } from "../../../dictionaries";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { CreateInstitutionForm } from "./create-institution-form";

export default async function CreateInstitutionPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

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

  const dict = getDictionary(lang as any);

  return (
    <main>
      <article className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Create Institution
        </h1>
        <p className="text-muted-foreground mb-6">
          Add a new institution to the system
        </p>
        <CreateInstitutionForm lang={lang as any} />
      </article>
    </main>
  );
}

