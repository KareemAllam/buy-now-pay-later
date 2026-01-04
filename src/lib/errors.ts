/**
 * Custom error classes for better error handling and type detection
 */

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  BACKEND_ERROR = 'BACKEND_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class NetworkError extends Error {
  type = ErrorType.NETWORK_ERROR;

  constructor(message: string = 'Network connection failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class NotFoundError extends Error {
  type = ErrorType.NOT_FOUND_ERROR;

  constructor(message: string = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class BackendError extends Error {
  type = ErrorType.BACKEND_ERROR;
  status?: number;
  statusText?: string;

  constructor(
    message: string = 'Backend service error',
    status?: number,
    statusText?: string
  ) {
    super(message);
    this.name = 'BackendError';
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * Determines the error type from an error object
 */
export function getErrorType(error: unknown): ErrorType {
  if (error instanceof NetworkError) {
    return ErrorType.NETWORK_ERROR;
  }
  if (error instanceof BackendError) {
    return ErrorType.BACKEND_ERROR;
  }

  // Check if it's a network error by checking the error message/name
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    const errorName = error.name.toLowerCase();

    // Network-related error indicators
    if (
      errorName === 'typeerror' ||
      errorMessage.includes('failed to fetch') ||
      errorMessage.includes('network') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('offline')
    ) {
      return ErrorType.NETWORK_ERROR;
    }

    // Check if error has status property (likely a fetch error)
    if ('status' in error && typeof (error as any).status === 'number') {
      return ErrorType.BACKEND_ERROR;
    }
  }

  return ErrorType.UNKNOWN_ERROR;
}

/**
 * Checks if the browser is online
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

