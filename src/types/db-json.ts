/**
 * Database Types
 * Based on db.json structure
 */

// ============================================
// PROFILE TYPES
// ============================================

export type ProfileRole = 'user' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  role: ProfileRole;
  created_at: string;
}

// ============================================
// INSTITUTION TYPES
// ============================================

export type InstitutionType = 'school' | 'university';
export type InstitutionGender = 'male' | 'female' | 'mixed';

export interface LocalizedString {
  en: string;
  ar: string;
}

export interface Institution {
  id: string;
  name: LocalizedString;
  type: InstitutionType;
  location: LocalizedString;
  gender: InstitutionGender;
  is_visible: boolean;
  created_at: string;
}

// ============================================
// PLAN TEMPLATE TYPES
// ============================================

export interface PlanTemplate {
  id: string;
  institution_id: string;
  name: LocalizedString;
  total_amount: number;
  installment_count: number;
  created_at: string;
}

// ============================================
// APPLICATION TYPES
// ============================================

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface Application {
  id: string;
  user_id: string;
  institution_id: string;
  selected_plan_id: string;
  status: ApplicationStatus;
  tuition_amount: number;
  rejection_reason: string | null;
  created_at: string;
}

// ============================================
// INSTALLMENT PLAN TYPES
// ============================================

export type InstallmentPlanStatus = 'approved_awaiting_checkout' | 'active' | 'completed' | 'cancelled';

export interface InstallmentPlan {
  id: string;
  application_id: string;
  user_id: string;
  total_amount: number;
  paid_amount: number;
  remaining_balance: number;
  installment_count: number;
  status: InstallmentPlanStatus;
  created_at: string;
}

// ============================================
// PAYMENT TYPES
// ============================================

export type PaymentType = 'credit_card' | 'debit_card' | 'bank_transfer' | 'down_payment' | 'monthly';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  plan_id: string;
  amount: number;
  payment_type: PaymentType;
  status: PaymentStatus;
  created_at: string;
}

// ============================================
// DATABASE STRUCTURE TYPE
// ============================================

export interface Database {
  profiles: Profile[];
  institutions: Institution[];
  plans: PlanTemplate[];
  applications: Application[];
  installment_plans: InstallmentPlan[];
  payments: Payment[];
}

// ============================================
// COMPOSITE TYPES (for API responses)
// ============================================

export interface ApplicationWithDetails extends Application {
  institution?: Institution;
  profile?: Profile;
  selected_plan?: PlanTemplate;
  installment_plan?: InstallmentPlan & {
    payments?: Payment[];
  };
}

export interface InstallmentPlanWithDetails extends InstallmentPlan {
  application?: Application;
  profile?: Profile;
  payments?: Payment[];
}

export interface InstitutionWithPlans extends Institution {
  plans?: PlanTemplate[];
}

