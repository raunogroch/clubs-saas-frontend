export const Roles = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  ASSISTANT: "ASSISTANT",
  COACH: "COACH",
  PARENT: "PARENT",
  ATHLETE: "ATHLETE",
} as const;

export type Roles = (typeof Roles)[keyof typeof Roles];
