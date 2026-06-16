export const EnrollmentStatus = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  SUSPENDED: "SUSPENDED",
  WITHDRAWN: "WITHDRAWN",
  COMPLETED: "COMPLETED",
} as const;

export type EnrollmentStatus =
  (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];
