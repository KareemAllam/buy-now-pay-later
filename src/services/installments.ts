import { InstallmentPlan, Institution, PlanTemplate } from "@/types/db-json.types";
import { fetchWithErrorHandling } from "@/lib/fetch-utils";
import { CacheTagKeys } from "@/lib/tagKeys";
import { BackendError, NotFoundError } from "@/lib/errors";

const API_URL = process.env.NEXT_PUBLIC_API_JSON_SERVER;

export type TUserInstallment = InstallmentPlan & {
  institution: Institution
  plan: PlanTemplate;
};

export async function getUserInstallments(userId: string): Promise<TUserInstallment[]> {
  const response = await fetchWithErrorHandling<TUserInstallment[]>(
    `${API_URL}/installment_plans?userId=${userId}&_expand=institution&_expand=plan`,
    {
      cache: 'force-cache',
      errorContext: 'fetch user installments',
      allowEmpty404: true,
      next: {
        tags: CacheTagKeys.installments(userId),
      },
    });

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to fetch user installments', response.statusCode, response.statusText);
  }

  return response.data ?? [];
}

export async function getInstallmentFromApplication(applicationId: string): Promise<InstallmentPlan> {
  const response = await fetchWithErrorHandling<InstallmentPlan>(
    `${API_URL}/installment_plans?applicationId=${applicationId}`,
    {
      errorContext: 'fetch installment plan from application',
    },
  );

  if (!response.success) {
    if (response.statusCode === 404) {
      throw new NotFoundError(response.error || 'Installment plan not found');
    }
    throw new BackendError(response.error || 'Failed to fetch installment plan', response.statusCode, response.statusText);
  }

  if (!response.data) {
    throw new NotFoundError('Installment plan not found');
  }

  return response.data;
}

export async function createInstallmentPlan(data: Omit<InstallmentPlan, 'id'>): Promise<InstallmentPlan> {
  const response = await fetchWithErrorHandling<InstallmentPlan>(
    `${API_URL}/installment_plans`,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      errorContext: 'create installment plan',
    },
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to create installment plan', response.statusCode, response.statusText);
  }

  if (!response.data) {
    throw new BackendError('Failed to create installment plan: No data returned', response.statusCode, response.statusText);
  }

  return response.data;
}

/**
 * Get a single installment plan by ID
 */
export async function getInstallmentPlan(id: string): Promise<InstallmentPlan | null> {
  const response = await fetchWithErrorHandling<InstallmentPlan | null>(
    `${API_URL}/installment_plans/${id}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch installment plan',
      allow404: true,
    },
  );

  if (!response.success) {
    if (response.statusCode === 404) {
      return null;
    }
    throw new BackendError(response.error || 'Failed to fetch installment plan', response.statusCode, response.statusText);
  }

  return response.data ?? null;
}

/**
 * Get installment plan by ID with related data (institution and plan)
 */
export async function getInstallmentPlanWithDetails(id: string): Promise<TUserInstallment | null> {
  const response = await fetchWithErrorHandling<TUserInstallment | null>(
    `${API_URL}/installment_plans/${id}?_expand=institution&_expand=plan`,
    {
      cache: 'force-cache',
      errorContext: 'fetch installment plan with details',
      allow404: true,
    },
  );

  if (!response.success) {
    if (response.statusCode === 404) {
      return null;
    }
    throw new BackendError(response.error || 'Failed to fetch installment plan with details', response.statusCode, response.statusText);
  }

  return response.data ?? null;
}

/**
 * Get all installment plans
 */
export async function getAllInstallmentPlans(): Promise<InstallmentPlan[]> {
  const response = await fetchWithErrorHandling<InstallmentPlan[]>(
    `${API_URL}/installment_plans`,
    {
      cache: 'force-cache',
      errorContext: 'fetch all installment plans',
      allowEmpty404: true,
    },
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to fetch all installment plans', response.statusCode, response.statusText);
  }

  return response.data ?? [];
}

/**
 * Get installment plans by status
 */
export async function getInstallmentPlansByStatus(status: InstallmentPlan['status']): Promise<InstallmentPlan[]> {
  const response = await fetchWithErrorHandling<InstallmentPlan[]>(
    `${API_URL}/installment_plans?status=${status}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch installment plans by status',
      allowEmpty404: true,
    },
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to fetch installment plans by status', response.statusCode, response.statusText);
  }

  return response.data ?? [];
}

/**
 * Get installment plans by institution ID
 */
export async function getInstallmentPlansByInstitution(institutionId: string): Promise<InstallmentPlan[]> {
  const response = await fetchWithErrorHandling<InstallmentPlan[]>(
    `${API_URL}/installment_plans?institutionId=${institutionId}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch installment plans by institution',
      allowEmpty404: true,
    },
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to fetch installment plans by institution', response.statusCode, response.statusText);
  }

  return response.data ?? [];
}

/**
 * Get installment plans by plan template ID
 */
export async function getInstallmentPlansByPlanId(planId: string): Promise<InstallmentPlan[]> {
  const response = await fetchWithErrorHandling<InstallmentPlan[]>(
    `${API_URL}/installment_plans?planId=${planId}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch installment plans by plan template',
      allowEmpty404: true,
    },
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to fetch installment plans by plan template', response.statusCode, response.statusText);
  }

  return response.data ?? [];
}

/**
 * Update an existing installment plan
 */
export async function updateInstallmentPlan(
  id: string,
  data: Partial<Omit<InstallmentPlan, 'id' | 'created_at'>>
): Promise<InstallmentPlan> {
  const response = await fetchWithErrorHandling<InstallmentPlan>(
    `${API_URL}/installment_plans/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      errorContext: 'update installment plan',
    },
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to update installment plan', response.statusCode, response.statusText);
  }

  if (!response.data) {
    throw new BackendError('Failed to update installment plan: No data returned', response.statusCode, response.statusText);
  }

  return response.data;
}

/**
 * Delete an installment plan
 */
export async function deleteInstallmentPlan(id: string): Promise<InstallmentPlan> {
  const response = await fetchWithErrorHandling<InstallmentPlan>(
    `${API_URL}/installment_plans/${id}`,
    {
      method: 'DELETE',
      errorContext: 'delete installment plan',
    },
  );

  if (!response.success) {
    if (response.statusCode === 404) {
      throw new NotFoundError(response.error || 'Installment plan not found');
    }
    throw new BackendError(response.error || 'Failed to delete installment plan', response.statusCode, response.statusText);
  }

  if (!response.data) {
    throw new BackendError('Failed to delete installment plan: No data returned', response.statusCode, response.statusText);
  }

  return response.data;
}