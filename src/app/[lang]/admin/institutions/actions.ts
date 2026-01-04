'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createInstitution, updateInstitution, deleteInstitution } from "@/services/institutions";
import { Institution, InstitutionType, InstitutionGender } from "@/types/db-json.types";
import { revalidatePath, revalidateTag } from "next/cache";
import { CacheTagKeys } from "@/lib/tagKeys";

export async function createInstitutionAction(
  data: {
    name: { en: string; ar: string };
    location: { en: string; ar: string };
    type: InstitutionType;
    gender: InstitutionGender;
    is_visible: boolean;
  },
  lang: string = 'en'
) {
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

    const institution = await createInstitution(data);

    // Revalidate institutions listing page for all locales
    revalidatePath(`/en/institutions`);
    revalidatePath(`/ar/institutions`);

    // Revalidate the all-institutions cache tag
    revalidateTag(CacheTagKeys.all_institutions[0], { expire: 60 * 60 });

    // Revalidate admin dashboard
    revalidatePath(`/${lang}/admin/dashboard`);

    return {
      success: true,
      institution,
    };
  } catch (error: any) {
    console.error("Create institution error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}

export async function updateInstitutionAction(
  id: string,
  data: Partial<Institution>,
  lang: string = 'en'
) {
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

    const institution = await updateInstitution(id, data);

    // Revalidate institutions listing page for all locales
    revalidatePath(`/en/institutions`);
    revalidatePath(`/ar/institutions`);

    // Revalidate institution details page for all locales
    revalidatePath(`/en/institutions/${id}`);
    revalidatePath(`/ar/institutions/${id}`);

    // Revalidate cache tags
    revalidateTag(CacheTagKeys.all_institutions[0], { expire: 60 * 60 });
    revalidateTag(CacheTagKeys.institution(id)[0], { expire: 60 * 60 });
    revalidateTag(CacheTagKeys.institutionPlans(id)[0], { expire: 60 * 60 });

    // Revalidate admin dashboard
    revalidatePath(`/${lang}/admin/dashboard`);

    return {
      success: true,
      institution,
    };
  } catch (error: any) {
    console.error("Update institution error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}

export async function deleteInstitutionAction(
  id: string,
  lang: string = 'en'
) {
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

    const institution = await deleteInstitution(id);

    // Revalidate institutions listing page for all locales
    revalidatePath(`/en/institutions`);
    revalidatePath(`/ar/institutions`);

    // Revalidate institution details page for all locales (will show 404 after deletion)
    revalidatePath(`/en/institutions/${id}`);
    revalidatePath(`/ar/institutions/${id}`);

    // Revalidate cache tags
    revalidateTag(CacheTagKeys.all_institutions[0], { expire: 60 * 60 });
    revalidateTag(CacheTagKeys.institution(id)[0], { expire: 60 * 60 });
    revalidateTag(CacheTagKeys.institutionPlans(id)[0], { expire: 60 * 60 });

    // Revalidate admin dashboard
    revalidatePath(`/${lang}/admin/dashboard`);

    return {
      success: true,
      institution,
    };
  } catch (error: any) {
    console.error("Delete institution error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    };
  }
}

