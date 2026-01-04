import { InstallmentPlan, Institution, PlanTemplate } from "@/types/db-json.types";
import { fetchWithErrorHandling } from "@/lib/fetch-utils";
import { CacheTagKeys } from "@/lib/tagKeys";

const API_URL = process.env.NEXT_PUBLIC_API_JSON_SERVER;

export type TUserInstallment = InstallmentPlan & {
  institution: Institution
  plan: PlanTemplate;
};

export async function getUserInstallments(userId: string): Promise<TUserInstallment[]> {
  return fetchWithErrorHandling<TUserInstallment[]>(
    `${API_URL}/installment_plans?userId=${userId}&_embed=institution&_embed=plan`,
    {
      cache: 'force-cache',
      errorContext: 'fetch user installments',
      next: {
        tags: CacheTagKeys.installments(userId),
      },
    });
}


export async function getInstallmentFromApplication(applicationId: string): Promise<InstallmentPlan> {
  return fetchWithErrorHandling<InstallmentPlan>(
    `${API_URL}/installment_plans?applicationId=${applicationId}`,
    {
      errorContext: 'fetch installment plan from application',
    },
  );
}

export async function createInstallmentPlan(data: Omit<InstallmentPlan, 'id'>): Promise<InstallmentPlan> {
  return fetchWithErrorHandling<InstallmentPlan>(
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
}

/**
 * Get a single installment plan by ID
 */
export async function getInstallmentPlan(id: string): Promise<InstallmentPlan | null> {
  return fetchWithErrorHandling<InstallmentPlan | null>(
    `${API_URL}/installment_plans/${id}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch installment plan',
      allow404: true,
    },
  );
}

/**
 * Get installment plan by ID with related data (institution and plan)
 */
export async function getInstallmentPlanWithDetails(id: string): Promise<TUserInstallment | null> {
  return fetchWithErrorHandling<TUserInstallment | null>(
    `${API_URL}/installment_plans/${id}?_embed=institution&_embed=plan`,
    {
      cache: 'force-cache',
      errorContext: 'fetch installment plan with details',
      allow404: true,
    },
  );
}

/**
 * Get all installment plans
 */
export async function getAllInstallmentPlans(): Promise<InstallmentPlan[]> {
  return fetchWithErrorHandling<InstallmentPlan[]>(
    `${API_URL}/installment_plans`,
    {
      cache: 'force-cache',
      errorContext: 'fetch all installment plans',
      allowEmpty404: true,
    },
  );
}

/**
 * Get installment plans by status
 */
export async function getInstallmentPlansByStatus(status: InstallmentPlan['status']): Promise<InstallmentPlan[]> {
  return fetchWithErrorHandling<InstallmentPlan[]>(
    `${API_URL}/installment_plans?status=${status}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch installment plans by status',
      allowEmpty404: true,
    },
  );
}

/**
 * Get installment plans by institution ID
 */
export async function getInstallmentPlansByInstitution(institutionId: string): Promise<InstallmentPlan[]> {
  return fetchWithErrorHandling<InstallmentPlan[]>(
    `${API_URL}/installment_plans?institutionId=${institutionId}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch installment plans by institution',
      allowEmpty404: true,
    },
  );
}

/**
 * Get installment plans by plan template ID
 */
export async function getInstallmentPlansByPlanId(planId: string): Promise<InstallmentPlan[]> {
  return fetchWithErrorHandling<InstallmentPlan[]>(
    `${API_URL}/installment_plans?planId=${planId}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch installment plans by plan template',
      allowEmpty404: true,
    },
  );
}

/**
 * Update an existing installment plan
 */
export async function updateInstallmentPlan(
  id: string,
  data: Partial<Omit<InstallmentPlan, 'id' | 'created_at'>>
): Promise<InstallmentPlan> {
  return fetchWithErrorHandling<InstallmentPlan>(
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
}

/**
 * Delete an installment plan
 */
export async function deleteInstallmentPlan(id: string): Promise<InstallmentPlan> {
  return fetchWithErrorHandling<InstallmentPlan>(
    `${API_URL}/installment_plans/${id}`,
    {
      method: 'DELETE',
      errorContext: 'delete installment plan',
    },
  );
}