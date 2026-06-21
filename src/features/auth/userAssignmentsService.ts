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
import { shouldFetchUserAssignments as membershipShouldFetch } from "./membershipService";


/**
 * Determina si debe obtener assignments del usuario basado en su rol
 *
 * Usa el nuevo membershipService si es posible, con retrocompatibilidad
 *
 * @param user - Objeto del usuario
 * @returns true si debe obtener assignments
 */
export const shouldFetchUserAssignments = (user: User): boolean => {
  // Delegar al membershipService que maneja ambas estructuras
  return membershipShouldFetch(user);
};
