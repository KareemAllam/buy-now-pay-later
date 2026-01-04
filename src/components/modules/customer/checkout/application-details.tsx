import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { Application } from "@/types/db-json.types";
import { Dictionary } from "@/app/[lang]/dictionaries";
import { formatCurrency } from "@/utils";

interface ApplicationDetailsProps {
  application: Application;
  dict: Dictionary;
  lang: string;
}

export function ApplicationDetails({ application, dict, lang }: ApplicationDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {(dict as any).checkout?.applicationDetails || "Application Details"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {(dict as any).applications?.id || "Application ID"}
          </span>
          <span className="font-mono text-sm">{application.id}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {(dict as any).checkout?.tuitionAmount || "Tuition Amount"}
          </span>
          <span className="font-semibold">{formatCurrency(application.tuition_amount, lang)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

