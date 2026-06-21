import { useMemo } from "react";
import type { Membership } from "../interfaces/User";
import type { Roles } from "../../common/enums";

/**
 * Hook para extraer roles desde memberships
 *
 * Obtiene un array de roles únicos de las memberships del usuario.
 * Si no hay memberships, retorna un array vacío.
 *
 * Principios SOLID:
 * - SRP: Una responsabilidad - extraer roles de memberships
 * - DIP: Depende de la abstracción Membership
 *
 * @param memberships - Array de memberships del usuario
 * @returns Array de roles únicos
 */
export const useGetRolesFromMemberships = (
  memberships: Membership[] | undefined,
): Roles[] => {
  return useMemo(() => {
    if (!memberships || memberships.length === 0) {
      return [];
    }

    // Extraer roles únicos
    const rolesSet = new Set<Roles>();
    memberships.forEach((membership) => {
      if (membership.role) {
        rolesSet.add(membership.role);
      }
    });

    return Array.from(rolesSet);
  }, [memberships]);
};
