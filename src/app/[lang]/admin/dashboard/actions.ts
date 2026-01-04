'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateApplication, getApplication } from "@/services/applications";
import { updateInstitution, getInstitution } from "@/services/institutions";
import { getPlan } from "@/services/plans";
import { createInstallmentPlan, getInstallmentFromApplication } from "@/services/installments";
import { revalidatePath } from "next/cache";

export async function approveApplicationAction(applicationId: string, lang: string = 'en') {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be signed in",
      };
    }

    if (session.user.role !== 'admin') {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Get the current application to preserve other fields
    const currentApplication = await getApplication(applicationId);
    if (!currentApplication) {
      return {
        success: false,
        error: "Application not found",
      };
    }

    // Check if already approved
    if (currentApplication.status === 'approved') {
      return {
        success: false,
        error: "Application is already approved",
      };
    }

    // Get plan details
    const plan = await getPlan(currentApplication.planId);
    if (!plan) {
      return {
        success: false,
        error: "Plan not found",
      };
    }

    // Update application status
    const updatedApplication = await updateApplication(applicationId, {
      ...currentApplication,
      status: 'approved' as const,
    });

    // Create installment plan with "approved_awaiting_checkout" status
    // Check if installment plan already exists
    try {
      const existingPlan = await getInstallmentFromApplication(applicationId);
      if (existingPlan) {
        // Plan already exists, skip creation
        console.log('Installment plan already exists for this application');
      }
    } catch (error) {
      // Plan doesn't exist, create it
      await createInstallmentPlan({
        applicationId: updatedApplication.id,
        planId: plan.id,
        institutionId: updatedApplication.institutionId,
        userId: updatedApplication.userId,
        total_amount: plan.total_amount,
        paid_amount: 0,
        remaining_balance: plan.total_amount,
        installment_count: plan.installment_count,
        status: 'approved_awaiting_checkout',
        created_at: new Date().toISOString(),
      });
    }

    revalidatePath(`/${lang}/admin/dashboard`);
    revalidatePath(`/${lang}/dashboard`);
    return {
      success: true,
      application: updatedApplication,
    };
  } catch (error) {
    console.error("Approve application error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function rejectApplicationAction(applicationId: string, rejectionReason: string, lang: string = 'en') {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be signed in",
      };
    }

    if (session.user.role !== 'admin') {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    if (!rejectionReason || rejectionReason.trim().length === 0) {
      return {
        success: false,
        error: "Rejection reason is required",
      };
    }

    // Get the current application to preserve other fields
    const currentApplication = await getApplication(applicationId);
    if (!currentApplication) {
      return {
        success: false,
        error: "Application not found",
      };
    }

    const updatedApplication = await updateApplication(applicationId, {
      ...currentApplication,
      status: 'rejected' as const,
      rejection_reason: rejectionReason.trim(),
    });

    revalidatePath(`/${lang}/admin/dashboard`);
    return {
      success: true,
      application: updatedApplication,
    };
  } catch (error) {
    console.error("Reject application error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function toggleInstitutionVisibilityAction(institutionId: string, lang: string = 'en') {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be signed in",
      };
    }

    if (session.user.role !== 'admin') {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Get the current institution to preserve other fields
    const currentInstitution = await getInstitution(institutionId);
    if (!currentInstitution) {
      return {
        success: false,
        error: "Institution not found",
      };
    }

    const updatedInstitution = await updateInstitution(institutionId, {
      ...currentInstitution,
      is_visible: !currentInstitution.is_visible,
    });

    revalidatePath(`/${lang}/admin/dashboard`);
    return {
      success: true,
      institution: updatedInstitution,
    };
  } catch (error) {
    console.error("Toggle institution visibility error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

