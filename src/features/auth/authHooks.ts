// features/auth/authHooks.ts

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  loginSuccess,
  loginFailure,
  setLoading,
  logout,
  clearError,
} from "./authSlice";
import { useLoginMutation } from "./authApi";
import type { LoginRequest } from "../../core/interfaces";

/**
 * Hook personalizado para manejar la autenticación
 * Abstrae la lógica de Redux y RTK Query
 */
export const useAuthManager = () => {
  const dispatch = useAppDispatch();
  const [loginMutation] = useLoginMutation();

  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);

  // Función de login que encapsula toda la lógica
  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      dispatch(setLoading(true));
      dispatch(clearError());

      try {
        const result = await loginMutation(credentials).unwrap();
        dispatch(loginSuccess(result));
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error en la autenticación";
        dispatch(loginFailure(errorMessage));
        throw err;
      }
    },
    [dispatch, loginMutation],
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
