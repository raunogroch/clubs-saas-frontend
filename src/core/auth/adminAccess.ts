export const hasAdminActiveAssignment = (
  role?: string,
  activeAssignmentId?: string | null,
): boolean => {
  if (role !== "ADMIN") return true;

  return !!activeAssignmentId?.trim();
};
