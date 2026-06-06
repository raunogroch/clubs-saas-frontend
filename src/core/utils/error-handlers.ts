/**
 * core/utils/error-handlers.ts
 *
 * Utilidades centralizadas para manejo de errores
 *
 * Principios SOLID:
 * - SRP: Una responsabilidad - mapear errores a formato estándar
 * - DIP: Componentes dependen de AppError (abstracción), no de implementación
 */

import { AppErrorClass, ErrorCode } from "../types/Error";
import type { AppError, ApiErrorResponse } from "../types";

/**
 * Mapea cualquier tipo de error a AppError estándar
 *
 * Soporta:
 * - RTK Query errors
 * - Axios errors
 * - Errores nativos de JavaScript
 * - AppError personalizados
 */
export const handleApiError = (error: unknown): AppError => {
  // RTK Query error
  if (
    error &&
    typeof error === "object" &&
    "status" in error &&
    "data" in error
  ) {
    const rtkError = error as any;
    const status = rtkError.status;
    const data = rtkError.data as ApiErrorResponse;

    // Errores específicos de autenticación
    if (status === 401) {
      return new AppErrorClass(
        ErrorCode.UNAUTHORIZED,
        data?.message || "No autorizado. Por favor, inicia sesión.",
        status,
        data?.details,
      );
    }

    if (status === 403) {
      return new AppErrorClass(
        ErrorCode.FORBIDDEN,
        data?.message || "No tienes permiso para acceder a este recurso.",
        status,
        data?.details,
      );
    }

    if (status === 404) {
      return new AppErrorClass(
        ErrorCode.NOT_FOUND,
        data?.message || "Recurso no encontrado.",
        status,
        data?.details,
      );
    }

    if (status === 422 || status === 400) {
      return new AppErrorClass(
        ErrorCode.VALIDATION_ERROR,
        data?.message || "Datos inválidos. Por favor, revisa tu entrada.",
        status,
        data?.details,
      );
    }

    if (status === 500) {
      return new AppErrorClass(
        ErrorCode.INTERNAL_SERVER_ERROR,
        data?.message ||
          "Error interno del servidor. Por favor, intenta más tarde.",
        status,
        data?.details,
      );
    }

    if (status === 503) {
      return new AppErrorClass(
        ErrorCode.SERVICE_UNAVAILABLE,
        data?.message || "El servicio no está disponible en este momento.",
        status,
        data?.details,
      );
    }

    // Error genérico con status
    return new AppErrorClass(
      data?.code || ErrorCode.UNKNOWN_ERROR,
      data?.message || `Error HTTP ${status}`,
      status,
      data?.details,
    );
  }

  // Error de validación (usuariamente de react-hook-form)
  if (error && typeof error === "object" && "fields" in error) {
    return new AppErrorClass(
      ErrorCode.VALIDATION_ERROR,
      "Errores de validación",
      400,
      (error as any).fields,
    );
  }

  // Error nativo de JavaScript
  if (error instanceof Error) {
    return new AppErrorClass(
      ErrorCode.UNKNOWN_ERROR,
      error.message || "Ocurrió un error desconocido",
      500,
    );
  }

  // String error
  if (typeof error === "string") {
    return new AppErrorClass(ErrorCode.UNKNOWN_ERROR, error, 500);
  }

  // Error desconocido
  return new AppErrorClass(
    ErrorCode.UNKNOWN_ERROR,
    "Ocurrió un error desconocido. Por favor, intenta de nuevo.",
    500,
  );
};

/**
 * Mapea statusCode HTTP a ErrorCode
 */
export const getErrorCodeFromStatus = (statusCode: number): string => {
  const mapping: Record<number, string> = {
    400: ErrorCode.INVALID_INPUT,
    401: ErrorCode.UNAUTHORIZED,
    403: ErrorCode.FORBIDDEN,
    404: ErrorCode.NOT_FOUND,
    422: ErrorCode.VALIDATION_ERROR,
    500: ErrorCode.INTERNAL_SERVER_ERROR,
    503: ErrorCode.SERVICE_UNAVAILABLE,
  };

  return mapping[statusCode] || ErrorCode.UNKNOWN_ERROR;
};

/**
 * Obtiene mensaje de error amigable para usuario
 */
export const getUserFriendlyErrorMessage = (error: AppError): string => {
  const messages: Record<string, string> = {
    [ErrorCode.UNAUTHORIZED]:
      "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
    [ErrorCode.FORBIDDEN]: "No tienes permiso para realizar esta acción.",
    [ErrorCode.NOT_FOUND]: "El recurso solicitado no existe.",
    [ErrorCode.VALIDATION_ERROR]:
      "Datos inválidos. Por favor, revisa tu entrada.",
    [ErrorCode.NETWORK_ERROR]:
      "Error de conexión. Verifica tu conexión a internet.",
    [ErrorCode.TIMEOUT]:
      "La solicitud tardó demasiado. Por favor, intenta de nuevo.",
    [ErrorCode.INTERNAL_SERVER_ERROR]:
      "Error interno del servidor. Por favor, intenta más tarde.",
  };

  return messages[error.code] || error.message;
};

/**
 * Extrae mensajes de validación de errors.details
 *
 * Útil para mostrar errores por campo en formularios
 */
export const getValidationErrorMessages = (
  error: AppError,
): Record<string, string> => {
  if (!error.details) return {};

  const messages: Record<string, string> = {};
  for (const [field, errorList] of Object.entries(error.details)) {
    messages[field] = Array.isArray(errorList)
      ? errorList[0]
      : String(errorList);
  }

  return messages;
};
