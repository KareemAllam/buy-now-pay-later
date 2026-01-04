import { CacheTagKeys } from "@/lib/tagKeys";
import { PlanTemplate } from "@/types/db-json.types";
import { NotFoundError, BackendError } from "@/lib/errors";
import { fetchWithErrorHandling } from "@/lib/fetch-utils";

const API_URL = process.env.NEXT_PUBLIC_API_JSON_SERVER;

export async function getPlansOfInstitution(institution_id: string): Promise<PlanTemplate[]> {
  const response = await fetchWithErrorHandling<PlanTemplate[]>(
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

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to fetch plans', response.statusCode, response.statusText);
  }

  return response.data ?? [];
}

export async function getPlan(planId: string): Promise<PlanTemplate> {
  const response = await fetchWithErrorHandling<PlanTemplate>(
    `${API_URL}/plans/${planId}`,
    {
      errorContext: 'fetch plan',
    }
  );

  if (!response.success) {
    if (response.statusCode === 404) {
      throw new NotFoundError(response.error || 'Plan not found');
    }
    throw new BackendError(response.error || 'Failed to fetch plan', response.statusCode, response.statusText);
  }

  if (!response.data) {
    throw new NotFoundError('Plan not found');
  }

  return response.data;
}

export async function getAllPlans(): Promise<PlanTemplate[]> {
  const response = await fetchWithErrorHandling<PlanTemplate[]>(
    `${API_URL}/plans`,
    {
      cache: 'no-store',
      errorContext: 'fetch all plans',
      allowEmpty404: true,
    }
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to fetch all plans', response.statusCode, response.statusText);
  }

  return response.data ?? [];
}