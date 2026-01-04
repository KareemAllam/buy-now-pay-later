import { getDictionary, hasLocale } from "../../dictionaries";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage({
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
          {dict.auth.adminDashboard?.title || "Admin Dashboard"}
        </h1>
        <p className="text-muted-foreground">
          {dict.auth.adminDashboard?.description || "Welcome to the admin dashboard"}
        </p>
      </article>
    </main>
  );
}

