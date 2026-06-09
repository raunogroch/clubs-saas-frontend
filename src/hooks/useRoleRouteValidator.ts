import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useActiveRole } from "../core/context/ActiveRoleContext";
import { isRouteAllowedForRole } from "../features/navigation";

export const useRoleRouteValidator = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { activeRole } = useActiveRole();

  useEffect(() => {
    if (!activeRole) return;

    if (pathname === "/dashboard" || pathname === "/") {
      return;
    }

    const isAllowed = isRouteAllowedForRole(pathname, activeRole);

    if (!isAllowed) {
      navigate("/dashboard", { replace: true });
    }
  }, [pathname, activeRole, navigate]);
};
