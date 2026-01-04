import { Application, Institution, PlanTemplate } from "@/types/db-json.types";
import { fetchWithErrorHandling } from "@/lib/fetch-utils";
import { CacheTagKeys } from "@/lib/tagKeys";
import { BackendError, NotFoundError } from "@/lib/errors";

const API_URL = process.env.NEXT_PUBLIC_API_JSON_SERVER;

export type TUserApplication = Application & { institution: Institution, plan: PlanTemplate };

export async function getUserApplications(userId: string): Promise<TUserApplication[]> {
  const response = await fetchWithErrorHandling<TUserApplication[]>(
    `${API_URL}/applications?user_id=${userId}?&_embed=plan&_embed=institution`,
    {
      next: {
        tags: CacheTagKeys.applications(userId),
      },
      errorContext: 'fetch applications',
      allowEmpty404: true,
    },
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to fetch applications', response.statusCode, response.statusText);
  }

  return response.data ?? [];
}

export async function getApplication(id: string): Promise<TUserApplication> {
  const response = await fetchWithErrorHandling<TUserApplication>(
    `${API_URL}/applications/${id}?&_embed=plan&_embed=institution`,
    {
      errorContext: 'fetch application',
    },
  );

  if (!response.success) {
    if (response.statusCode === 404) {
      throw new NotFoundError(response.error || 'Application not found');
    }
    throw new BackendError(response.error || 'Failed to fetch application', response.statusCode, response.statusText);
  }

  if (!response.data) {
    throw new NotFoundError('Application not found');
  }

  return response.data;
}

export async function createApplication(data: Omit<Application, 'id' | 'created_at'>): Promise<Application> {
  const response = await fetchWithErrorHandling<Application>(
    `${API_URL}/applications`,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      errorContext: 'create application',
    },
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to create application', response.statusCode, response.statusText);
  }

  if (!response.data) {
    throw new BackendError('Failed to create application: No data returned', response.statusCode, response.statusText);
  }

  return response.data;
}

export async function updateApplication(id: string, data: Application): Promise<Application> {
  const response = await fetchWithErrorHandling<Application>(
    `${API_URL}/applications/${id}`,
    {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      errorContext: 'update application',
    },
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to update application', response.statusCode, response.statusText);
  }

  if (!response.data) {
    throw new BackendError('Failed to update application: No data returned', response.statusCode, response.statusText);
  }

  return response.data;
}

export async function deleteApplication(id: string): Promise<Application> {
  const response = await fetchWithErrorHandling<Application>(
    `${API_URL}/applications/${id}`,
    {
      method: "DELETE",
      errorContext: 'delete application',
    },
  );

  if (!response.success) {
    if (response.statusCode === 404) {
      throw new NotFoundError(response.error || 'Application not found');
    }
    throw new BackendError(response.error || 'Failed to delete application', response.statusCode, response.statusText);
  }

  if (!response.data) {
    throw new BackendError('Failed to delete application: No data returned', response.statusCode, response.statusText);
  }

  return response.data;
}