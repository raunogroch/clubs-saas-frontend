/**
 * app/middleware/authMiddleware.ts
 *
 * Middleware para RTK Query que maneja errores de autenticación (401)
 * Dispara logout automático cuando el token expira o es inválido
 */

import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout } from "../../features/auth/authSlice";

/**
 * Middleware que escucha errores 401 de RTK Query
 * Dispara logout automático cuando el servidor rechaza el token
 */
export const authMiddleware: Middleware = (store) => (next) => (action) => {
  // Detectar si es una acción rechazada de RTK Query
  if (isRejectedWithValue(action)) {
    const payload = action.payload as FetchBaseQueryError;

    // Si es error 401, logout automático
    if (payload.status === 401) {
      console.warn(
        "Token rechazado por servidor (401). Disparando logout automático...",
      );

      // Esperar un tick para que se procese la acción actual
      setTimeout(() => {
        store.dispatch(logout());
      }, 0);
    }

    // Si es error 403 (sin permisos)
    if (payload.status === 403) {
      console.error("Usuario sin permisos para esta acción (403)");
      // Aquí podrías mostrar una notificación al usuario
      // pero no hacer logout
    }
  }

  return next(action);
};

export default authMiddleware;
