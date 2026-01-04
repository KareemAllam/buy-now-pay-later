"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getApplication, deleteApplication } from "@/services/applications";
import { getPlan } from "@/services/plans";
import { createInstallmentPlan } from "@/services/installments";
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

    // 1. Create installment plan
    const installmentPlan = await createInstallmentPlan({
      applicationId: application.id,
      planId: plan.id,
      institutionId: application.institutionId,
      userId: session.user.id,
      total_amount: plan.total_amount,
      paid_amount: amount,
      remaining_balance: plan.total_amount - amount,
      installment_count: plan.installment_count,
      status: amount >= plan.total_amount ? 'completed' : 'active',
      created_at: new Date().toISOString(),
    });

    // 2. Create payment linked to the installment plan
    await createPayment({
      installmentId: installmentPlan.id,
      amount: amount,
      payment_type: 'down_payment',
      status: 'completed',
      created_at: new Date().toISOString(),
    });

    // 3. Delete the application
    await deleteApplication(applicationId);

    return { success: true, installmentPlanId: installmentPlan.id };
  } catch (error) {
    console.error('Error processing down payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process payment",
    };
  }
}

