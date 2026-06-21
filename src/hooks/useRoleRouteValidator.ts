import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useActiveRole } from "../core/context/useActiveRole";
import { useAuthManager } from "../features/auth/useAuthManager";
import { usePersistorRehydration } from "../app/usePersistorRehydration";
import { isRouteAllowedForRole } from "../features/navigation";

export const useRoleRouteValidator = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { activeRole } = useActiveRole();
  const { user, activeAssignmentId } = useAuthManager();
  const isRehydrated = usePersistorRehydration();

  useEffect(() => {
    if (!activeRole) return;

    // Para ADMIN: verificar activeAssignmentId (no user.assignments que siempre está vacío)
    // Esperar rehydratación antes de validar para ADMIN
    const hasValidAssignments =
      !!activeAssignmentId && activeAssignmentId.trim().length > 0;
    const isAdminWithoutAssignments =
      activeRole === "ADMIN" && (!isRehydrated || !hasValidAssignments);

    if (isAdminWithoutAssignments) {
      if (pathname !== "/dashboard" && pathname !== "/no-assignments") {
        console.log(
          "[useRoleRouteValidator] ADMIN sin assignments. Redirigiendo a /no-assignments",
          {
            isRehydrated,
            activeAssignmentId,
          },
        );
        navigate("/no-assignments", { replace: true });
      }
      return;
    }

    if (pathname === "/dashboard" || pathname === "/") {
      return;
    }

    const isAllowed = isRouteAllowedForRole(pathname, activeRole);

    if (!isAllowed) {
      navigate("/dashboard", { replace: true });
    }
  }, [pathname, activeRole, navigate, user, activeAssignmentId, isRehydrated]);
};
