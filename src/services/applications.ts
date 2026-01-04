import { Application, Institution, PlanTemplate } from "@/types/db-json.types";
import { fetchWithErrorHandling } from "@/lib/fetch-utils";
import { CacheTagKeys } from "@/lib/tagKeys";

const API_URL = process.env.NEXT_PUBLIC_API_JSON_SERVER;

export type TUserApplication = Application & { institution: Institution, plan: PlanTemplate };

export async function getUserApplications(userId: string): Promise<TUserApplication[]> {
  return fetchWithErrorHandling(
    `${API_URL}/applications?user_id=${userId}?&_embed=plan&_embed=institution`,
    {
      next: {
        tags: CacheTagKeys.applications(userId),
      },
      errorContext: 'fetch applications',
    },
  );
}


export async function getApplication(id: string): Promise<TUserApplication> {
  return fetchWithErrorHandling(
    `${API_URL}/applications/${id}?&_embed=plan&_embed=institution`,
    {
      errorContext: 'fetch application',
    },
  );
}

export async function createApplication(data: Application): Promise<Application> {
  return fetchWithErrorHandling<Application>(
    `${API_URL}/applications`,
    {
      method: "POST",
      body: JSON.stringify(data),
      errorContext: 'create application',
    },
  );
}

export async function updateApplication(id: string, data: Application): Promise<Application> {
  return fetchWithErrorHandling<Application>(
    `${API_URL}/applications/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
      errorContext: 'update application',
    },
  );
}

export async function deleteApplication(id: string): Promise<Application> {
  return fetchWithErrorHandling<Application>(
    `${API_URL}/applications/${id}`,
    {
      method: "DELETE",
      errorContext: 'delete application',
    },
  );
}