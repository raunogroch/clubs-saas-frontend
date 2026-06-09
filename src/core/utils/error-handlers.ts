/**
 * core/utils/error-handlers.ts
 *
 * Utilidades centralizadas para manejo de errores
 *
 * Principios SOLID:
 * - SRP: Una responsabilidad - mapear errores a formato estándar
 * - OCP: Abierto para extensión, cerrado para modificación
 * - DIP: Dependencia sobre abstracciones
 */

import {
  AppErrorClass,
  ErrorCode,
  type AppError,
  type ErrorCodeType,
} from "../types/Error";

import type { ApiErrorResponse } from "../types";

const HTTP_ERROR_MAP: Record<
  number,
  {
    code: ErrorCodeType;
    defaultMessage: string;
  }
> = {
  400: {
    code: ErrorCode.INVALID_INPUT,
    defaultMessage: "Datos inválidos. Por favor, revisa tu entrada.",
  },

  401: {
    code: ErrorCode.UNAUTHORIZED,
    defaultMessage: "No autorizado. Por favor, inicia sesión.",
  },

  403: {
    code: ErrorCode.FORBIDDEN,
    defaultMessage: "No tienes permiso para acceder a este recurso.",
  },

  404: {
    code: ErrorCode.NOT_FOUND,
    defaultMessage: "Recurso no encontrado.",
  },

  422: {
    code: ErrorCode.VALIDATION_ERROR,
    defaultMessage: "Datos inválidos. Por favor, revisa tu entrada.",
  },

  500: {
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    defaultMessage: "Error interno del servidor. Por favor, intenta más tarde.",
  },

  503: {
    code: ErrorCode.SERVICE_UNAVAILABLE,
    defaultMessage: "El servicio no está disponible en este momento.",
  },
};

const USER_FRIENDLY_MESSAGES: Record<ErrorCodeType, string> = {
  [ErrorCode.UNAUTHORIZED]:
    "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",

  [ErrorCode.FORBIDDEN]: "No tienes permiso para realizar esta acción.",

  [ErrorCode.TOKEN_EXPIRED]: "Tu sesión ha expirado. Inicia sesión nuevamente.",

  [ErrorCode.VALIDATION_ERROR]:
    "Datos inválidos. Por favor, revisa tu entrada.",

  [ErrorCode.INVALID_INPUT]: "La información proporcionada es inválida.",

  [ErrorCode.NOT_FOUND]: "El recurso solicitado no existe.",

  [ErrorCode.INTERNAL_SERVER_ERROR]:
    "Error interno del servidor. Por favor, intenta más tarde.",

  [ErrorCode.SERVICE_UNAVAILABLE]:
    "El servicio no está disponible en este momento.",

  [ErrorCode.NETWORK_ERROR]:
    "Error de conexión. Verifica tu conexión a internet.",

  [ErrorCode.TIMEOUT]:
    "La solicitud tardó demasiado. Por favor, intenta nuevamente.",

  [ErrorCode.UNKNOWN_ERROR]: "Ha ocurrido un error inesperado.",
};

type RtkQueryError = {
  status: number | string;
  data?: unknown;
  error?: string;
};

const isAppError = (error: unknown): error is AppErrorClass => {
  return error instanceof AppErrorClass;
};

const isRtkQueryError = (error: unknown): error is RtkQueryError => {
  return !!error && typeof error === "object" && "status" in error;
};

const isValidationError = (
  error: unknown,
): error is { fields: Record<string, unknown> } => {
  return !!error && typeof error === "object" && "fields" in error;
};

const createAppError = (
  code: ErrorCodeType,
  message?: string,
  statusCode = 500,
  details?: Record<string, string[]>,
): AppError => {
  return new AppErrorClass(
    code,
    message ??
      USER_FRIENDLY_MESSAGES[code] ??
      USER_FRIENDLY_MESSAGES[ErrorCode.UNKNOWN_ERROR],
    statusCode,
    details,
  );
};

/**
 * Convierte cualquier error a AppError
 */
export const handleApiError = (error: unknown): AppError => {
  /**
   * Ya es AppError
   */
  if (isAppError(error)) {
    return error;
  }

  /**
   * RTK Query
   */
  if (isRtkQueryError(error)) {
    const status = error.status;

    if (status === "FETCH_ERROR") {
      return createAppError(
        ErrorCode.NETWORK_ERROR,
        "Error de conexión. Verifica tu conexión a internet.",
        0,
      );
    }

    if (status === "TIMEOUT_ERROR") {
      return createAppError(
        ErrorCode.TIMEOUT,
        "La solicitud excedió el tiempo de espera.",
        0,
      );
    }

    if (status === "PARSING_ERROR") {
      return createAppError(
        ErrorCode.UNKNOWN_ERROR,
        "Error al procesar la respuesta del servidor.",
      );
    }

    if (status === "CUSTOM_ERROR") {
      return createAppError(
        ErrorCode.UNKNOWN_ERROR,
        error.error || "Error desconocido.",
      );
    }

    if (typeof status === "number") {
      const data = error.data as ApiErrorResponse | undefined;

      const config = HTTP_ERROR_MAP[status];

      if (config) {
        return createAppError(
          config.code,
          data?.message || config.defaultMessage,
          status,
        );
      }

      return createAppError(
        ErrorCode.UNKNOWN_ERROR,
        data?.message || `Error HTTP ${status}`,
        status,
      );
    }
  }

  /**
   * Errores de validación
   */
  if (isValidationError(error)) {
    return createAppError(
      ErrorCode.VALIDATION_ERROR,
      "Errores de validación",
      400,
    );
  }

  /**
   * Error nativo JS
   */
  if (error instanceof Error) {
    return createAppError(ErrorCode.UNKNOWN_ERROR, error.message);
  }

  /**
   * String
   */
  if (typeof error === "string") {
    return createAppError(ErrorCode.UNKNOWN_ERROR, error);
  }

  /**
   * Fallback
   */
  return createAppError(
    ErrorCode.UNKNOWN_ERROR,
    "Ocurrió un error desconocido. Por favor, intenta nuevamente.",
  );
};

/**
 * Obtiene ErrorCode desde un HTTP Status
 */
export const getErrorCodeFromStatus = (statusCode: number): ErrorCodeType => {
  return HTTP_ERROR_MAP[statusCode]?.code ?? ErrorCode.UNKNOWN_ERROR;
};

/**
 * Obtiene mensaje amigable para UI
 */
export const getUserFriendlyErrorMessage = (error: AppError): string => {
  return USER_FRIENDLY_MESSAGES[error.code] ?? error.message;
};

/**
 * Convierte details a errores por campo
 */
export const getValidationErrorMessages = (
  error: AppError,
): Record<string, string> => {
  if (!error.details) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(error.details).map(([field, errors]) => [
      field,
      Array.isArray(errors) ? errors[0] : String(errors),
    ]),
  );
};
