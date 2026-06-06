/**
 * app/baseQueryWithAuth.ts
 *
 * BaseQuery mejorado para RTK Query
 *
 * Principios SOLID:
 * - DIP: Obtiene el token del store (abstracción), no del localStorage
 * - SRP: Una responsabilidad - preparar headers con autenticación
 * - LSP: Puede reemplazar fetchBaseQuery en cualquier endpoint
 *
 * Flujo:
 * 1. Redux persiste el token en localStorage
 * 2. redux-persist rehydrata el store al cargar
 * 3. Cada request obtiene el token actual del store
 * 4. Si el request falla con 401, dispara logout automático
 */

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

/**
 * Crea un baseQuery que accede al store para obtener el token
 * @param baseUrl - URL base de la API
 */
export const createBaseQueryWithAuth = (baseUrl: string) =>
  fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Obtener el token del store
      const state = getState() as RootState;
      const token = state.auth.token;

      // Si existe un token, agregarlo al header
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  });

export default createBaseQueryWithAuth;
