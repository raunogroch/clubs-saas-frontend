// features/auth/authHooks.ts

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  loginSuccess,
  loginFailure,
  setLoading,
  logout,
  clearError,
  updateUserAssignments,
} from "./authSlice";
import { useLoginMutation } from "./authApi";
import { shouldFetchUserAssignments } from "./userAssignmentsService";
import { useLazyGetCurrentUserAssignmentsQuery } from "../assignments/userAssignmentApi";
import type { LoginRequest } from "../../core/interfaces";

/**
 * Hook personalizado para manejar la autenticación
 *
 * Principios SOLID:
 * - SRP: Una responsabilidad - manejar autenticación
 * - DIP: Depende de servicios abstractos
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

  // Función de login que encapsula la lógica completa
  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      dispatch(setLoading(true));
      dispatch(clearError());

      try {
        const result = await loginMutation(credentials).unwrap();
        const { user: loginUser, token } = result;

        dispatch(loginSuccess({ user: loginUser, token }));

        console.log("[auth] usuario actual almacenado en login:", {
          ...loginUser,
          hasAssignments: (loginUser.assignments ?? []).length > 0,
          assignments: loginUser.assignments ?? [],
        });

        if (shouldFetchUserAssignments(loginUser)) {
          try {
            const assignments = await triggerGetCurrentUserAssignments(
              loginUser.id,
            ).unwrap();

            console.log("[auth] usuario actual con assignments cargados:", {
              userId: loginUser.id,
              hasAssignments: assignments.length > 0,
              assignments,
            });

            dispatch(updateUserAssignments(assignments));
          } catch (error) {
            dispatch(updateUserAssignments([]));
          }
        }

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error en la autenticación";
        dispatch(loginFailure(errorMessage));
        throw err;
      }
    },
    [dispatch, loginMutation, triggerGetCurrentUserAssignments],
  );

  // Función de logout
  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  // Función para limpiar errores
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    clearError: handleClearError,
  };
};
