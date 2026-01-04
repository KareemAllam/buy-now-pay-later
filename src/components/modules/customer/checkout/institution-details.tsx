import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { School, MapPin } from "lucide-react";
import { Institution } from "@/types/db-json.types";
import { Dictionary } from "@/app/[lang]/dictionaries";

interface InstitutionDetailsProps {
  institution: Institution;
  dict: Dictionary;
  lang: string;
}

export function InstitutionDetails({ institution, dict, lang }: InstitutionDetailsProps) {
  // Get localized strings
  const institutionName = typeof institution.name === 'object'
    ? institution.name[lang as keyof typeof institution.name] || institution.name.en
    : institution.name;

  const institutionLocation = typeof institution.location === 'object'
    ? institution.location[lang as keyof typeof institution.location] || institution.location.en
    : institution.location;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="h-5 w-5" />
          {(dict as any).checkout?.institutionDetails || "Institution"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">{institutionName}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{institutionLocation}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">
            {institution.type === 'university'
              ? dict.institutions.type.university
              : dict.institutions.type.school}
          </Badge>
          <Badge variant="outline">
            {dict.institutions.gender[institution.gender as keyof typeof dict.institutions.gender]}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

