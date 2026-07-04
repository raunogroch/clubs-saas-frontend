/**
 * hooks/useTokenValidation.ts
 *
 * Hook para monitorear y validar el token de autenticación
 * - Verifica si el token existe en localStorage
 * - Detecta cambios en el token
 * - Sincroniza con Redux si hay discrepancias
 * - Dispara logout automático si el token desaparece
 */

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { watchTokenChanges, validateToken } from "../app/tokenVerification";
import { logout as logoutAction } from "../features/auth";

/**
 * Hook que monitorea cambios de token desde otras pestañas
 * - Se renderiza siempre en AppInitializer (no condicionalmente)
 * - Detecta logout desde otras pestañas via localStorage events
 * - Dispara logout automático si el token desaparece
 */
export const useTokenValidation = () => {
  const dispatch = useAppDispatch();
  const reduxToken = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Monitorear cambios en localStorage (detecta logout desde otras pestañas)
  // Esta es la ÚNICA validación: si el token desaparece de localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const unwatch = watchTokenChanges((newToken) => {
      // Si el token desaparece de localStorage pero Redux dice que está autenticado
      if (isAuthenticated && !newToken) {
        // Token cleanup: dispatch logout
        dispatch(logoutAction());
      }
    });

    return () => {
      unwatch();
    };
  }, [isAuthenticated, reduxToken, dispatch]);

  return {
    isTokenValid: isAuthenticated && !!reduxToken,
  };
};

/**
 * Hook para obtener cuándo expirará el token
 * Útil para mostrar advertencias al usuario
 */
export const useTokenExpiration = () => {
  const reduxToken = useAppSelector((state) => state.auth.token);

  const validation = validateToken(reduxToken);

  return {
    expiresIn: validation.expiresIn || null, // milisegundos
    isExpired: !validation.isValid,
    reason: validation.reason,
  };
};

/**
 * Hook que dispara logout automático cuando el token expira
 * @param onBeforeLogout - Callback opcional antes de logout
 */
export const useAutoLogoutOnTokenExpiry = (onBeforeLogout?: () => void) => {
  const dispatch = useAppDispatch();
  const { expiresIn, isExpired } = useTokenExpiration();

  useEffect(() => {
    // Si ya está expirado, logout inmediatamente
    if (isExpired) {
      onBeforeLogout?.();
      dispatch(logoutAction());
      return;
    }

    // Si hay tiempo de expiración, programar logout
    if (expiresIn && expiresIn > 0) {
      // Ejecutar 1 minuto antes de la expiración
      const timeoutTime = Math.max(expiresIn - 60 * 1000, 0);

      const timeout = setTimeout(() => {
        // Token expiration: trigger auto-logout
        onBeforeLogout?.();
        dispatch(logoutAction());
      }, timeoutTime);

      return () => clearTimeout(timeout);
    }
  }, [expiresIn, isExpired, dispatch, onBeforeLogout]);
};
