import type { Middleware } from "@reduxjs/toolkit";
import { getCurrentUser } from "./authThunks";
import { tokenService } from "../../../services/api";
import type { RootState } from "../../../app/store";

/**
 * Middleware para inicializar autenticación
 *
 * Cuando la app inicia:
 * 1. Verifica si hay tokens en localStorage
 * 2. Si existen, intenta obtener el usuario actual
 * 3. Si falla, limpia los tokens
 *
 * UBICACIÓN: Se registra en store.ts
 *
 * VENTAJAS:
 * - Restauración automática de sesión
 * - No requiere importar en componentes
 * - Ejecuta antes de que se renderice la UI
 */

let initialized = false;

export const authInitializationMiddleware: Middleware<
  {},
  RootState,
  any
> = (store) => (next) => (action: any) => {
  const result = next(action);

  // Ejecutar solo una vez cuando el store se inicializa
  if (!initialized && action.type === "@@INIT") {
    initialized = true;

    // Verificar si hay tokens guardados
    if (tokenService.hasToken()) {
      // Intentar restaurar sesión
      store.dispatch(getCurrentUser() as any);
    }
  }

  return result;
};

/**
 * Middleware alternativo más simple
 * Usar esta versión si la anterior no funciona
 */
export const createAuthInitializationMiddleware =
  (): Middleware<{}, RootState, any> =>
  (store) => {
    let isInitialized = false;

    return (next) => (action) => {
      // Restaurar sesión en el primer dispatch
      if (!isInitialized) {
        isInitialized = true;

        if (tokenService.hasToken()) {
          store.dispatch(getCurrentUser() as any);
        }
      }

      return next(action);
    };
  };
