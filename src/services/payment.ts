import { Payment, InstallmentPlan } from "@/types/db-json.types";
import { fetchWithErrorHandling } from "@/lib/fetch-utils";
import { CacheTagKeys } from "@/lib/tagKeys";

const API_URL = process.env.NEXT_PUBLIC_API_JSON_SERVER;

/**
 * Get all payments
 */
export async function getAllPayments(): Promise<Payment[]> {
  return fetchWithErrorHandling<Payment[]>(
    `${API_URL}/payments`,
    {
      cache: 'force-cache',
      errorContext: 'fetch payments',
      allowEmpty404: true,
    },
  );
}

/**
 * Get a single payment by ID
 */
export async function getPayment(id: string): Promise<Payment | null> {
  return fetchWithErrorHandling<Payment | null>(
    `${API_URL}/payments/${id}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch payment',
      allow404: true,
    },
  );
}

/**
 * Get all payments for a specific installment plan
 */
export async function getPaymentsByInstallmentId(installmentId: string): Promise<Payment[]> {
  return fetchWithErrorHandling<Payment[]>(
    `${API_URL}/payments?installmentId=${installmentId}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch payments by installment plan',
      allowEmpty404: true,
      next: {
        tags: CacheTagKeys.payments(installmentId),
      },
    },
  );
}

/**
 * Get payments by status
 */
export async function getPaymentsByStatus(status: Payment['status']): Promise<Payment[]> {
  return fetchWithErrorHandling<Payment[]>(
    `${API_URL}/payments?status=${status}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch payments by status',
      allowEmpty404: true,
    },
  );
}

/**
 * Get payments by payment type
 */
export async function getPaymentsByType(paymentType: Payment['payment_type']): Promise<Payment[]> {
  return fetchWithErrorHandling<Payment[]>(
    `${API_URL}/payments?payment_type=${paymentType}`,
    {
      cache: 'force-cache',
      errorContext: 'fetch payments by type',
      allowEmpty404: true,
    },
  );
}

/**
 * Create a new payment
 */
export async function createPayment(data: Omit<Payment, 'id'>): Promise<Payment> {
  return fetchWithErrorHandling<Payment>(
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
}

/**
 * Update an existing payment
 */
export async function updatePayment(id: string, data: Partial<Omit<Payment, 'id' | 'created_at'>>): Promise<Payment> {
  return fetchWithErrorHandling<Payment>(
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
}

/**
 * Delete a payment
 */
export async function deletePayment(id: string): Promise<Payment> {
  return fetchWithErrorHandling<Payment>(
    `${API_URL}/payments/${id}`,
    {
      method: 'DELETE',
      errorContext: 'delete payment',
    },
  );
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

  if (!installmentsResponse || installmentsResponse.length === 0) {
    return [];
  }

  // Get all installment plan IDs
  const installmentIds = installmentsResponse.map(plan => plan.id);
  
  // Fetch payments for all installment plans
  const paymentPromises = installmentIds.map(installmentId => 
    getPaymentsByInstallmentId(installmentId)
  );
  
  const paymentArrays = await Promise.all(paymentPromises);
  
  // Flatten the array of arrays into a single array
  return paymentArrays.flat();
}

