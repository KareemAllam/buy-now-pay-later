import { Payment, InstallmentPlan } from "@/types/db-json.types";
import { fetchWithErrorHandling } from "@/lib/fetch-utils";
import { CacheTagKeys } from "@/lib/tagKeys";
import { BackendError, NotFoundError } from "@/lib/errors";

const API_URL = process.env.NEXT_PUBLIC_API_JSON_SERVER;

/**
 * Get all payments
 */
export async function getAllPayments(): Promise<Payment[]> {
  const response = await fetchWithErrorHandling<Payment[]>(
    `${API_URL}/payments`,
    {
      cache: 'force-cache',
      errorContext: 'fetch payments',
      allowEmpty404: true,
    },
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to fetch payments', response.statusCode, response.statusText);
  }

  return response.data ?? [];
}

/**
 * Get a single payment by ID
 */
export async function getPayment(id: string): Promise<Payment | null> {
  const response = await fetchWithErrorHandling<Payment | null>(
    `${API_URL}/payments/${id}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch payment',
      allow404: true,
    },
  );

  if (!response.success) {
    if (response.statusCode === 404) {
      return null;
    }
    throw new BackendError(response.error || 'Failed to fetch payment', response.statusCode, response.statusText);
  }

  return response.data ?? null;
}

/**
 * Get all payments for a specific installment plan
 */
export async function getPaymentsByInstallmentId(installmentId: string): Promise<Payment[]> {
  const response = await fetchWithErrorHandling<Payment[]>(
    `${API_URL}/payments?planId=${installmentId}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch payments by installment plan',
      allowEmpty404: true,
      next: {
        tags: CacheTagKeys.payments(installmentId),
      },
    },
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to fetch payments by installment plan', response.statusCode, response.statusText);
  }

  return response.data ?? [];
}

/**
 * Get payments by status
 */
export async function getPaymentsByStatus(status: Payment['status']): Promise<Payment[]> {
  const response = await fetchWithErrorHandling<Payment[]>(
    `${API_URL}/payments?status=${status}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch payments by status',
      allowEmpty404: true,
    },
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to fetch payments by status', response.statusCode, response.statusText);
  }

  return response.data ?? [];
}

/**
 * Get payments by payment type
 */
export async function getPaymentsByType(paymentType: Payment['payment_type']): Promise<Payment[]> {
  const response = await fetchWithErrorHandling<Payment[]>(
    `${API_URL}/payments?payment_type=${paymentType}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch payments by type',
      allowEmpty404: true,
    },
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to fetch payments by type', response.statusCode, response.statusText);
  }

  return response.data ?? [];
}

/**
 * Create a new payment
 */
export async function createPayment(data: Omit<Payment, 'id'>): Promise<Payment> {
  const response = await fetchWithErrorHandling<Payment>(
    `${API_URL}/payments`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      errorContext: 'create payment',
    },
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to create payment', response.statusCode, response.statusText);
  }

  if (!response.data) {
    throw new BackendError('Failed to create payment: No data returned', response.statusCode, response.statusText);
  }

  return response.data;
}

/**
 * Update an existing payment
 */
export async function updatePayment(id: string, data: Partial<Omit<Payment, 'id' | 'created_at'>>): Promise<Payment> {
  const response = await fetchWithErrorHandling<Payment>(
    `${API_URL}/payments/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      errorContext: 'update payment',
    },
  );

  if (!response.success) {
    throw new BackendError(response.error || 'Failed to update payment', response.statusCode, response.statusText);
  }

  if (!response.data) {
    throw new BackendError('Failed to update payment: No data returned', response.statusCode, response.statusText);
  }

  return response.data;
}

/**
 * Delete a payment
 */
export async function deletePayment(id: string): Promise<Payment> {
  const response = await fetchWithErrorHandling<Payment>(
    `${API_URL}/payments/${id}`,
    {
      method: 'DELETE',
      errorContext: 'delete payment',
    },
  );

  if (!response.success) {
    if (response.statusCode === 404) {
      throw new NotFoundError(response.error || 'Payment not found');
    }
    throw new BackendError(response.error || 'Failed to delete payment', response.statusCode, response.statusText);
  }

  if (!response.data) {
    throw new BackendError('Failed to delete payment: No data returned', response.statusCode, response.statusText);
  }

  return response.data;
}

/**
 * Get payments for a user (through their installment plans)
 * Note: This requires fetching installment plans first, then payments
 */
export async function getUserPayments(userId: string): Promise<Payment[]> {
  // First get user's installment plans
  const installmentsResponse = await fetchWithErrorHandling<InstallmentPlan[]>(
    `${API_URL}/installment_plans?userId=${userId}`,
    {
      allowEmpty404: true,
      errorContext: 'fetch user installment plans',
    },
  );

  if (!installmentsResponse.success || !installmentsResponse.data || installmentsResponse.data.length === 0) {
    return [];
  }

  // Get all installment plan IDs
  const installmentIds = installmentsResponse.data.map(plan => plan.id);
  
  // Fetch payments for all installment plans
  const paymentPromises = installmentIds.map(installmentId => 
    getPaymentsByInstallmentId(installmentId)
  );
  
  const paymentArrays = await Promise.all(paymentPromises);
  
  // Flatten the array of arrays into a single array
  return paymentArrays.flat();
}

