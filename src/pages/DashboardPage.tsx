import { useActiveRole } from "../core/context/useActiveRole";
import { useAuthManager } from "../features/auth/useAuthManager";
import { useGetRolesFromMemberships } from "../core/hooks/useGetRolesFromMemberships";
import {
  DashboardAdmin,
  DashboardAssistant,
  DashboardAthlete,
  DashboardCoach,
  DashboardParent,
  DashboardSuperadmin,
} from "./dashboard";
import { NoAssignmentsPage } from "./NoAssignmentsPage";
import { usePersistorRehydration } from "../app/usePersistorRehydration";
import { hasAdminActiveAssignment } from "../core/auth/adminAccess";

export const DashboardPage = () => {
  const isRehydrated = usePersistorRehydration();
  const { user, activeAssignmentId } = useAuthManager();
  const { activeRole } = useActiveRole();

  const rolesFromMemberships = useGetRolesFromMemberships(user?.memberships);

  const currentRole =
    activeRole ??
    rolesFromMemberships?.[0] ??
    user?.roles?.[0]?.role ??
    "ADMIN";

  const hasAssignment = hasAdminActiveAssignment(
    currentRole,
    activeAssignmentId,
  );

  if (currentRole === "ADMIN" && isRehydrated && !hasAssignment) {
    return <NoAssignmentsPage />;
  }

  const dashboardMap = {
    SUPER_ADMIN: <DashboardSuperadmin />,
    ADMIN: <DashboardAdmin />,
    ASSISTANT: <DashboardAssistant />,
    COACH: <DashboardCoach />,
    PARENT: <DashboardParent />,
    ATHLETE: <DashboardAthlete />,
  } as const;

  return (
    dashboardMap[currentRole as keyof typeof dashboardMap] ?? <DashboardAdmin />
  );
};
