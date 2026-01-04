import { Badge } from "@/components/ui/badge";
import { Institution, InstitutionGender, InstitutionType } from "@/types";
import { MapPin, School, University, Users } from "lucide-react";
import { getDictionary, type Locale } from "../../dictionaries";

function InstitutionTypeBadge({ type, lang }: { type: InstitutionType; lang: Locale }) {
  const dict = getDictionary(lang);
  return (
    <Badge variant={type === 'university' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
      {type === 'university' ? (
        <University className="mr-1.5 h-3.5 w-3.5" />
      ) : (
        <School className="mr-1.5 h-3.5 w-3.5" />
      )}
      {dict.institutions.type[type]}
    </Badge>
  );
}

function GenderBadge({ gender, lang }: { gender: InstitutionGender; lang: Locale }) {
  const dict = getDictionary(lang);
  return (
    <Badge variant="outline" className="text-sm px-3 py-1">
      <Users className="mr-1.5 h-3.5 w-3.5" />
      {dict.institutions.gender[gender]}
    </Badge>
  );
}

export default function InstitutionDetails({ institution, lang }: { institution: Institution; lang: Locale }) {
  const name = institution.name[lang] || institution.name.en;

  const location = institution.location[lang] || institution.location.en;

  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          {name}
        </h1>
        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-lg">{location}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <InstitutionTypeBadge type={institution.type} lang={lang as Locale} />
          <GenderBadge gender={institution.gender} lang={lang as Locale} />
        </div>
      </div>
    </div>
  );
}

