export const CoachRole = {
  HEAD_COACH: "HEAD_COACH",
  ASSISTANT_COACH: "ASSISTANT_COACH",
} as const;

export type CoachRole = (typeof CoachRole)[keyof typeof CoachRole];
