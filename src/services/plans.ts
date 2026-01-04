import { CacheTagKeys } from "@/lib/tagKeys";
import { PlanTemplate } from "@/types/db-json.types";
import { NotFoundError } from "@/lib/errors";
import { fetchWithErrorHandling } from "@/lib/fetch-utils";

const API_URL = process.env.NEXT_PUBLIC_API_JSON_SERVER;

export async function getPlansOfInstitution(institution_id: string): Promise<PlanTemplate[]> {
  return fetchWithErrorHandling<PlanTemplate[]>(
    `${API_URL}/plans?institution_id=${institution_id}`,
    {
      cache: 'force-cache',
      next: {
        tags: CacheTagKeys.institutionPlans(institution_id),
      },
      allowEmpty404: true,
      errorContext: 'fetch plans',
    }
  );
}

export async function getPlan(planId: string): Promise<PlanTemplate> {
  const plan = await fetchWithErrorHandling<PlanTemplate>(
    `${API_URL}/plans/${planId}`,
    {
      errorContext: 'fetch plan',
    }
  );

  if (!plan) {
    throw new NotFoundError('Plan not found');
  }

  return plan;
}