"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getDictionary, type Locale } from "../../../dictionaries";
import { FileText, Loader2 } from "lucide-react";
import { createApplicationAction } from "./actions";

interface ApplyPlanButtonProps {
  planId: string;
  institutionId: string;
  lang: Locale;
}

export function ApplyPlanButton({ planId, institutionId, lang }: ApplyPlanButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dict = getDictionary(lang);

  const handleApply = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createApplicationAction(institutionId, planId);

      if (!result.success) {
        setError(result.error || 'Failed to submit application');
        setIsLoading(false);
        return;
      }

      // Redirect to applications page
      router.push(`/${lang}/dashboard/applications`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button
        onClick={handleApply}
        disabled={isLoading}
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {(dict as any).apply?.submitting || "Submitting..."}
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            {(dict as any).apply?.submit || "Apply for Plan"}
          </>
        )}
      </Button>
    </div>
  );
}

