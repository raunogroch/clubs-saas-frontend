export const ClubStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
} as const;
export type ClubStatus = (typeof ClubStatus)[keyof typeof ClubStatus];
