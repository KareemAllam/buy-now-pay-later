import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Calendar } from "lucide-react";
import { PlanTemplate } from "@/types/db-json.types";
import { Dictionary } from "@/app/[lang]/dictionaries";
import { formatCurrency, calculateMonthlyPayment } from "@/utils";

interface PlanDetailsProps {
  plan: PlanTemplate;
  dict: Dictionary;
  lang: string;
}

export function PlanDetails({ plan, dict, lang }: PlanDetailsProps) {
  // Get localized strings
  const planName = typeof plan.name === 'object'
    ? plan.name[lang as keyof typeof plan.name] || plan.name.en
    : plan.name;

  const monthlyPayment = calculateMonthlyPayment(plan.total_amount, plan.installment_count);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          {(dict as any).checkout?.planDetails || "Payment Plan"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">{planName}</h3>
          <CardDescription className="text-base font-semibold text-foreground mt-2">
            {formatCurrency(plan.total_amount, lang)}
          </CardDescription>
        </div>

        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{dict.institutions.monthlyPayments || "Monthly payments"}</span>
            </div>
            <span className="font-semibold">
              {plan.installment_count} {dict.institutions.monthlyPayments || "payments"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {dict.institutions.monthlyPayment || "Monthly payment"}
            </span>
            <span className="font-bold text-lg">
              {formatCurrency(monthlyPayment, lang)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

