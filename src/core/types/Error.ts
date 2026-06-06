/**
 * core/types/Error.ts
 *
 * Tipos centralizados para manejo de errores
 */

export interface AppError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, string[]>;
  timestamp: string;
}

// ErrorCode como objeto (no enum, por compatibilidad con erasableSyntaxOnly)
export const ErrorCode = {
  // Auth errors
  UNAUTHORIZED: "UNAUTHORIZED" as const,
  FORBIDDEN: "FORBIDDEN" as const,
  TOKEN_EXPIRED: "TOKEN_EXPIRED" as const,

  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR" as const,
  INVALID_INPUT: "INVALID_INPUT" as const,

  // Server errors
  NOT_FOUND: "NOT_FOUND" as const,
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR" as const,
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE" as const,

  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR" as const,
  TIMEOUT: "TIMEOUT" as const,

  // Unknown error
  UNKNOWN_ERROR: "UNKNOWN_ERROR" as const,
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

export class AppErrorClass implements AppError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, string[]>;
  timestamp: string;

  constructor(
    code: string,
    message: string,
    statusCode: number = 500,
    details?: Record<string, string[]>,
  ) {
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}
