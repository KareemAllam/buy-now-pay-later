/**
 * Database Types
 * Based on db.json structure
 */

// ============================================
// PROFILE TYPES
// ============================================

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  full_name: string;
  password: string;
  email: string;
  role: UserRole;
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
  institutionId: string;
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
  userId: string;
  institutionId: string;
  planId: string;
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
  applicationId: string;
  planId: string;
  institutionId: string;
  userId: string;
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
  installmentId: string;
  amount: number;
  payment_type: PaymentType;
  status: PaymentStatus;
  created_at: string;
}

// ============================================
// DATABASE STRUCTURE TYPE
// ============================================

export interface Database {
  users: User[];
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
  user?: User;
  selected_plan?: PlanTemplate;
  installment_plan?: InstallmentPlan & {
    payments?: Payment[];
  };
}

export interface InstallmentPlanWithDetails extends InstallmentPlan {
  application?: Application;
  user?: User;
  payments?: Payment[];
}

export interface InstitutionWithPlans extends Institution {
  plans?: PlanTemplate[];
}

