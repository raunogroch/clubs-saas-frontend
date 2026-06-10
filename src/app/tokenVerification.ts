/**
 * app/tokenVerification.ts
 *
 * Utilidades para verificar y validar el token de autenticación
 * Sincroniza entre localStorage y Redux
 * Detecta si el token desaparece y dispara logout automático
 */

/**
 * Interfaz para datos persistidos por redux-persist
 */
interface PersistRoot {
  auth: {
    token: string | null;
    user: Record<string, unknown> | null;
    isAuthenticated: boolean;
  };
}

/**
 * Obtiene el token del localStorage
 * @returns Token si existe, null si no
 */
export const getTokenFromStorage = (): string | null => {
  try {
    if (typeof window === "undefined" || !window?.localStorage) {
      return null;
    }

    const persistedData = window.localStorage.getItem("persist:root");
    if (!persistedData) {
      return null;
    }

    const parsedData: PersistRoot = JSON.parse(persistedData);
    return parsedData.auth?.token || null;
  } catch (error) {
    console.error("Error obteniendo token de localStorage:", error);
    return null;
  }
};

/**
 * Verifica si el token existe en localStorage
 * @returns true si el token existe, false si no
 */
export const isTokenInStorage = (): boolean => {
  const token = getTokenFromStorage();
  return !!token;
};

/**
 * Decodifica base64 en el navegador
 * @param str - String en base64
 * @returns String decodificado o null si falla
 */
const decodeBase64 = (str: string): string | null => {
  try {
    return decodeURIComponent(
      atob(str)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
  } catch {
    return null;
  }
};

/**
 * Valida que el token tenga un formato válido (JWT)
 * No valida la firma, solo la estructura
 * @param token - Token a validar
 * @returns true si el token tiene formato JWT válido
 */
export const isValidTokenFormat = (token: string | null): boolean => {
  if (!token) return false;

  // Un JWT tiene 3 partes separadas por puntos
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  // Intentar decodificar cada parte como base64
  try {
    for (const part of parts) {
      const decoded = decodeBase64(part);
      if (!decoded) return false;
    }
    return true;
  } catch {
    return false;
  }
};

/**
 * Extrae el payload de un JWT sin validar firma
 * @param token - Token JWT
 * @returns Payload decodificado o null si inválido
 */
export const decodeJWT = (
  token: string | null,
): Record<string, unknown> | null => {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decodificar el payload (segunda parte)
    const payload = decodeBase64(parts[1]);
    if (!payload) return null;

    return JSON.parse(payload);
  } catch {
    return null;
  }
};

/**
 * Verifica si el token ha expirado (basado en el claim 'exp')
 * @param token - Token JWT
 * @returns true si ha expirado, false si no
 */
export const isTokenExpired = (token: string | null): boolean => {
  const payload = decodeJWT(token);
  if (!payload || typeof payload !== "object" || !("exp" in payload))
    return true;

  const exp = Number((payload as { exp?: number }).exp);
  if (!Number.isFinite(exp)) return true;

  // exp está en segundos, Date.now() en milisegundos
  const expirationTime = exp * 1000;
  const currentTime = Date.now();

  // Considerar expirado si quedan menos de 60 segundos
  const bufferTime = 60 * 1000; // 1 minuto
  return currentTime > expirationTime - bufferTime;
};

/**
 * Obtiene cuánto tiempo queda hasta que el token expire (en milisegundos)
 * @param token - Token JWT
 * @returns Milisegundos hasta expiración, null si no hay información
 */
export const getTokenExpirationTime = (token: string | null): number | null => {
  const payload = decodeJWT(token);
  if (!payload || typeof payload !== "object" || !("exp" in payload))
    return null;

  const exp = Number((payload as { exp?: number }).exp);
  if (!Number.isFinite(exp)) return null;

  const expirationTime = exp * 1000;
  const currentTime = Date.now();
  const timeRemaining = expirationTime - currentTime;

  return timeRemaining > 0 ? timeRemaining : 0;
};

/**
 * Verifica la integridad del token:
 * 1. Existe en localStorage
 * 2. Tiene formato válido
 * 3. No ha expirado
 * @returns Object con estado de validación
 */
export const validateToken = (
  token: string | null,
): {
  isValid: boolean;
  reason?: string;
  expiresIn?: number; // milisegundos
} => {
  // Verificar si existe
  if (!token) {
    return { isValid: false, reason: "Token no existe" };
  }

  // Verificar formato
  if (!isValidTokenFormat(token)) {
    return { isValid: false, reason: "Token con formato inválido" };
  }

  // Verificar expiración
  if (isTokenExpired(token)) {
    return { isValid: false, reason: "Token expirado" };
  }

  // Token válido
  const expiresIn = getTokenExpirationTime(token);
  return {
    isValid: true,
    expiresIn: expiresIn || undefined,
  };
};

/**
 * Sincroniza el estado del token entre localStorage y Redux
 * Útil para detectar si el token fue eliminado manualmente de localStorage
 * @param reduxToken - Token en Redux
 * @returns true si están sincronizados, false si hay discrepancia
 */
export const isTokenSynchronized = (reduxToken: string | null): boolean => {
  const storageToken = getTokenFromStorage();
  return reduxToken === storageToken;
};

/**
 * Limpia el token de localStorage
 * Se usa cuando se dispara logout
 */
export const clearTokenFromStorage = (): void => {
  try {
    if (typeof window === "undefined" || !window?.localStorage) {
      return;
    }

    const persistedData = window.localStorage.getItem("persist:root");
    if (persistedData) {
      const data: PersistRoot = JSON.parse(persistedData);
      data.auth.token = null;
      data.auth.isAuthenticated = false;
      window.localStorage.setItem("persist:root", JSON.stringify(data));
    }
  } catch (error) {
    console.error("Error limpiando token de localStorage:", error);
  }
};

/**
 * Monitorea cambios en el token en localStorage
 * Útil para detectar cambios en otras pestañas o eliminaciones manuales
 * @param callback - Función a ejecutar cuando cambie el token
 * @returns Función para desuscribirse del monitoreo
 */
export const watchTokenChanges = (
  callback: (token: string | null) => void,
): (() => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    // Solo procesar cambios de la clave 'persist:root'
    if (event.key !== "persist:root") return;

    const newToken = getTokenFromStorage();
    callback(newToken);
  };

  // Escuchar cambios en otras pestañas/ventanas
  window.addEventListener("storage", handleStorageChange);

  // Retornar función para desuscribirse
  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
};
