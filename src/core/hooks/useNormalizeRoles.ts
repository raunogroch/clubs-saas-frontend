import type { Roles } from "../../common/enums";
import type { UserRole } from "../interfaces/User";

/**
 * Hook para normalizar roles de diferentes estructuras posibles
 *
 * Soporta:
 * - Roles[] directos: ["ADMIN", "SUPER_ADMIN"]
 * - UserRole[]: [{ role: "ADMIN" }, { role: "SUPER_ADMIN" }]
 *
 * @param roles - Array de roles en cualquier estructura
 * @returns Array normalizado de Roles válidos
 */
export const useNormalizeRoles = (
  roles: (UserRole | Roles)[] | Roles[] | undefined,
) => {
  if (!roles || roles.length === 0) {
    return [];
  }

  return roles
    .map((role) => {
      // Si es un objeto con propiedad 'role', extrae la propiedad
      if (typeof role === "object" && role !== null && "role" in role) {
        return (role as UserRole).role;
      }
      // Si es un string directo, úsalo
      if (typeof role === "string") {
        return role as Roles;
      }
      return undefined;
    })
    .filter((role): role is Roles => role !== undefined && role !== null);
};
