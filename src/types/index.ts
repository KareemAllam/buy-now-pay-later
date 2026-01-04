/**
 * Type Exports
 * Central export point for all types
 */

// Re-export commonly used types with shorter names
export type {
  ApplicationStatus,
  PlanStatus,
  PaymentType,
  PaymentStatus,
  InstitutionGender,
} from './database';

// Re-export db-json types (explicitly to avoid conflicts)
export type {
  Profile,
  Institution,
  PlanTemplate,
  Application,
  InstallmentPlan,
  Payment,
  Database,
  ApplicationWithDetails,
  InstallmentPlanWithDetails,
  InstitutionWithPlans,
  ProfileRole,
  InstitutionType,
  InstallmentPlanStatus,
} from './db-json';

