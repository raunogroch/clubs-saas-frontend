/**
 * core/hooks/useAuth.ts
 *
 * Hook centralizado para autenticación
 *
 * Principios SOLID:
 * - LSP: Reemplaza a AuthContext con una interfaz consistente
 * - DIP: Componentes dependen de este hook abstracto, no de Redux directamente
 * - SRP: Una sola responsabilidad - manejar autenticación
 *
 * Uso:
 * ```typescript
 * const { user, isAuthenticated, logout } = useAuth();
 * ```
 */

import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import { logout as logoutAction } from "../../features/auth/authSlice";
import type { User } from "../types";

export interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  logout: () => void;
}

/**
 * Hook que proporciona acceso a información de autenticación
 *
 * Abstracts:
 * - Redux selectors
 * - localStorage si es necesario
 * - Lógica de validación de token
 *
 * @returns {UseAuthReturn}
 */
export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);

  const logout = () => {
    dispatch(logoutAction());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    logout,
  };
};
