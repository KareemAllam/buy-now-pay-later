import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Institution, InstitutionType, InstitutionGender } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { School, Users, University, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getDictionary } from "../dictionaries";
import { type Locale } from "@/app/[lang]/dictionaries";

function InstitutionTypeBadge({ type, lang }: { type: InstitutionType; lang: Locale }) {
  const dictionary = getDictionary(lang).institutions;
  return (
    <Badge variant={type === 'university' ? 'default' : 'secondary'}>
      <School className="mr-1 h-3 w-3" />
      {dictionary.type[type]}
    </Badge>
  );
}

function GenderBadge({ gender, lang }: { gender: InstitutionGender; lang: Locale }) {
  const dictionary = getDictionary(lang).institutions;
  return (
    <Badge variant="outline">
      <Users className="mr-1 h-3 w-3" />
      {dictionary.gender[gender]}
    </Badge>
  );
}

export function InstitutionCard({ institution, lang }: { institution: Institution; lang: Locale }) {
  const dictionary = getDictionary(lang).institutions;
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
            {institution.name[lang]}
          </CardTitle>
        </CardHeader>

        {/* Description */}
        <CardDescription className="flex flex-col gap-3 mb-4 flex-1">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{institution.location[lang]}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <InstitutionTypeBadge type={institution.type} lang={lang} />
            <GenderBadge gender={institution.gender} lang={lang} />
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
            <Link href={`/${lang}/institutions/${institution.id}`} className="gap-1.5">
              {dictionary.viewDetails}
              <ArrowRight className="h-4 w-4 group-hover/button:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}

