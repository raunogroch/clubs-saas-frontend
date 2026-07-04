import type { CoachRole } from "../../../core/interfaces/Groups";
import type { User } from "../../../core/interfaces";

interface VisibleCoach {
  coachId: string;
  role?: CoachRole | null;
}

export const buildCoachesPayload = (
  groupId: string,
  visibleCoaches: VisibleCoach[],
  updatedCoaches: Map<string, CoachRole>,
  selectedCoaches: Array<{ user: User; role: CoachRole }>,
) => {
  const existingCoaches = visibleCoaches.map((c) => ({
    coachId: c.coachId,
    role:
      updatedCoaches.get(c.coachId) ||
      c.role ||
      ("ASSISTANT_COACH" as CoachRole),
  }));

  const newCoaches = selectedCoaches.map((c) => ({
    coachId: c.user.id,
    role: c.role,
  }));

  return {
    id: groupId,
    coaches: [...existingCoaches, ...newCoaches],
  };
};

export default {};
