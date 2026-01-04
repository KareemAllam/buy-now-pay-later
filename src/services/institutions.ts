import { CacheTagKeys } from "@/lib/tagKeys";
import { Institution, PlanTemplate } from "@/types/db-json.types";
import { fetchWithErrorHandling } from "@/lib/fetch-utils";
import { BackendError } from "@/lib/errors";

const API_URL = process.env.NEXT_PUBLIC_API_JSON_SERVER;

export async function getVisibleInstitutions(): Promise<Institution[]> {
  const response = await fetchWithErrorHandling<Institution[]>(
    `${API_URL}/institutions?is_visible=true`,
    {
      cache: 'force-cache',
      errorContext: 'fetch institutions',
      allowEmpty404: true,
    }
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to fetch institutions', response.statusCode, response.statusText);
  }

  return response.data ?? [];
}

export async function getInstitution(id: string): Promise<Institution | null> {
  const response = await fetchWithErrorHandling<Institution | null>(
    `${API_URL}/institutions/${id}`,
    {
      cache: 'force-cache',
      next: {
        revalidate: 60 * 60 * 24,
        tags: CacheTagKeys.institution(id),
      },
      allow404: true,
      errorContext: 'fetch institution',
    }
  );

  if (!response.success) {
    // If 404 is allowed, return null
    if (response.statusCode === 404) {
      return null;
    }
    throw new BackendError(response.error || 'Failed to fetch institution', response.statusCode, response.statusText);
  }

  return response.data ?? null;
}

export async function getInstitutionWithPlan(id: string): Promise<Institution & { plans: PlanTemplate[] } | null> {
  const response = await fetchWithErrorHandling<Institution & { plans: PlanTemplate[] } | null>(
    `${API_URL}/institutions/${id}?_embed=plans`,
    {
      cache: 'force-cache',
      next: {
        revalidate: 60 * 60 * 24,
        tags: CacheTagKeys.institution(id),
      },
      allow404: true,
      errorContext: 'fetch institution with plans',
    }
  );

  if (!response.success) {
    // If 404 is allowed, return null
    if (response.statusCode === 404) {
      return null;
    }
    throw new BackendError(response.error || 'Failed to fetch institution with plans', response.statusCode, response.statusText);
  }

  return response.data ?? null;
}