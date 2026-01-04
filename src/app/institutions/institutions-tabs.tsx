"use client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Institution } from "@/types/db-json";
import { School, University } from "lucide-react";
import { useMemo, useState } from "react";
import { InstitutionCard } from "./institution-card";


interface InstitutionsTabsProps {
  institutions: Institution[];
}

export function InstitutionsTabs({ institutions }: InstitutionsTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredInstitutions = useMemo(() => {
    if (activeTab === "all") {
      return institutions;
    }
    return institutions.filter(inst => inst.type === activeTab);
  }, [institutions, activeTab]);

  const schoolsCount = institutions.filter(inst => inst.type === 'school').length;
  const universitiesCount = institutions.filter(inst => inst.type === 'university').length;

  return (
    <div>
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            All
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
              {institutions.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="school" className="gap-2">
            <School className="h-4 w-4" />
            Schools
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5 text-xs">
              {schoolsCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="university" className="gap-2">
            <University className="h-4 w-4" />
            Universities
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
                No {activeTab === 'all' ? 'institutions' : activeTab === 'school' ? 'schools' : 'universities'} available
              </h2>
              <p className="text-muted-foreground">
                Check back later for new institutions.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstitutions.map((institution: Institution) => (
                <InstitutionCard key={institution.id} institution={institution} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

