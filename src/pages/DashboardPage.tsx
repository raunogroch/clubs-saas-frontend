import { useActiveRole } from "../core/context/useActiveRole";
import { useAuthManager } from "../features/auth/useAuthManager";
import { usePersistorRehydration } from "../app/usePersistorRehydration";
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

  // Para ADMIN: requiere activeAssignmentId seleccionado (esperar rehydratación)
  // Para otros roles: solo verifica que hay memberships
  let hasValidAssignments = false;

  if (currentRole === "ADMIN") {
    // Para ADMIN, necesitamos esperar la rehydratación y verificar activeAssignmentId
    if (!isRehydrated) {
      // Aún no se ha completado la rehydratación, no mostrar NoAssignmentsPage aún
      hasValidAssignments = true;
    } else {
      // Rehydratación completa, verificar activeAssignmentId
      hasValidAssignments =
        !!activeAssignmentId && activeAssignmentId.trim().length > 0;
    }
  } else {
    // Para otros roles, no necesita rehydratación, solo verifica memberships
    hasValidAssignments =
      (user?.memberships ?? user?.assignments ?? []).length > 0;
  }

  if (currentRole === "ADMIN" && !hasValidAssignments) {
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
