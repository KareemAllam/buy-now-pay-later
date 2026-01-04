import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Institution } from "@/types/db-json";
import { School, University } from "lucide-react";
import { getDictionary } from "../dictionaries";
import { Locale } from "@/proxy";
import { InstitutionCard } from "./institution-card";

interface InstitutionsTabsProps {
  institutions: Institution[];
  lang: Locale;
}

export function InstitutionsTabs({ institutions, lang }: InstitutionsTabsProps) {
  const dictionary = getDictionary(lang).institutions;

  const schools = institutions.filter(inst => inst.type === 'school');
  const schoolsCount = schools.length;

  const universities = institutions.filter(inst => inst.type === 'university');
  const universitiesCount = universities.length;

  return (
    <section>
      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            {dictionary.all}
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
              {institutions.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger value="school" className="gap-2">
            <School className="h-4 w-4" />
            {dictionary.schools}
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
              {schoolsCount}
            </Badge>
          </TabsTrigger>

          <TabsTrigger value="university" className="gap-2">
            <University className="h-4 w-4" />
            {dictionary.universities}
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
              {universitiesCount}
            </Badge>
          </TabsTrigger>

        </TabsList>

        {/* Tab Content */}
        <TabsContent value="all" className="mt-6">
          {
            schoolsCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {institutions.map((institution) => (
                  <InstitutionCard key={institution.id} institution={institution} lang={lang} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <School className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">{dictionary.noSchools}</h2>
                <p className="text-muted-foreground">{dictionary.checkBack}</p>
              </div>
            )
          }
        </TabsContent>
        <TabsContent value="school" className="mt-6">
          {
            schoolsCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schools.map((institution) => (
                  <InstitutionCard key={institution.id} institution={institution} lang={lang} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <School className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">{dictionary.noSchools}</h2>
                <p className="text-muted-foreground">{dictionary.checkBack}</p>
              </div>
            )
          }
        </TabsContent>
        <TabsContent value="university" className="mt-6">
          {
            universitiesCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {universities.map((institution) => (
                  <InstitutionCard key={institution.id} institution={institution} lang={lang} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <University className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold mb-2">{dictionary.noUniversities}</h2>
                <p className="text-muted-foreground">{dictionary.checkBack}</p>
              </div>
            )
          }
        </TabsContent>
      </Tabs>
    </section>
  );
}

