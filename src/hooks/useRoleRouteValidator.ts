import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useActiveRole } from "../core/context/useActiveRole";
import { useAuthManager } from "../features/auth";
import { usePersistorRehydration } from "../app/usePersistorRehydration";
import { isRouteAllowedForRole } from "../features/navigation";
import { hasAdminActiveAssignment } from "../core/auth/adminAccess";

export const useRoleRouteValidator = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { activeRole } = useActiveRole();
  const { activeAssignmentId } = useAuthManager();
  const isRehydrated = usePersistorRehydration();

  useEffect(() => {
    if (!activeRole) return;

    const hasAssignment = hasAdminActiveAssignment(
      activeRole,
      activeAssignmentId,
    );

    const isAdminBlocked =
      activeRole === "ADMIN" && (!isRehydrated || !hasAssignment);

    if (isAdminBlocked) {
      if (pathname !== "/dashboard" && pathname !== "/no-assignments") {
        navigate("/no-assignments", { replace: true });
      }
      return;
    }

    if (pathname === "/dashboard" || pathname === "/") return;

    const isAllowed = isRouteAllowedForRole(pathname, activeRole);

    if (!isAllowed) {
      navigate("/dashboard", { replace: true });
    }
  }, [pathname, activeRole, activeAssignmentId, isRehydrated, navigate]);
};
