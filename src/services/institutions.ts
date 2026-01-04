import { CacheTagKeys } from "@/lib/tagKeys";
import { Institution } from "@/types";
import { NetworkError, BackendError } from "@/lib/errors";

export async function getInstitutions() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/institutions', {
      cache: 'force-cache',
    });
    if (!response.ok) {
      throw new BackendError(
        `Failed to fetch institutions: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }
    const institutions: Array<Institution> = await response.json();
    return institutions.filter(inst => inst.is_visible);
  } catch (error) {
    console.error('Failed to fetch institutions:', error);

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

export async function getInstitution(id: string) {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/institutions/' + id, {
      cache: 'force-cache',
      next: {
        revalidate: 60 * 60 * 24, // 24 hours
        tags: CacheTagKeys.institution(id),
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Not found is expected, return null
      }
      throw new BackendError(
        `Failed to fetch institution: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }
    const institution: Institution = await response.json();
    return institution;
  } catch (error) {
    console.error('Failed to fetch institution:', error);

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
