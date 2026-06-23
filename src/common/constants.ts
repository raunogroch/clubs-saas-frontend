/**
 * Constantes globales del proyecto
 * Single Source of Truth para valores reutilizados
 */

// ============ DAYS OF WEEK ============
export const WEEK_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

// ============ COACH ROLES ============
export const COACH_ROLES = ["HEAD_COACH", "ASSISTANT_COACH"] as const;

// ============ ENROLLMENT STATUSES ============
export const ENROLLMENT_STATUSES = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  SUSPENDED: "SUSPENDED",
  WITHDRAWN: "WITHDRAWN",
  COMPLETED: "COMPLETED",
} as const;

// ============ UI CONFIGURATION ============
export const MODAL_SIZES = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
} as const;

export const BUTTON_VARIANTS = {
  PRIMARY: "btn-primary",
  SECONDARY: "btn-secondary",
  SUCCESS: "btn-success",
  DANGER: "btn-danger",
  WARNING: "btn-warning",
} as const;
