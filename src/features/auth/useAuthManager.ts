// features/auth/useAuthManager.ts

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  loginSuccess,
  loginFailure,
  setLoading,
  logout,
  clearError,
  setActiveAssignment,
} from "./authSlice";
import { useLoginMutation } from "./authApi";
import { shouldFetchUserAssignments } from "./userAssignmentsService";
import {
  normalizeLoginResponse,
  getLoginResponseDebugInfo,
} from "./loginResponseMapper";
import { useLazyGetCurrentUserAssignmentsQuery } from "../assignments/services/userAssignmentApi";
import type { LoginRequest } from "../../core/interfaces";
import { log, warn } from "../../app/logger";

/**
 * Hook personalizado para manejar la autenticación
 *
 * Maneja ambas estructuras de usuario:
 * - Nueva: user.memberships[] (roles con estado)
 * - Antigua: user.roles[] y user.assignments[] (retrocompatibilidad)
 * - Respuesta del backend: memberships a nivel raíz o dentro de user
 *
 * Principios SOLID:
 * - SRP: Una responsabilidad - manejar autenticación
 * - DIP: Depende de servicios abstractos (membershipService, loginResponseMapper)
 * - OCP: Extensible sin modificar código base
 * - LSP: Intercambiable con otras impl. de auth
 */
export const useAuthManager = () => {
  const dispatch = useAppDispatch();
  const [loginMutation] = useLoginMutation();
  const [triggerGetCurrentUserAssignments] =
    useLazyGetCurrentUserAssignmentsQuery();

  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);
  const activeAssignmentId = useAppSelector(
    (state) => state.auth.activeAssignmentId,
  );

  /**
   * Función de login que encapsula la lógica completa
   *
   * 1. Valida credenciales contra el API
   * 2. Normaliza respuesta (memberships puede estar en diferente estructura)
   * 3. Almacena usuario (con memberships) y token en Redux
   * 4. Si el usuario tiene role ADMIN/SUPER_ADMIN, carga sus assignments
   *
   * La nueva estructura de memberships permite que cada rol tenga:
   * - role: Tipo de rol (ADMIN, ATHLETE, PARENT, COACH, SUPER_ADMIN, etc.)
   * - assignmentId: ID de la asignación/asociación (puede ser null para SUPER_ADMIN)
   * - status: Estado de la membresía (ACTIVE, PENDING, etc.)
   *
   * El backend puede devolver memberships en dos formas:
   * 1. Dentro de user: { user: { memberships: [...] }, token }
   * 2. A nivel raíz: { user: {...}, memberships: [...], token }
   * El mapper normaliza ambas al formato 1
   */
  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      dispatch(setLoading(true));
      dispatch(clearError());

      try {
        const result = await loginMutation(credentials).unwrap();

        // Normalizar respuesta: mover memberships dentro de user si está a nivel raíz
        const normalizedResult = normalizeLoginResponse(result);
        const { user: loginUser, token } = normalizedResult;

        // Almacenar usuario con memberships
        dispatch(loginSuccess({ user: loginUser, token }));

        // Establecer el PRIMER assignment válido como activo (si existe)
        // IMPORTANTE: memberships[0] podría ser SUPER_ADMIN sin assignmentId (null)
        // Buscar el primer membership que TENGA un assignmentId
        const firstValidAssignmentId = loginUser.memberships?.find(
          (m) => m.assignmentId && m.assignmentId.trim().length > 0,
        )?.assignmentId;

        if (firstValidAssignmentId) {
          dispatch(setActiveAssignment(firstValidAssignmentId));
        }

        // Obtener información de debug para logging
        const debugInfo = getLoginResponseDebugInfo(normalizedResult);

        log("[auth] Usuario autenticado con memberships:", {
          ...debugInfo,
          tokenLength: token.length,
        });

        // Si tiene rol de admin/super_admin, cargar assignments
        if (shouldFetchUserAssignments(loginUser)) {
          try {
            const assignments = await triggerGetCurrentUserAssignments(
              loginUser.id,
            ).unwrap();

            log("[auth] Assignments cargados para admin/super_admin:", {
              userId: loginUser.id,
              count: assignments.length,
              assignments,
            });
          } catch {
            warn("[auth] Error al cargar assignments");
          }
        }

        return normalizedResult;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error en la autenticación";
        dispatch(loginFailure(errorMessage));
        throw err;
      }
    },
    [dispatch, loginMutation, triggerGetCurrentUserAssignments],
  );

  /**
   * Recarga los assignments del usuario actual
   * Solo funciona si el usuario tiene rol ADMIN/SUPER_ADMIN
   */
  const refreshAssignments = useCallback(async () => {
    if (!user?.id || !shouldFetchUserAssignments(user)) {
      return [];
    }

    try {
      const assignments = await triggerGetCurrentUserAssignments(
        user.id,
      ).unwrap();
      return assignments;
    } catch {
      return [];
    }
  }, [triggerGetCurrentUserAssignments, user]);

  /**
   * Función de logout
   * Limpia el usuario, token y estado de autenticación
   */
  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  /**
   * Función para limpiar errores de autenticación
   */
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    activeAssignmentId,
    login: handleLogin,
    logout: handleLogout,
    clearError: handleClearError,
    refreshAssignments,
  };
};
