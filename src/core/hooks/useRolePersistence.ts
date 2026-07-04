import { useState, useCallback } from "react";
import type { Roles } from "../../common/enums";
import { warn } from "../../app/logger";

const ACTIVE_ROLE_STORAGE_KEY = "activeRole";
const HYDRATED_KEY = "activeRole_hydrated";

export const useRolePersistence = (initialRole: Roles | undefined) => {
  const getStoredRole = (): Roles | undefined => {
    try {
      const savedRole = localStorage.getItem(ACTIVE_ROLE_STORAGE_KEY);
      return savedRole && savedRole.length > 0
        ? (savedRole as Roles)
        : initialRole;
    } catch {
      return initialRole;
    }
  };

  const [activeRole, setActiveRoleState] = useState<Roles | undefined>(
    getStoredRole,
  );
  const [isHydrated] = useState(() => {
    try {
      localStorage.setItem(HYDRATED_KEY, "true");
      return true;
    } catch {
      return true;
    }
  });

  // Wrapper para setActiveRole que también persiste
  const setActiveRole = useCallback((role: Roles) => {
    // Guard: asegurar que el rol es válido
    if (!role || (typeof role === "string" && role.trim().length === 0)) {
      warn("[useRolePersistence] Intento de setear un rol vacío o inválido", {
        role,
      });
      return;
    }

    setActiveRoleState(role);
    try {
      localStorage.setItem(ACTIVE_ROLE_STORAGE_KEY, role);
    } catch {
      // Silently handle storage error
    }
  }, []);

  return {
    activeRole,
    setActiveRole,
    isHydrated,
  };
};
