import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Institution, InstitutionType, InstitutionGender } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { School, Users, University, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

function InstitutionTypeBadge({ type }: { type: InstitutionType }) {
  return (
    <Badge variant={type === 'university' ? 'default' : 'secondary'}>
      <School className="mr-1 h-3 w-3" />
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
    <Badge variant="outline">
      <Users className="mr-1 h-3 w-3" />
      {genderLabels[gender]}
    </Badge>
  );
}

export function InstitutionCard({ institution }: { institution: Institution }) {
  return (
    <Card
      key={institution.id}
      className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-row p-0"
    >
      {/* Image Section - Left */}
      <div className="relative w-48 h-full min-h-[180px] bg-linear-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center border-r overflow-hidden ">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
        {institution.type === 'university' ? (
          <University className="relative h-16 w-16 text-primary/60 group-hover:text-primary transition-colors duration-300 z-10" />
        ) : (
          <School className="relative h-16 w-16 text-primary/60 group-hover:text-primary transition-colors duration-300 z-10" />
        )}
      </div>

      {/* Content Section - Right */}
      <div className="flex flex-col flex-1 p-6">
        {/* Header */}
        <CardHeader className="p-0 mb-3">
          <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {institution.name}
          </CardTitle>
        </CardHeader>

        {/* Description */}
        <CardDescription className="flex flex-col gap-3 mb-4 flex-1">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{institution.location}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <InstitutionTypeBadge type={institution.type} />
            <GenderBadge gender={institution.gender} />
          </div>
        </CardDescription>

        {/* View Details Button */}
        <CardContent className="p-0 pt-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            <Link href={`/institutions/${institution.id}`} className="gap-1.5">
              View Details
              <ArrowRight className="h-4 w-4 group-hover/button:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
