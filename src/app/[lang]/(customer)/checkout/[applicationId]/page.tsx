import { getApplication } from "@/services/applications";
import { getInstitution } from "@/services/institutions";
import { getPlan } from "@/services/plans";
import { AwaitedPageParams } from "@/types/app.types";
import { notFound, redirect } from "next/navigation";
import { hasLocale, getDictionary, type Locale } from "../../../dictionaries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutForm } from "./checkout-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApplicationDetails } from "@/components/modules/customer/checkout/application-details";
import { InstitutionDetails } from "@/components/modules/customer/checkout/institution-details";
import { PlanDetails } from "@/components/modules/customer/checkout/plan-details";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function CheckoutPage({
  params
}: AwaitedPageParams<{ applicationId: string }>) {
  const { lang, applicationId } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${lang}/signin`);
  }

  if (session.user.role !== 'customer') {
    redirect(`/${lang}/admin/dashboard`);
  }

  const dict = getDictionary(lang as Locale);


  const application = await getApplication(applicationId);

  if (!application) {
    notFound();
  }

  // Verify application belongs to current user
  if (application.userId !== session.user.id) {
    redirect(`/${lang}/dashboard`);
  }

  const institution = (application as any).institution || await getInstitution(application.institutionId);
  const plan = (application as any).plan || await getPlan(application.planId);

  if (!institution || !plan) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      {/* Back Button */}
      <Link href={`/${lang}/dashboard/applications`}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {dict.common.back}
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {(dict as any).checkout?.title || "Checkout"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {(dict as any).checkout?.description || "Review your application details and complete your payment"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <ApplicationDetails
            application={application}
            dict={dict}
            lang={lang}
          />

          <InstitutionDetails
            institution={institution}
            dict={dict}
            lang={lang}
          />

          <PlanDetails
            plan={plan}
            dict={dict}
            lang={lang}
          />
        </div>

        {/* Right Column - Checkout Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>{(dict as any).checkout?.payment || "Payment"}</CardTitle>
              <CardDescription>
                {(dict as any).checkout?.completePayment || "Complete your payment to activate your plan"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CheckoutForm
                applicationId={application.id}
                planId={plan.id}
                totalAmount={plan.total_amount}
                lang={lang as Locale}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}