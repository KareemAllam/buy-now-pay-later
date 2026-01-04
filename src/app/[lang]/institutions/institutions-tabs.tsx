"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Institution } from "@/types/db-json";
import { School, University } from "lucide-react";
import { useMemo, useState } from "react";
import { InstitutionCard } from "./institution-card";

interface InstitutionsTabsProps {
  institutions: Institution[];
  lang: string;
}

const translations: Record<string, Record<string, string>> = {
  en: {
    all: "All",
    schools: "Schools",
    universities: "Universities",
    noInstitutions: "No institutions available",
    noSchools: "No schools available",
    noUniversities: "No universities available",
    checkBack: "Check back later for new institutions.",
  },
  nl: {
    all: "Alles",
    schools: "Scholen",
    universities: "Universiteiten",
    noInstitutions: "Geen instellingen beschikbaar",
    noSchools: "Geen scholen beschikbaar",
    noUniversities: "Geen universiteiten beschikbaar",
    checkBack: "Kom later terug voor nieuwe instellingen.",
  },
};

export function InstitutionsTabs({ institutions, lang }: InstitutionsTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const t = translations[lang] || translations.en;

  const filteredInstitutions = useMemo(() => {
    if (activeTab === "all") {
      return institutions;
    }
    return institutions.filter(inst => inst.type === activeTab);
  }, [institutions, activeTab]);

  const schoolsCount = institutions.filter(inst => inst.type === 'school').length;
  const universitiesCount = institutions.filter(inst => inst.type === 'university').length;

  const getEmptyStateMessage = () => {
    if (activeTab === 'all') return t.noInstitutions;
    if (activeTab === 'school') return t.noSchools;
    return t.noUniversities;
  };

  return (
    <div>
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            {t.all}
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
              {institutions.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="school" className="gap-2">
            <School className="h-4 w-4" />
            {t.schools}
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
              {schoolsCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="university" className="gap-2">
            <University className="h-4 w-4" />
            {t.universities}
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
              {universitiesCount}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value={activeTab} className="mt-6">
          {filteredInstitutions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <School className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">
                {getEmptyStateMessage()}
              </h2>
              <p className="text-muted-foreground">
                {t.checkBack}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstitutions.map((institution: Institution) => (
                <InstitutionCard key={institution.id} institution={institution} lang={lang} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

