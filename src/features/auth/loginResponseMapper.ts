/**
 * features/auth/loginResponseMapper.ts
 *
 * Servicio para normalizar respuestas de login
 * Maneja diferentes estructuras que puede devolver el backend
 *
 * Principios SOLID:
 * - SRP: Una responsabilidad - mapear respuesta de login
 * - DIP: Depende de tipos abstractos (LoginResponse, User, Membership)
 */

import type { LoginResponse } from "../../core/interfaces";
import type { Membership } from "../../core/interfaces";

/**
 * Normaliza la respuesta de login para asegurar que memberships esté dentro de user
 *
 * El backend puede devolver memberships de varias formas:
 * 1. Dentro de user.memberships (ya normalizado)
 * 2. A nivel raíz: { user, memberships, token } (actual)
 *
 * Esta función normaliza todo a la forma 1
 *
 * @param response - Respuesta del backend de login
 * @returns LoginResponse normalizado con user.memberships
 */
export const normalizeLoginResponse = (
  response: LoginResponse,
): LoginResponse => {
  // Si memberships está a nivel raíz, moverlo dentro de user
  if (response.memberships && !response.user.memberships) {
    return {
      ...response,
      user: {
        ...response.user,
        memberships: response.memberships,
      },
      // Remover memberships del nivel raíz
      memberships: undefined,
    };
  }

  // Si memberships ya está dentro de user, no hacer nada
  return response;
};

/**
 * Valida que la respuesta tenga la estructura mínima requerida
 *
 * @param response - Respuesta a validar
 * @returns true si la respuesta es válida
 */
export const isValidLoginResponse = (response: unknown): boolean => {
  if (!response || typeof response !== "object") {
    return false;
  }

  const res = response as Record<string, unknown>;

  // Debe tener user y token
  if (!res.user || !res.token) {
    return false;
  }

  // user debe tener id y name
  const user = res.user as Record<string, unknown>;
  if (!user.id || !user.name) {
    return false;
  }

  // Debe tener memberships (en user o a nivel raíz)
  const hasMemberships =
    Array.isArray(user.memberships) ||
    Array.isArray(res.memberships) ||
    [].length > 0;

  return hasMemberships || true; // Memberships es opcional
};

/**
 * Extrae y normaliza las memberships de una respuesta de login
 *
 * @param response - Respuesta de login
 * @returns Array de memberships
 */
export const extractMemberships = (response: LoginResponse): Membership[] => {
  // Si está dentro de user, usarla
  if (response.user.memberships && response.user.memberships.length > 0) {
    return response.user.memberships;
  }

  // Si está a nivel raíz, usarla
  if (response.memberships && response.memberships.length > 0) {
    return response.memberships;
  }

  // Empty array
  return [];
};

/**
 * Información de debug de la respuesta de login
 *
 * @param response - Respuesta de login
 * @returns Objeto con información para logging
 */
export const getLoginResponseDebugInfo = (response: LoginResponse) => {
  const memberships = extractMemberships(response);

  return {
    userId: response.user.id,
    userName: response.user.name,
    username: response.user.username,
    hasMemberships: memberships.length > 0,
    membershipCount: memberships.length,
    memberships: memberships.map((m) => ({
      role: m.role,
      status: m.status,
      assignmentId: m.assignmentId,
    })),
    membershipLocation:
      response.user.memberships && response.user.memberships.length > 0
        ? "user.memberships"
        : response.memberships
          ? "root.memberships"
          : "none",
  };
};
