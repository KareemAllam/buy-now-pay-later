"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getInstallmentPlan, updateInstallmentPlan } from "@/services/installments";
import { createPayment } from "@/services/payment";

interface ProcessMonthlyPaymentResult {
  success: boolean;
  error?: string;
}

export async function processMonthlyPaymentAction(
  installmentPlanId: string,
  amount: number
): Promise<ProcessMonthlyPaymentResult> {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Get installment plan
    const installmentPlan = await getInstallmentPlan(installmentPlanId);
    if (!installmentPlan) {
      return { success: false, error: "Installment plan not found" };
    }

    // Verify plan belongs to user
    if (installmentPlan.userId !== session.user.id) {
      return { success: false, error: "Access denied" };
    }

    // Verify plan is active
    if (installmentPlan.status !== 'active') {
      return { success: false, error: "Plan is not active" };
    }

    // Validate amount
    if (amount <= 0 || amount > installmentPlan.remaining_balance) {
      return { success: false, error: "Invalid payment amount" };
    }

    // Update installment plan
    const newPaidAmount = installmentPlan.paid_amount + amount;
    const newRemainingBalance = installmentPlan.remaining_balance - amount;
    const newStatus = newRemainingBalance <= 0 ? 'completed' : 'active';

    await updateInstallmentPlan(installmentPlan.id, {
      paid_amount: newPaidAmount,
      remaining_balance: newRemainingBalance,
      status: newStatus,
    });

    // Create payment record
    await createPayment({
      planId: installmentPlan.id,
      amount: amount,
      payment_type: 'monthly',
      status: 'completed',
      created_at: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error processing monthly payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process payment",
    };
  }
}

