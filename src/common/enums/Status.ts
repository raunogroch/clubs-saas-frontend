export const Status = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
  SUSPENDED: "SUSPENDED",
  BLOCKED: "BLOCKED",
} as const;

export type Status = (typeof Status)[keyof typeof Status];
