import { useMemo } from "react";
import type { Roles } from "../../common";
import type { UserPageProps } from "../interfaces";
import { useActiveRole } from "../context/useActiveRole";
import { resolveRoleList } from "../utils/roleListResolver";

/**
 * Hook que resuelve la lista de roles a mostrar en la página de usuarios
 * Encapsula:
 * - Obtención del rol activo
 * - Resolución dinámica según rol
 * - Fallback a props si se proporcionan
 *
 * Principio SOLID aplicado:
 * - SRP: Una sola responsabilidad - resolver qué roles mostrar
 * - OCP: Abierto a cambios en la lógica de resolución sin afectar consumers
 */
export const useRoleList = (
  propRoleList?: UserPageProps["roleList"],
): Roles[] => {
  const { activeRole } = useActiveRole();

  return useMemo(
    () => resolveRoleList(activeRole as Roles, propRoleList),
    [activeRole, propRoleList],
  );
};
