import { useEffect, useRef } from "react";
import { useActiveRole } from "../context/ActiveRoleContext";
import type { Roles } from "../../common/enums";

/**
 * Hook para inicializar el rol activo si es necesario
 *
 * Responsabilidad única: Asegurar que siempre haya un rol activo válido
 *
 * Solo inicializa si:
 * - Ya se hidrataron los datos del localStorage (isHydrated = true)
 * - No hay un rol activo establecido
 * - O el rol activo no está en los roles disponibles (usuario perdió ese rol)
 *
 * @param availableRoles - Array de roles disponibles del usuario
 */
export const useInitializeActiveRole = (availableRoles: Roles[]): void => {
  const { activeRole, setActiveRole, isHydrated } = useActiveRole();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Solo proceder si ya se hidrataron los datos del localStorage
    if (!isHydrated) {
      console.log(
        "[useInitializeActiveRole] Esperando hidratación del localStorage...",
      );
      return;
    }

    if (availableRoles.length > 0 && availableRoles[0]) {
      const roleIsInvalid = activeRole && !availableRoles.includes(activeRole);
      const shouldInitialize = !hasInitialized.current && !activeRole;

      if (shouldInitialize || roleIsInvalid) {
        console.log(
          `[useInitializeActiveRole] Inicializando con primer rol: ${availableRoles[0]}`,
        );
        setActiveRole(availableRoles[0]);
        hasInitialized.current = true;
      }
    }
  }, [availableRoles, activeRole, setActiveRole, isHydrated]);
};
