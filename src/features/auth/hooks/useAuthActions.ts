import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { logout as logoutThunk } from "../store/authThunks";
import {
  selectUser,
  selectIsAuthenticated,
  selectLoginLoading,
  selectRegisterLoading,
  selectLogoutLoading,
  selectLoginError,
  selectRegisterError,
} from "../store/authSelectors";
import { authActions } from "../store/authSlice";

/**
 * Hook useAuthActions
 *
 * Proporciona funciones y estado de autenticación en un solo lugar
 *
 * USO:
 * const { user, logout, isLoading } = useAuthActions();
 *
 * VENTAJAS:
 * - Abstrae la complejidad de Redux
 * - Fácil de usar en componentes
 * - Tipos automáticos
 * - Funciones memoizadas para evitar re-renders
 */

export const useAuthActions = () => {
  const dispatch = useAppDispatch();

  // Selectores
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loginLoading = useAppSelector(selectLoginLoading);
  const registerLoading = useAppSelector(selectRegisterLoading);
  const logoutLoading = useAppSelector(selectLogoutLoading);
  const loginError = useAppSelector(selectLoginError);
  const registerError = useAppSelector(selectRegisterError);

  /**
   * Logout memoizado
   */
  const logout = useCallback(async () => {
    await dispatch(logoutThunk());
  }, [dispatch]);

  /**
   * Limpiar error memoizado
   */
  const clearLoginError = useCallback(() => {
    dispatch(authActions.clearError("login"));
  }, [dispatch]);

  const clearRegisterError = useCallback(() => {
    dispatch(authActions.clearError("register"));
  }, [dispatch]);

  return {
    // Data
    user,
    isAuthenticated,

    // Loading
    isLoggingOut: logoutLoading,
    isLoggingIn: loginLoading,
    isRegistering: registerLoading,
    isLoading: loginLoading || registerLoading || logoutLoading,

    // Errors
    loginError,
    registerError,

    // Actions
    logout,
    clearLoginError,
    clearRegisterError,
  };
};

/**
 * Hook useUserInfo
 *
 * Para acceder información formateada del usuario
 *
 * USO:
 * const { displayName, email } = useUserInfo();
 */

export const useUserInfo = () => {
  const user = useAppSelector(selectUser);

  return {
    user,
    displayName: user
      ? `${user.firstName} ${user.lastName}`.trim()
      : "Guest",
    email: user?.email || null,
    isAdmin: user?.roles.includes("admin") || false,
    isModerator: user?.roles.includes("moderator") || false,
    hasRole: (role: string) => user?.roles.includes(role) || false,
    hasPermission: (permission: string) =>
      user?.permissions.includes(permission) || false,
  };
};
