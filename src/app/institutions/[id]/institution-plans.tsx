import { PlanTemplate } from "@/types/db-json";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, CreditCard } from "lucide-react";
import Link from "next/link";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function calculateMonthlyPayment(totalAmount: number, installmentCount: number): number {
  return Math.round(totalAmount / installmentCount);
}

export async function InstitutionPlans({ plans }: { plans: PlanTemplate[] }) {
  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No plans available</h3>
        <p className="text-muted-foreground text-sm">
          This institution doesn't have any payment plans yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Available Payment Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const monthlyPayment = calculateMonthlyPayment(plan.total_amount, plan.installment_count);

          return (
            <Card
              key={plan.id}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="text-base font-semibold text-foreground mt-2">
                  {formatCurrency(plan.total_amount)}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      <span className="font-semibold text-foreground">{plan.installment_count}</span> monthly payments
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <div>
                      <span className="text-muted-foreground">Monthly payment:</span>
                      <span className="ml-2 font-bold text-lg text-foreground">
                        {formatCurrency(monthlyPayment)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4">
                <Button asChild className="w-full" variant="default">
                  <Link href={`/apply?plan=${plan.id}`}>
                    Select Plan
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