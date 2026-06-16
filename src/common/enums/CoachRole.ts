export const CoachRole = {
  HEAD_COACH: "HEAD_COACH",
  ASSISTANT_COACH: "ASSISTANT_COACH",
  FITNESS_COACH: "FITNESS_COACH",
  GOALKEEPER_COACH: "GOALKEEPER_COACH",
  TECHNICAL_ASSISTANT: "TECHNICAL_ASSISTANT",
} as const;

export type CoachRole = (typeof CoachRole)[keyof typeof CoachRole];
