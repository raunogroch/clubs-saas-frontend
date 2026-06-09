/**
 * core/types/Error.ts
 *
 * Tipos centralizados para manejo de errores
 */

export const ErrorCode = {
  // Auth errors
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",

  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",

  // Server errors
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",

  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT",

  // Unknown error
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

export interface AppError {
  code: ErrorCodeType;
  message: string;
  statusCode: number;
  details?: Record<string, string[]>;
  timestamp: string;
}

export class AppErrorClass implements AppError {
  code: ErrorCodeType;
  message: string;
  statusCode: number;
  details?: Record<string, string[]>;
  timestamp: string;

  constructor(
    code: ErrorCodeType,
    message: string,
    statusCode = 500,
    details?: Record<string, string[]>,
  ) {
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}
