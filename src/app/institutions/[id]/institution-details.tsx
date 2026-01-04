import { Badge } from "@/components/ui/badge";
import { Institution, InstitutionGender, InstitutionType } from "@/types";
import { MapPin, School, University, Users } from "lucide-react";

function InstitutionTypeBadge({ type }: { type: InstitutionType }) {
  return (
    <Badge variant={type === 'university' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
      {type === 'university' ? (
        <University className="mr-1.5 h-3.5 w-3.5" />
      ) : (
        <School className="mr-1.5 h-3.5 w-3.5" />
      )}
      {type === 'university' ? 'University' : 'School'}
    </Badge>
  );
}

function GenderBadge({ gender }: { gender: InstitutionGender }) {
  const genderLabels: Record<InstitutionGender, string> = {
    male: 'Boys',
    female: 'Girls',
    mixed: 'Mixed',
  };

  return (
    <Badge variant="outline" className="text-sm px-3 py-1">
      <Users className="mr-1.5 h-3.5 w-3.5" />
      {genderLabels[gender]}
    </Badge>
  );
}


export default function InstitutionDetails({ institution }: { institution: Institution }) {
  const { name, location, type, gender } = institution;
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
      <div className="flex-1">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          {institution.name}
        </h1>
        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-lg">{institution.location}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <InstitutionTypeBadge type={institution.type} />
          <GenderBadge gender={institution.gender} />
        </div>
      </div>
    </div>
  );
}