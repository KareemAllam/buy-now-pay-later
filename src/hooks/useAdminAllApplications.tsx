import { getAllApplications } from "@/services/applications";
import { QueryKey, useQuery } from "@tanstack/react-query";

export function useAdminAllApplications() {
  return useQuery({
    queryKey: ['admin', 'applications', 'all'] as QueryKey,
    queryFn: () => getAllApplications(),
  });
}

