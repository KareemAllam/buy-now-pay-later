import { notFound } from "next/navigation";
import { hasLocale, getDictionary, type Locale } from "../../../dictionaries";
import { getPlan } from "@/services/plans";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApplyPlanButton } from "./apply-plan-button";
import { AwaitedPageParams } from "@/types/app.types";
import { formatCurrency, calculateMonthlyPayment } from "@/utils";

export default async function ApplyPage({ params }: AwaitedPageParams<{ lang: string, planId: string }>) {
  const { lang, planId } = await params;
  const plan = await getPlan(planId);

  if (!plan) {
    notFound();
  }
  const dict = getDictionary(lang as Locale);

  const planName = typeof plan.name === 'object'
    ? plan.name[lang as keyof typeof plan.name] || plan.name.en
    : plan.name;

  const monthlyPayment = calculateMonthlyPayment(plan.total_amount, plan.installment_count);

  console.log({ plan })

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      {/* Back Button */}
      <Link href={`/${lang}/institutions/${plan.institutionId}`}>
        <Button variant="ghost" className="mb-6 cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {dict.common.back}
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {(dict as any).apply?.title || "Apply for Plan"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {(dict as any).apply?.description || "Review the plan details and submit your application"}
        </p>
      </div>

      {/* Plan Details Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{planName}</CardTitle>
          <CardDescription className="text-xl font-semibold text-foreground mt-2">
            {formatCurrency(plan.total_amount, lang)}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Plan Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {dict.institutions.monthlyPayments || "Monthly payments"}
                </p>
                <p className="text-lg font-semibold">
                  {plan.installment_count} {dict.institutions.monthlyPayments || "monthly payments"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {dict.institutions.monthlyPayment || "Monthly payment"}
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(monthlyPayment, lang)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {(dict as any).apply?.totalAmount || "Total amount"}
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(plan.total_amount, lang)}
                </p>
              </div>
            </div>
          </div>

          {/* Application Info */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">
              {(dict as any).apply?.whatHappensNext || "What happens next?"}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">1.</span>
                <span>{(dict as any).apply?.step1 || "Submit your application for review"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">2.</span>
                <span>{(dict as any).apply?.step2 || "Admin will review your application"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">3.</span>
                <span>{(dict as any).apply?.step3 || "If approved, proceed to checkout and make down payment"}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">4.</span>
                <span>{(dict as any).apply?.step4 || "Start making monthly payments"}</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Apply Button */}
      <Card>
        <CardContent className="pt-6">
          <ApplyPlanButton
            planId={plan.id}
            institutionId={plan.institutionId}
            lang={lang as Locale}
          />
        </CardContent>
      </Card>
    </div>
  );
}