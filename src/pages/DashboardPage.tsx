import { useActiveRole } from "../core/context/useActiveRole";
import { useAuthManager } from "../features/auth/useAuthManager";
import {
  DashboardAdmin,
  DashboardAssistant,
  DashboardAthlete,
  DashboardCoach,
  DashboardParent,
  DashboardSuperadmin,
} from "./dashboard";
import { NoAssignmentsPage } from "./NoAssignmentsPage";

export const DashboardPage = () => {
  const { user } = useAuthManager();
  const { activeRole } = useActiveRole();

  const currentRole = activeRole ?? user?.roles?.[0]?.role ?? "ADMIN";
  const hasAssignments = (user?.assignments ?? []).length > 0;

  if (currentRole === "ADMIN" && !hasAssignments) {
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
