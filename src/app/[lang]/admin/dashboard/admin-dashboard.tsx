'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Locale } from "../../dictionaries";
import { InstitutionsTab } from "../../../../components/modules/admin/dashboard/institutions-tab";
import { ApplicationsTab } from "../../../../components/modules/admin/dashboard/applications-tab";
import { InstallmentPlansTab } from "../../../../components/modules/admin/dashboard/installment-plans-tab";

export function AdminDashboard({ lang }: { lang: Locale }) {
  return (
    <section>
      <Tabs defaultValue="institutions" className="mb-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <TabsList>
          <TabsTrigger value="institutions" className="gap-2">
            Institutions
          </TabsTrigger>
          <TabsTrigger value="applications" className="gap-2">
            Applications
          </TabsTrigger>
          <TabsTrigger value="installment-plans" className="gap-2">
            Installment Plans
          </TabsTrigger>
        </TabsList>
        <TabsContent value="institutions" className="mt-6">
          <InstitutionsTab lang={lang} />
        </TabsContent>
        <TabsContent value="applications" className="mt-6">
          <ApplicationsTab lang={lang} />
        </TabsContent>
        <TabsContent value="installment-plans" className="mt-6">
          <InstallmentPlansTab lang={lang} />
        </TabsContent>
      </Tabs>
    </section>
  );
}

