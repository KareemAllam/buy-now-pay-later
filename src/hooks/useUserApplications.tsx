
import { CacheTagKeys } from "@/lib/tagKeys";
import { getUserApplications } from "@/services/applications";
import { QueryKey, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useUserApplications() {
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  return useQuery({
    queryKey: [...CacheTagKeys.applications(userId)] as QueryKey,
    queryFn: () => getUserApplications(userId),
    enabled: !!userId,
  });
}