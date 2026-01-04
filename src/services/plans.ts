import { CacheTagKeys } from "@/lib/tagKeys";
import { PlanTemplate } from "@/types/db-json.types";
import { NetworkError, BackendError, ErrorType, NotFoundError, } from "@/lib/errors";

export async function getPlansOfInstitution(institution_id: string): Promise<PlanTemplate[]> {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_JSON_SERVER + '/plans' + '?institution_id=' + institution_id,
      {
        cache: 'force-cache',
        next: {
          tags: CacheTagKeys.institutionPlans(institution_id),
        },
      }
    );
    if (!response.ok) {
      if (response.status === 404) {
        return []; // 404 means no plans found, which is acceptable
      }
      throw new BackendError(
        `Failed to fetch plans: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }
    const plans: Array<PlanTemplate> = await response.json();
    return plans;
  } catch (error) {
    console.error('Failed to fetch plans:', error);

    // Re-throw if it's already a custom error
    if (error instanceof NetworkError || error instanceof BackendError) {
      throw error;
    }

    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError('Unable to connect to the server. Please check your internet connection.');
    }

    // Default to network error for unknown fetch failures
    throw new NetworkError('Network connection failed. Please check your internet connection.');
  }
}


export async function getPlan(planId: string): Promise<PlanTemplate | undefined> {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_JSON_SERVER + '/plans/' + planId);
    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundError('Plan not found');
      }
      throw new BackendError(
        `Failed to fetch plan: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }
    const plan: PlanTemplate = await response.json();
    return plan;
  } catch (error) {
    console.error('Failed to fetch plans:', error);

    // Re-throw if it's already a custom error
    if (error instanceof NetworkError || error instanceof BackendError) {
      throw error;
    }

    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError('Unable to connect to the server. Please check your internet connection.');
    }

    // Default to network error for unknown fetch failures
    throw new NetworkError('Network connection failed. Please check your internet connection.');
  }
}