
import { CacheTagKeys } from "@/lib/tagKeys";
import { getUserApplications } from "@/services/applications";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useUserApplications() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  return useQuery({
    // @ts-ignore
    queryKey: [...CacheTagKeys.applications(userId)] as QueryKey,
    queryFn: () => getUserApplications(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}