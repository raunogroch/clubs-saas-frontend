/**
 * core/hooks/usePermissions.ts
 *
 * Hook para validar roles y permisos del usuario actual
 *
 * Principios SOLID:
 * - SRP: Una responsabilidad - validar permisos
 * - ISP: Interfaz específica para permisos, no mezclar con autenticación
 *
 * Uso:
 * ```typescript
 * const { hasRole, hasPermission, can } = usePermissions();
 *
 * if (hasRole('ADMIN')) {
 *   // Mostrar UI de admin
 * }
 *
 * if (can('delete:users')) {
 *   // Mostrar botón delete
 * }
 * ```
 */

import { useAuth } from "./useAuth";

export interface UsePermissionsReturn {
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  can: (permission: string) => boolean; // Alias para hasPermission
  isAdmin: () => boolean;
  isModerator: () => boolean;
  isUser: () => boolean;
}

/**
 * Hook que proporciona métodos para validar roles y permisos
 *
 * Características:
 * - Validación de roles individuales
 * - Validación de múltiples roles (ANY / ALL)
 * - Validación de permisos específicos
 * - Helpers predefinidos (isAdmin, isModerator, etc.)
 *
 * @returns {UsePermissionsReturn}
 */
export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.some((role) => user.roles.includes(role));
  };

  const hasAllRoles = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.every((role) => user.roles.includes(role));
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.some((p) => user.permissions?.includes(p));
  };

  const can = (permission: string): boolean => {
    return hasPermission(permission);
  };

  const isAdmin = (): boolean => {
    return hasRole("ADMIN");
  };

  const isModerator = (): boolean => {
    return hasRole("MODERATOR");
  };

  const isUser = (): boolean => {
    return hasRole("USER");
  };

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    can,
    isAdmin,
    isModerator,
    isUser,
  };
};
