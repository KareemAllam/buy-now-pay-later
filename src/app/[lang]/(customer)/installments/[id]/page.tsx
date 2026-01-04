import { getInstallmentPlanWithDetails } from "@/services/installments";
import { getPaymentsByInstallmentId } from "@/services/payment";
import { AwaitedPageParams } from "@/types/app.types";
import { notFound, redirect } from "next/navigation";
import { hasLocale, getDictionary, type Locale } from "../../../dictionaries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Calendar, DollarSign } from "lucide-react";
import Link from "next/link";
import { formatCurrency, calculateMonthlyPayment } from "@/utils";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { InstallmentPaymentForm } from "./installment-payment-form";

export default async function InstallmentDetailsPage({
  params
}: AwaitedPageParams<{ id: string }>) {
  const { lang, id } = await params;

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
  const installment = await getInstallmentPlanWithDetails(id);

  if (!installment) {
    notFound();
  }

  // Verify installment belongs to current user
  if (installment.userId !== session.user.id) {
    redirect(`/${lang}/dashboard`);
  }

  const payments = await getPaymentsByInstallmentId(id);
  const progress = installment.total_amount > 0
    ? (installment.paid_amount / installment.total_amount) * 100
    : 0;

  const monthlyPayment = calculateMonthlyPayment(
    installment.remaining_balance,
    installment.installment_count
  );

  const planName = typeof installment.plan.name === 'object'
    ? installment.plan.name[lang as keyof typeof installment.plan.name] || installment.plan.name.en
    : installment.plan.name;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      {/* Back Button */}
      <Link href={`/${lang}/dashboard`}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {dict.common.back}
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {dict.installments?.title || "Installment Plan Details"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {planName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{dict.installments?.plan || "Plan Summary"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{dict.installments?.institution || "Institution"}</span>
                <span className="font-semibold">{installment.institution.name[lang]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{dict.installments?.totalAmount || "Total Amount"}</span>
                <span className="font-semibold">{formatCurrency(installment.total_amount, lang)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{dict.installments?.paidAmount || "Paid Amount"}</span>
                <span className="font-semibold text-green-600">{formatCurrency(installment.paid_amount, lang)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{dict.installments?.remaining || "Remaining Balance"}</span>
                <span className="font-semibold text-orange-600">{formatCurrency(installment.remaining_balance, lang)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{dict.installments?.status || "Status"}</span>
                <Badge
                  variant={
                    installment.status === 'active'
                      ? 'success'
                      : installment.status === 'completed'
                        ? 'default'
                        : installment.status === 'cancelled'
                          ? 'error'
                          : 'warning'
                  }
                >
                  {installment.status === 'approved_awaiting_checkout' 
                    ? (dict.installments?.awaitingCheckout || 'Awaiting Checkout')
                    : installment.status}
                </Badge>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{dict.installments?.progress || "Progress"}</span>
                  <span className="text-sm font-semibold">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>{dict.installments?.paymentHistory || "Payment History"}</CardTitle>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  {dict.installments?.noPayments || "No payments yet"}
                </p>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded">
                          {payment.payment_type === 'down_payment' ? (
                            <CreditCard className="h-4 w-4" />
                          ) : (
                            <Calendar className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {payment.payment_type === 'down_payment' 
                              ? (dict.checkout?.downPayment || "Down Payment")
                              : (dict.installments?.payMonthly || "Monthly Payment")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.created_at).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(payment.amount, lang)}</p>
                        <Badge
                          variant={
                            payment.status === 'completed'
                              ? 'success'
                              : payment.status === 'failed'
                                ? 'error'
                                : 'warning'
                          }
                          className="text-xs"
                        >
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Payment Form */}
        {installment.status === 'active' && installment.remaining_balance > 0 && (
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>{dict.installments?.payMonthly || "Pay Monthly Installment"}</CardTitle>
                <CardDescription>
                  {dict.installments?.nextPayment || "Make your next payment"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {dict.installments?.amount || "Amount"}
                    </span>
                    <span className="text-lg font-bold">
                      {formatCurrency(monthlyPayment, lang)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dict.installments?.remaining || "Remaining"}: {formatCurrency(installment.remaining_balance, lang)}
                  </p>
                </div>
                <InstallmentPaymentForm
                  installmentPlanId={installment.id}
                  amount={monthlyPayment}
                  remainingBalance={installment.remaining_balance}
                  lang={lang as Locale}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

