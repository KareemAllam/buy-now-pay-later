import { NetworkError, BackendError, NotFoundError } from "@/lib/errors";

interface FetchOptions extends RequestInit {
  allow404?: boolean; // Return null on 404 instead of throwing
  allowEmpty404?: boolean; // Return empty array on 404
  errorContext?: string; // Context for error messages
}

/**
 * Wraps fetch with consistent error handling
 */
export async function fetchWithErrorHandling<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { allow404, allowEmpty404, errorContext, ...fetchOptions } = options;

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      if (response.status === 404) {
        if (allow404) return null as T;
        if (allowEmpty404) return [] as T;
        throw new NotFoundError(`${errorContext || 'Resource'} not found`);
      }

      throw new BackendError(
        errorContext
          ? `Failed to ${errorContext}: ${response.statusText}`
          : `Request failed: ${response.statusText}`,
        response.status,
        response.statusText
      );
    }

    return await response.json();
  } catch (error) {
    // Re-throw custom errors as-is
    if (error instanceof NetworkError ||
      error instanceof BackendError ||
      error instanceof NotFoundError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError('Unable to connect to the server. Please check your internet connection.');
    }

    // Default to network error
    throw new NetworkError('Network connection failed. Please check your internet connection.');
  }
}