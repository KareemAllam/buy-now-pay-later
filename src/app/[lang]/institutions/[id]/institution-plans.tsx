import { PlanTemplate } from "@/types/db-json";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, CreditCard } from "lucide-react";
import Link from "next/link";
import { getDictionary, type Locale } from "../../dictionaries";

function formatCurrency(amount: number, locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function calculateMonthlyPayment(totalAmount: number, installmentCount: number): number {
  return Math.round(totalAmount / installmentCount);
}

export function InstitutionPlans({ plans, lang }: { plans: PlanTemplate[]; lang: string }) {
  const dict = getDictionary(lang as Locale);

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{dict.institutions.noPlansAvailable}</h3>
        <p className="text-muted-foreground text-sm">
          {dict.institutions.noPlansDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">{dict.institutions.availablePlans}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const monthlyPayment = calculateMonthlyPayment(plan.total_amount, plan.installment_count);
          const planName = typeof plan.name === 'object'
            ? plan.name[lang as keyof typeof plan.name] || plan.name.en
            : plan.name;

          return (
            <Card
              key={plan.id}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold">{planName}</CardTitle>
                <CardDescription className="text-base font-semibold text-foreground mt-2">
                  {formatCurrency(plan.total_amount, lang)}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      <span className="font-semibold text-foreground">{plan.installment_count}</span> {dict.institutions.monthlyPayments}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <div>
                      <span className="text-muted-foreground">{dict.institutions.monthlyPayment}</span>
                      <span className="ml-2 font-bold text-lg text-foreground">
                        {formatCurrency(monthlyPayment, lang)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4">
                <Button asChild className="w-full" variant="default">
                  <Link href={`/${lang}/apply?plan=${plan.id}`}>
                    {dict.institutions.selectPlan}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

