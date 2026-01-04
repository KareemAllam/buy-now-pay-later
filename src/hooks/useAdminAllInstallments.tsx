import { getAllInstallmentPlans } from "@/services/installments";
import { QueryKey, useQuery } from "@tanstack/react-query";

export function useAdminAllInstallments() {
  return useQuery({
    queryKey: ['admin', 'installments', 'all'] as QueryKey,
    queryFn: () => getAllInstallmentPlans(),
  });
}

