/**
 * features/auth/membershipService.ts
 *
 * Servicio para trabajar con memberships (roles con estado)
 *
 * Principios SOLID:
 * - SRP: Una sola responsabilidad - manipular memberships
 * - DIP: Depende de tipos abstractos (User, Membership, Roles)
 * - OCP: Extensible para agregar nuevas funcionalidades de memberships
 */

import type { User, Membership } from "../../core/interfaces";
import type { Roles } from "../../common/enums";
import { Roles as RolesEnum, Status } from "../../common/enums";

/**
 * Obtiene todas las memberships del usuario
 * Mantiene retrocompatibilidad con estructura antigua de roles/assignments
 *
 * @param user - Objeto del usuario
 * @returns Array de memberships
 */
export const getUserMemberships = (user: User | null): Membership[] => {
  if (!user) return [];

  // Si el usuario tiene memberships (nueva estructura), usarla
  if (user.memberships && user.memberships.length > 0) {
    return user.memberships;
  }

  // Retrocompatibilidad: construir memberships desde roles y assignments antiguos
  if (user.roles && user.roles.length > 0) {
    return user.roles.map((role) => ({
      role: role.role,
      assignmentId: role.id || "", // Intentar obtener del rol si existe
      status: Status.ACTIVE,
    }));
  }

  return [];
};

/**
 * Verifica si el usuario tiene un rol específico a través de memberships
 *
 * @param user - Objeto del usuario
 * @param role - Rol a verificar
 * @returns true si el usuario tiene el rol
 */
export const userHasMembership = (user: User | null, role: Roles): boolean => {
  const memberships = getUserMemberships(user);
  return memberships.some((membership) => membership.role === role);
};

/**
 * Verifica si el usuario tiene un rol con un estado específico
 *
 * @param user - Objeto del usuario
 * @param role - Rol a verificar
 * @param status - Status a verificar (ej: ACTIVE)
 * @returns true si el usuario tiene el rol con ese estado
 */
export const userHasMembershipWithStatus = (
  user: User | null,
  role: Roles,
  status: string,
): boolean => {
  const memberships = getUserMemberships(user);
  return memberships.some(
    (membership) => membership.role === role && membership.status === status,
  );
};

/**
 * Obtiene una membresía específica por rol
 *
 * @param user - Objeto del usuario
 * @param role - Rol a buscar
 * @returns Membership si existe, undefined si no
 */
export const getMembershipByRole = (
  user: User | null,
  role: Roles,
): Membership | undefined => {
  const memberships = getUserMemberships(user);
  return memberships.find((membership) => membership.role === role);
};

/**
 * Verifica si el usuario tiene múltiples roles (ANY)
 *
 * @param user - Objeto del usuario
 * @param roles - Array de roles a verificar
 * @returns true si el usuario tiene al menos uno de los roles
 */
export const userHasAnyMembership = (
  user: User | null,
  roles: Roles[],
): boolean => {
  return roles.some((role) => userHasMembership(user, role));
};

/**
 * Verifica si el usuario tiene todos los roles especificados
 *
 * @param user - Objeto del usuario
 * @param roles - Array de roles a verificar
 * @returns true si el usuario tiene todos los roles
 */
export const userHasAllMemberships = (
  user: User | null,
  roles: Roles[],
): boolean => {
  return roles.every((role) => userHasMembership(user, role));
};

/**
 * Determina si debe obtener assignments del usuario basado en memberships
 * Un usuario debe cargar assignments si tiene rol ADMIN o SUPER_ADMIN
 *
 * @param user - Objeto del usuario
 * @returns true si debe obtener assignments
 */
export const shouldFetchUserAssignments = (user: User | null): boolean => {
  return (
    userHasMembership(user, RolesEnum.ADMIN) ||
    userHasMembership(user, RolesEnum.SUPER_ADMIN)
  );
};

/**
 * Obtiene la membresía activa del usuario (primera con status ACTIVE)
 *
 * @param user - Objeto del usuario
 * @returns Primera membresía activa o undefined
 */
export const getActiveMembership = (
  user: User | null,
): Membership | undefined => {
  const memberships = getUserMemberships(user);
  return memberships.find((m) => m.status === Status.ACTIVE);
};

/**
 * Verifica si el usuario tiene alguna membresía activa
 *
 * @param user - Objeto del usuario
 * @returns true si tiene al menos una membresía activa
 */
export const hasActiveMembership = (user: User | null): boolean => {
  return !!getActiveMembership(user);
};
