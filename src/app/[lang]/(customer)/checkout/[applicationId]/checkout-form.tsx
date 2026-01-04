"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { getDictionary, type Locale } from "../../../dictionaries";
import { Loader2, CreditCard } from "lucide-react";
import { processDownPaymentAction } from "./actions";

interface CheckoutFormProps {
  applicationId: string;
  planId: string;
  totalAmount: number;
  lang: Locale;
}

export function CheckoutForm({ applicationId, planId, totalAmount, lang }: CheckoutFormProps) {
  const [downPayment, setDownPayment] = useState<string>("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dict = getDictionary(lang);

  const downPaymentNum = parseFloat(downPayment) || 0;
  const isValid = acceptedTerms && downPaymentNum > 0 && downPaymentNum <= totalAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValid) {
      setError((dict as any).checkout?.errors?.invalidInput || "Please fill all required fields correctly");
      return;
    }

    setIsLoading(true);

    try {
      const result = await processDownPaymentAction(applicationId, planId, downPaymentNum);

      setIsLoading(false);
      if (!result.success) {
        setError(result.error || 'Failed to process payment');
        return;
      }

      window.location.href = `/${lang}/dashboard`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Down Payment Input */}
      <div className="space-y-2">
        <Label htmlFor="downPayment" className="text-base font-semibold">
          {(dict as any).checkout?.downPayment || "Down Payment"} *
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            id="downPayment"
            type="number"
            min="0"
            max={totalAmount}
            step="0.01"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            placeholder="0.00"
            className="pl-8"
            required
            disabled={isLoading}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {(dict as any).checkout?.downPaymentHint || `Maximum: $${totalAmount.toLocaleString()}`}
        </p>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start gap-3 space-y-0">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
          disabled={isLoading}
          required
        />
        <div className="space-y-1">
          <Label
            htmlFor="terms"
            className="text-sm font-normal cursor-pointer"
          >
            {(dict as any).checkout?.acceptTerms || "I accept the terms and conditions"} *
          </Label>
          <p className="text-xs text-muted-foreground">
            {(dict as any).checkout?.termsDescription || "By checking this box, you agree to the payment terms and conditions"}
          </p>
        </div>
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
            {(dict as any).checkout?.processing || "Processing..."}
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            {(dict as any).checkout?.submit || "Complete Payment"}
          </>
        )}
      </Button>
    </form>
  );
}

