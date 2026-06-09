import { useEffect, useState, useCallback } from "react";
import type { Roles } from "../../common/enums";

const ACTIVE_ROLE_STORAGE_KEY = "activeRole";
const HYDRATED_KEY = "activeRole_hydrated";

export const useRolePersistence = (initialRole: Roles | undefined) => {
  const [activeRole, setActiveRoleState] = useState<Roles | undefined>(
    initialRole,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Recuperar rol guardado del localStorage al montar
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem(ACTIVE_ROLE_STORAGE_KEY);
      if (savedRole && savedRole.length > 0) {
        setActiveRoleState(savedRole as Roles);
        console.log(
          `[useRolePersistence] Rol recuperado del localStorage: ${savedRole}`,
        );
      }
    } catch (error) {
      console.warn("Error al recuperar activeRole del localStorage:", error);
    } finally {
      // Marcar como hidratado para indicar que ya se cargó del localStorage
      localStorage.setItem(HYDRATED_KEY, "true");
      setIsHydrated(true);
    }
  }, []);

  // Wrapper para setActiveRole que también persiste
  const setActiveRole = useCallback((role: Roles) => {
    // Guard: asegurar que el rol es válido
    if (!role || (typeof role === "string" && role.trim().length === 0)) {
      console.warn(
        "[useRolePersistence] Intento de setear un rol vacío o inválido",
        {
          role,
        },
      );
      return;
    }

    setActiveRoleState(role);
    try {
      localStorage.setItem(ACTIVE_ROLE_STORAGE_KEY, role);
      console.log(`[useRolePersistence] Rol guardado en localStorage: ${role}`);
    } catch (error) {
      console.warn("Error al guardar activeRole en localStorage:", error);
    }
  }, []);

  return {
    activeRole,
    setActiveRole,
    isHydrated,
  };
};
