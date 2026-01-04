import { UserApplications } from "@/components/modules/customer/dashboard/user-applications";
import { UserInstallments } from "@/components/modules/customer/dashboard/user-installments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDictionary, Locale } from "../../dictionaries";

export function CustomerDashboard({ lang }: { lang: Locale }) {
  const dict = getDictionary(lang);
  return (
    <section>
      {/* Tabs */}
      <Tabs defaultValue="applications" className="mb-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <TabsList>
          <TabsTrigger value="applications" className="gap-2">
            {dict.applications.title}
          </TabsTrigger>
          <TabsTrigger value="installments" className="gap-2">
            {dict.installments.title}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="applications" className="mt-6">
          <UserApplications lang={lang} />
        </TabsContent>
        <TabsContent value="installments" className="mt-6">
          <UserInstallments lang={lang} />
        </TabsContent>
      </Tabs>
    </section>
  );
}