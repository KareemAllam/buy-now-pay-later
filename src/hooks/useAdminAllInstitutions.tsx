import { CacheTagKeys } from "@/lib/tagKeys";
import { getAllInstitutions } from "@/services/institutions";
import { QueryKey, useQuery } from "@tanstack/react-query";

export function useAdminAllInstitutions() {
  return useQuery({
    queryKey: [...CacheTagKeys.all_institutions] as QueryKey,
    queryFn: () => getAllInstitutions(),
  });
}

