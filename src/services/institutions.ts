import { CacheTagKeys } from "@/lib/tagKeys";
import { Institution, PlanTemplate } from "@/types/db-json.types";
import { fetchWithErrorHandling } from "@/lib/fetch-utils";

const API_URL = process.env.NEXT_PUBLIC_API_JSON_SERVER;

export async function getVisibleInstitutions(): Promise<Institution[]> {
  return fetchWithErrorHandling<Institution[]>(
    `${API_URL}/institutions?is_visible=true`,
    {
      cache: 'force-cache',
      errorContext: 'fetch institutions',
    }
  );
}

export async function getInstitution(id: string): Promise<Institution | null> {
  return fetchWithErrorHandling<Institution | null>(
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
}

export async function getInstitutionWithPlan(id: string): Promise<Institution & { plans: PlanTemplate[] } | null> {
  return fetchWithErrorHandling<Institution & { plans: PlanTemplate[] } | null>(
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
}