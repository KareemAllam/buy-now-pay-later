"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDictionary, type Locale } from "../../../dictionaries";
import { Loader2, CreditCard } from "lucide-react";
import { processMonthlyPaymentAction } from "./actions";
import { formatCurrency } from "@/utils";

interface InstallmentPaymentFormProps {
  installmentPlanId: string;
  amount: number;
  remainingBalance: number;
  lang: Locale;
}

export function InstallmentPaymentForm({
  installmentPlanId,
  amount,
  remainingBalance,
  lang,
}: InstallmentPaymentFormProps) {
  const [paymentAmount, setPaymentAmount] = useState<string>(amount.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dict = getDictionary(lang);

  const paymentAmountNum = parseFloat(paymentAmount) || 0;
  const isValid = paymentAmountNum > 0 && paymentAmountNum <= remainingBalance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValid) {
      setError(dict.installments?.paymentFailed || "Invalid payment amount");
      return;
    }

    setIsLoading(true);

    try {
      const result = await processMonthlyPaymentAction(installmentPlanId, paymentAmountNum);

      if (!result.success) {
        setError(result.error || dict.installments?.paymentFailed || 'Failed to process payment');
        setIsLoading(false);
        return;
      }

      // Refresh the page to show updated data
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.installments?.paymentFailed || 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Payment Amount Input */}
      <div className="space-y-2">
        <Label htmlFor="paymentAmount" className="text-base font-semibold">
          {dict.installments?.amount || "Payment Amount"} *
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            id="paymentAmount"
            type="number"
            min="0"
            max={remainingBalance}
            step="0.01"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="0.00"
            className="pl-8"
            required
            disabled={isLoading}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {dict.installments?.remaining || "Maximum"}: {formatCurrency(remainingBalance, lang)}
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={!isValid || isLoading}
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {dict.installments?.processing || "Processing..."}
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            {dict.installments?.payNow || "Pay Now"}
          </>
        )}
      </Button>
    </form>
  );
}

