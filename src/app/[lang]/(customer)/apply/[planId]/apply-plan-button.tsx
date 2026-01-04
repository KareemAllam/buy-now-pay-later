"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getDictionary, type Locale } from "../../../dictionaries";
import { FileText, Loader2 } from "lucide-react";
import { createApplicationAction } from "./actions";
import { useQueryClient } from "@tanstack/react-query";
import { CacheTagKeys } from "@/lib/tagKeys";
import { useSession } from "next-auth/react";

interface ApplyPlanButtonProps {
  planId: string;
  institutionId: string;
  lang: Locale;
}

export function ApplyPlanButton({ planId, institutionId, lang }: ApplyPlanButtonProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";
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

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: [...CacheTagKeys.applications(userId)] });
      queryClient.invalidateQueries({ queryKey: [...CacheTagKeys.installments(userId), 'user-installments'] });

      router.push(`/${lang}/dashboard`);
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

