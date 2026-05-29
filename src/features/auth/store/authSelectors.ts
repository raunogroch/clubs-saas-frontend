import type { RootState } from "../../../app/store";
import type { AuthState, User } from "./authTypes";
import { createSelector } from "@reduxjs/toolkit";

/**
 * Selectores para Autenticación
 *
 * Los selectores son funciones que extraen datos del estado.
 *
 * VENTAJAS:
 * - Tipado automático
 * - Memoización (evita renders innecesarios)
 * - Lógica centralizada para derivar datos
 * - Fácil de testear
 * - Desacoplamiento: el componente no conoce la estructura del estado
 *
 * TIPOS DE SELECTORES:
 * 1. Simples: Solo extraen datos sin lógica
 * 2. Derived: Combinan múltiples datos para derivar algo nuevo
 * 3. Memoized: Usan createSelector para evitar cálculos innecesarios
 */

/**
 * Selector base del estado de autenticación
 * Todos los otros selectores derivan de este
 */
const selectAuthState = (state: RootState): AuthState => state.auth;

// ==================== SELECTORES SIMPLES ====================

/**
 * Obtener el usuario actual
 */
export const selectUser = createSelector(
  [selectAuthState],
  (auth): User | null => auth.user
);

/**
 * Obtener si está autenticado
 */
export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth): boolean => auth.isAuthenticated
);

/**
 * Obtener token de acceso
 */
export const selectAccessToken = createSelector(
  [selectAuthState],
  (auth): string | null => auth.accessToken
);

/**
 * Obtener refresh token
 */
export const selectRefreshToken = createSelector(
  [selectAuthState],
  (auth): string | null => auth.refreshToken
);

// ==================== SELECTORES DE LOADING ====================

/**
 * Estado de loading para login
 */
export const selectLoginLoading = createSelector(
  [selectAuthState],
  (auth): boolean => auth.loading.login
);

/**
 * Estado de loading para register
 */
export const selectRegisterLoading = createSelector(
  [selectAuthState],
  (auth): boolean => auth.loading.register
);

/**
 * Estado de loading para logout
 */
export const selectLogoutLoading = createSelector(
  [selectAuthState],
  (auth): boolean => auth.loading.logout
);

/**
 * Estado de loading para getCurrentUser
 */
export const selectGetCurrentUserLoading = createSelector(
  [selectAuthState],
  (auth): boolean => auth.loading.getCurrentUser
);

/**
 * Estado de loading para refresh token
 */
export const selectRefreshTokenLoading = createSelector(
  [selectAuthState],
  (auth): boolean => auth.loading.refresh
);

/**
 * Cualquier loading activo
 */
export const selectIsLoading = createSelector(
  [selectAuthState],
  (auth): boolean =>
    auth.loading.login ||
    auth.loading.register ||
    auth.loading.logout ||
    auth.loading.getCurrentUser ||
    auth.loading.refresh
);

// ==================== SELECTORES DE ERROR ====================

/**
 * Error de login
 */
export const selectLoginError = createSelector(
  [selectAuthState],
  (auth): string | null => auth.error.login
);

/**
 * Error de register
 */
export const selectRegisterError = createSelector(
  [selectAuthState],
  (auth): string | null => auth.error.register
);

/**
 * Error de logout
 */
export const selectLogoutError = createSelector(
  [selectAuthState],
  (auth): string | null => auth.error.logout
);

/**
 * Error de getCurrentUser
 */
export const selectGetCurrentUserError = createSelector(
  [selectAuthState],
  (auth): string | null => auth.error.getCurrentUser
);

/**
 * Error de refresh token
 */
export const selectRefreshTokenError = createSelector(
  [selectAuthState],
  (auth): string | null => auth.error.refresh
);

// ==================== SELECTORES DERIVADOS (COMPUTED) ====================

/**
 * Obtener información del usuario formateada
 * Ejemplo de selector derivado que combina datos
 */
export const selectUserDisplayName = createSelector(
  [selectUser],
  (user): string => {
    if (!user) return "Guest";
    return `${user.firstName} ${user.lastName}`.trim();
  }
);

/**
 * Verificar si el usuario tiene un rol específico
 * @param role - Rol a verificar
 */
export const selectUserHasRole = (role: string) =>
  createSelector([selectUser], (user): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  });

/**
 * Verificar si el usuario tiene un permiso específico
 * @param permission - Permiso a verificar
 */
export const selectUserHasPermission = (permission: string) =>
  createSelector([selectUser], (user): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  });

/**
 * Obtener email del usuario
 */
export const selectUserEmail = createSelector(
  [selectUser],
  (user): string | null => user?.email || null
);

/**
 * Estado general de autenticación (para debuggeo)
 */
export const selectAuthDebug = createSelector(
  [selectAuthState],
  (auth) => ({
    isAuthenticated: auth.isAuthenticated,
    hasUser: !!auth.user,
    hasAccessToken: !!auth.accessToken,
    hasRefreshToken: !!auth.refreshToken,
    loading: auth.loading,
    errors: auth.error,
    userId: auth.user?.id || null,
  })
);

/**
 * Obtener información para headers HTTP
 * Usado por interceptores
 */
export const selectAuthHeaders = createSelector(
  [selectAccessToken],
  (accessToken) => ({
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  })
);

/**
 * Verificar si la sesión necesita refresh
 * Si el último refresh fue hace más de X tiempo
 */
export const selectNeedsTokenRefresh = createSelector(
  [selectAuthState],
  (auth): boolean => {
    if (!auth.lastTokenRefresh) return false;

    const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutos
    const timeSinceLastRefresh = Date.now() - auth.lastTokenRefresh;

    return timeSinceLastRefresh > REFRESH_INTERVAL;
  }
);
