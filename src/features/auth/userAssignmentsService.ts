/**
 * features/auth/userAssignmentsService.ts
 *
 * Servicio para obtener assignments de un usuario según su rol
 *
 * Principios SOLID:
 * - SRP: Una sola responsabilidad - obtener assignments del usuario
 * - DIP: Depende de tipos abstractos (User, Roles), no de implementaciones
 * - OCP: Extensible para agregar lógica de otros roles sin modificar
 */

import type { User } from "../../core/interfaces";
import { Roles } from "../../common/enums";

/**
 * Verifica si el usuario tiene el rol especificado
 * Maneja tanto objetos UserRole como strings directos
 *
 * @param user - Objeto del usuario
 * @param role - Rol a verificar
 * @returns true si el usuario tiene el rol
 */
const userHasRole = (user: User, role: string): boolean => {
  return user.roles.some((userRole) => {
    // Si es un objeto con propiedad 'role'
    if (typeof userRole === "object" && "role" in userRole) {
      return userRole.role === role;
    }
    // Si es un string directo
    return userRole === role;
  });
};

/**
 * Determina si debe obtener assignments del usuario basado en su rol
 *
 * @param user - Objeto del usuario
 * @returns true si debe obtener assignments
 */
export const shouldFetchUserAssignments = (user: User): boolean => {
  const isAdmin = userHasRole(user, Roles.ADMIN);
  const isSuperAdmin = userHasRole(user, Roles.SUPER_ADMIN);
  return isAdmin || isSuperAdmin;
};
