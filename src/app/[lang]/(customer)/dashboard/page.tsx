import { AwaitedPageParams } from "@/types/app.types";
import { getDictionary } from "../../dictionaries";
import { CustomerDashboard } from "./customer-dashboard";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage({ params }: AwaitedPageParams) {
  const { lang } = await params;
  
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${lang}/signin`);
  }

  if (session.user.role !== 'customer') {
    redirect(`/${lang}/admin/dashboard`);
  }

  const dict = getDictionary(lang);

  return (
    <main>
      <article className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {dict.auth.dashboard?.title || "Dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {dict.auth.dashboard?.description || "Welcome to your dashboard"}
          </p>
        </div>
        <CustomerDashboard lang={lang} />
      </article>
    </main>
  );
}

