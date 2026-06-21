/**
 * core/hooks/usePermissions.ts
 *
 * Hook para validar roles del usuario actual
 *
 * Principios SOLID:
 * - SRP: Una responsabilidad - validar roles/memberships
 * - ISP: Interfaz específica para roles
 * - DIP: Depende de membershipService
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
import {
  userHasMembership,
  userHasAnyMembership,
  userHasAllMemberships,
} from "../../features/auth/membershipService";

/**
 * Hook que proporciona métodos para validar roles/memberships
 *
 * Características:
 * - Validación de roles individuales
 * - Validación de múltiples roles (ANY / ALL)
 * - Helpers predefinidos (isAdmin, isParent, isAthlete, etc.)
 * - Soporte para nueva estructura de memberships con retrocompatibilidad
 *
 * @returns {UsePermissionsReturn}
 */
export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();

  const hasRole = (role: Roles): boolean => {
    return userHasMembership(user, role);
  };

  const hasAnyRole = (roles: Roles[]): boolean => {
    return userHasAnyMembership(user, roles);
  };

  const hasAllRoles = (roles: Roles[]): boolean => {
    return userHasAllMemberships(user, roles);
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
