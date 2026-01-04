

/**
 * Database Types
 * Based on Supabase schema
 */

import { Database } from "../../database.types";

// ============================================
// AUTH & USER TYPES
// ============================================

export type UserRole = 'customer' | 'admin';

export type Profile = Database['public']['Tables']['profiles']['Row'];

// ============================================
// INSTITUTION TYPES
// ============================================

export type InstitutionGender = 'male' | 'female' | 'mixed';

export type Institution = Database['public']['Tables']['institutions']['Row'];


// ============================================
// APPLICATION TYPES
// ============================================

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export type Application = Database['public']['Tables']['applications']['Row'];


// ============================================
// INSTALLMENT PLAN TYPES
// ============================================

export type PlanStatus = 'approved_awaiting_checkout' | 'active' | 'completed' | 'cancelled';

export type InstallmentPlan = Database['public']['Tables']['installment_plans']['Row'];


// ============================================
// PAYMENT TYPES
// ============================================

export type PaymentType = 'down_payment' | 'monthly';

export type PaymentStatus = 'success' | 'pending' | 'failed' | 'refunded';

export type Payment = Database['public']['Tables']['payments']['Row'];


// ============================================
// COMPOSITE TYPES (for API responses)
// ============================================

export type ApplicationWithDetails = Application & {
  institution?: Institution;
  profile?: Profile;
  plan?: InstallmentPlan & {
    payments?: Payment[];
  };
}

export type InstitutionWithStats = Institution & {
  application_count?: number;
  active_plans_count?: number;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================


export interface SignInRequest {
  email: string;
  password: string;
}

export type CreateApplicationRequest = Database['public']['Tables']['applications']['Insert']

export type UpdateApplicationStatusRequest = Database['public']['Tables']['applications']['Update'];

export type CreatePaymentRequest = Database['public']['Tables']['payments']['Insert'];

export type CreateInstitutionRequest = Database['public']['Tables']['institutions']['Insert']

export type UpdateInstitutionRequest = Database['public']['Tables']['institutions']['Update'];

// ============================================
// FILTER & QUERY TYPES
// ============================================

export interface InstitutionFilters {
  search?: string;
  gender?: InstitutionGender;
  location?: string;
  is_visible?: boolean;
}

export interface ApplicationFilters {
  user_id?: string;
  institution_id?: string;
  status?: ApplicationStatus;
}

export interface PlanFilters {
  user_id?: string;
  institution_id?: string;
  status?: PlanStatus;
}

export interface PaymentFilters {
  plan_id?: string;
  payment_type?: PaymentType;
  status?: PaymentStatus;
}

