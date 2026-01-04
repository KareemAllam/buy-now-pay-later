interface FetchOptions extends RequestInit {
  allow404?: boolean; // Return null on 404 instead of error response
  allowEmpty404?: boolean; // Return empty array on 404
  errorContext?: string; // Context for error messages
}

export interface FetchResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
  statusText?: string;
}

/**
 * Wraps fetch with consistent error handling
 * Returns a response object instead of throwing errors
 */
export async function fetchWithErrorHandling<T>(
  url: string,
  options: FetchOptions = {}
): Promise<FetchResponse<T>> {
  const { allow404, allowEmpty404, errorContext, ...fetchOptions } = options;

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      // Handle 404 errors
      if (response.status === 404) {
        if (allow404) {
          return {
            success: true,
            data: null as T,
            statusCode: 404,
            statusText: response.statusText,
          };
        }
        if (allowEmpty404) {
          return {
            success: true,
            data: [] as T,
            statusCode: 404,
            statusText: response.statusText,
          };
        }
        return {
          success: false,
          error: `${errorContext || 'Resource'} not found`,
          statusCode: 404,
          statusText: response.statusText,
        };
      }

      // Handle other HTTP errors
      const errorMessage = errorContext
        ? `Failed to ${errorContext}: ${response.statusText}`
        : `Request failed: ${response.statusText}`;

      return {
        success: false,
        error: errorMessage,
        statusCode: response.status,
        statusText: response.statusText,
      };
    }

    // Success response
    const data: T = await response.json();
    return {
      success: true,
      data,
      statusCode: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Unable to connect to the server. Please check your internet connection.',
        statusCode: 0,
        statusText: 'Network Error',
      };
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: 'Failed to parse server response',
        statusCode: 0,
        statusText: 'Parse Error',
      };
    }

    // Default to network error
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network connection failed. Please check your internet connection.',
      statusCode: 0,
      statusText: 'Network Error',
    };
  }
}