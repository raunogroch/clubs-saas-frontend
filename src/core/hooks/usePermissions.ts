/**
 * core/hooks/usePermissions.ts
 *
 * Hook para validar roles del usuario actual
 *
 * Principios SOLID:
 * - SRP: Una responsabilidad - validar roles
 * - ISP: Interfaz específica para roles
 *
 * Uso:
 * ```typescript
 * const { hasRole, isAdmin } = usePermissions();
 *
 * if (hasRole('ADMIN')) {
 *   // Mostrar UI de admin
 * }
 * ```
 */

import type { Roles } from "../../common";
import type { UsePermissionsReturn } from "../interfaces";
import { useAuth } from "./useAuth";

/**
 * Hook que proporciona métodos para validar roles
 *
 * Características:
 * - Validación de roles individuales
 * - Validación de múltiples roles (ANY / ALL)
 * - Helpers predefinidos (isAdmin, isParent, isAthlete, etc.)
 *
 * @returns {UsePermissionsReturn}
 */
export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();

  const hasRole = (role: Roles): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some((userRole) => userRole.role === role);
  };

  const hasAnyRole = (roles: Roles[]): boolean => {
    if (!user || !user.roles) return false;
    return roles.some((role) =>
      user.roles.some((userRole) => userRole.role === role),
    );
  };

  const hasAllRoles = (roles: Roles[]): boolean => {
    if (!user || !user.roles) return false;
    return roles.every((role) =>
      user.roles.some((userRole) => userRole.role === role),
    );
  };

  const isAdmin = (): boolean => {
    return hasRole("ADMIN");
  };

  const isParent = (): boolean => {
    return hasRole("PARENT");
  };

  const isAthlete = (): boolean => {
    return hasRole("ATHLETE");
  };

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isParent,
    isAthlete,
  };
};
