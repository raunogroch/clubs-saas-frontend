import { useEffect, useRef } from "react";
import { useActiveRole } from "../context/useActiveRole";
import type { Roles } from "../../common/enums";

export const useInitializeActiveRole = (availableRoles: Roles[]): void => {
  const { activeRole, setActiveRole, isHydrated } = useActiveRole();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (availableRoles.length > 0 && availableRoles[0]) {
      const roleIsInvalid = activeRole && !availableRoles.includes(activeRole);
      const shouldInitialize = !hasInitialized.current && !activeRole;

      if (shouldInitialize || roleIsInvalid) {
        setActiveRole(availableRoles[0]);
        hasInitialized.current = true;
      }
    }
  }, [availableRoles, activeRole, setActiveRole, isHydrated]);
};
