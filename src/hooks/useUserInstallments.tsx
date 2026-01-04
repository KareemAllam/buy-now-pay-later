import { getUserInstallments } from "@/services/installments";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { CacheTagKeys } from "@/lib/tagKeys";

export function useUserInstallments() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  return useQuery({
    queryKey: [...CacheTagKeys.installments(userId), 'user-installments'] as QueryKey,
    queryFn: () => getUserInstallments(userId),
  });
}