'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Application } from "@/types/db-json.types";
import { getPlan } from "@/services/plans";

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
    const applicationData = {
      user_id: session.user.id,
      institutionId: institutionId,
      selected_plan_id: planId,
      status: 'pending' as const,
      tuition_amount: plan.total_amount,
      rejection_reason: null,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_JSON_SERVER}/applications`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || 'Failed to create application',
      };
    }

    const application: Application = await response.json();

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

