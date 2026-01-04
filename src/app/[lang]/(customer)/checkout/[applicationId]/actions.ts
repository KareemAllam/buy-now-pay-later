"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getApplication } from "@/services/applications";
import { getPlan } from "@/services/plans";
import { getInstallmentFromApplication, updateInstallmentPlan } from "@/services/installments";
import { createPayment } from "@/services/payment";

interface ProcessDownPaymentResult {
  success: boolean;
  error?: string;
  installmentPlanId?: string;
}

export async function processDownPaymentAction(
  applicationId: string,
  planId: string,
  amount: number
): Promise<ProcessDownPaymentResult> {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify application belongs to user
    const application = await getApplication(applicationId);
    if (!application || application.userId !== session.user.id) {
      return { success: false, error: "Application not found or access denied" };
    }

    // Verify application is approved
    if (application.status !== 'approved') {
      return { success: false, error: "Application must be approved before payment" };
    }

    // Get plan details
    const plan = await getPlan(planId);
    if (!plan) {
      return { success: false, error: "Plan not found" };
    }

    // Validate amount
    if (amount <= 0 || amount > plan.total_amount) {
      return { success: false, error: "Invalid payment amount" };
    }

    // 1. Get or create installment plan (should exist from approval, but handle edge case)
    let installmentPlan;
    try {
      installmentPlan = await getInstallmentFromApplication(applicationId);
      if (!installmentPlan) {
        throw new Error('Installment plan not found');
      }
    } catch (error) {
      // If plan doesn't exist, create it (edge case - shouldn't happen in normal flow)
      const { createInstallmentPlan } = await import("@/services/installments");
      installmentPlan = await createInstallmentPlan({
        applicationId: application.id,
        planId: plan.id,
        institutionId: application.institutionId,
        userId: session.user.id,
        total_amount: plan.total_amount,
        paid_amount: 0,
        remaining_balance: plan.total_amount,
        installment_count: plan.installment_count,
        status: 'approved_awaiting_checkout',
        created_at: new Date().toISOString(),
      });
    }

    // 2. Update installment plan with payment
    const newPaidAmount = installmentPlan.paid_amount + amount;
    const newRemainingBalance = installmentPlan.total_amount - newPaidAmount;
    const newStatus = newRemainingBalance <= 0 ? 'completed' : 'active';

    const updatedPlan = await updateInstallmentPlan(installmentPlan.id, {
      paid_amount: newPaidAmount,
      remaining_balance: newRemainingBalance,
      status: newStatus,
    });

    // 3. Create payment linked to the installment plan
    await createPayment({
      planId: updatedPlan.id,
      amount: amount,
      payment_type: 'down_payment',
      status: 'completed',
      created_at: new Date().toISOString(),
    });

    // Note: We keep the application for history - don't delete it

    return { success: true, installmentPlanId: updatedPlan.id };
  } catch (error) {
    console.error('Error processing down payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process payment",
    };
  }
}

