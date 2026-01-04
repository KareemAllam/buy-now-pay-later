'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Application } from "@/types/db-json.types";
import { getPlan } from "@/services/plans";
import { createApplication } from "@/services/applications";

export async function createApplicationAction(
  institutionId: string,
  planId: string
) {
  try {
    // Get current user session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        error: "You must be signed in to apply for a plan",
      };
    }

    // Get plan to get tuition amount
    const plan = await getPlan(planId);

    if (!plan) {
      return {
        success: false,
        error: "Plan not found",
      };
    }

    // Check if plan belongs to the institution
    if (plan.institutionId !== institutionId) {
      return {
        success: false,
        error: "Plan does not belong to this institution",
      };
    }

    // Create application
    const applicationData: Omit<Application, 'id' | 'created_at'> = {
      userId: session.user.id,
      institutionId: institutionId,
      planId: planId,
      status: 'pending' as const,
      tuition_amount: plan.total_amount,
      rejection_reason: null,
    };

    const application = await createApplication(applicationData);

    return {
      success: true,
      application,
    };
  } catch (error) {
    console.error("Create application error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

