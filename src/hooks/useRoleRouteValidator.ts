import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useActiveRole } from "../core/context/useActiveRole";
import { useAuthManager } from "../features/auth/useAuthManager";
import { isRouteAllowedForRole } from "../features/navigation";

export const useRoleRouteValidator = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { activeRole } = useActiveRole();
  const { user } = useAuthManager();

  useEffect(() => {
    if (!activeRole) return;

    const hasAssignments = (user?.assignments ?? []).length > 0;
    const isAdminWithoutAssignments = activeRole === "ADMIN" && !hasAssignments;

    if (isAdminWithoutAssignments) {
      if (pathname !== "/dashboard" && pathname !== "/no-assignments") {
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
  }, [pathname, activeRole, navigate, user]);
};
