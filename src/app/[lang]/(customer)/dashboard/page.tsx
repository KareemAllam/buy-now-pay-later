import { AwaitedPageParams } from "@/types/app.types";
import { getDictionary } from "../../dictionaries";
import { CustomerDashboard } from "./customer-dashboard";

export default async function DashboardPage({ params }: AwaitedPageParams) {
  const { lang } = await params;
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

