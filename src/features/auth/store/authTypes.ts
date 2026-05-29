/**
 * Tipos para la feature de Autenticación
 * Mantiene separación clara entre tipos de negocio y estado
 */

/**
 * Modelo de Usuario
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Credenciales de Login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Credenciales de Registro
 */
export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Respuesta de Autenticación
 */
export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expiresIn: number;
}

/**
 * Estado de Petición Async
 * Se usa para tracking de estados: idle, loading, success, error
 */
export const AsyncStatus = {
  Idle: "idle" as const,
  Loading: "loading" as const,
  Success: "success" as const,
  Error: "error" as const,
} as const;

/**
 * Estado global de Autenticación
 * IMPORTANTE: Separar en tres partes:
 * 1. Data: información del usuario
 * 2. Status: estado de las peticiones async
 * 3. Error: información de errores
 */
export interface AuthState {
  // Información del usuario
  user: User | null;

  // Tokens
  accessToken: string | null;
  refreshToken: string | null;

  // Estado de autenticación
  isAuthenticated: boolean;

  // Estados de peticiones async
  loading: {
    login: boolean;
    register: boolean;
    logout: boolean;
    refresh: boolean;
    getCurrentUser: boolean;
  };

  // Errores
  error: {
    login: string | null;
    register: string | null;
    logout: string | null;
    refresh: string | null;
    getCurrentUser: string | null;
  };

  // Timestamps
  lastTokenRefresh: number | null;
}

/**
 * Payload para acción async thunk fulfuilled
 */
export interface AuthPayload {
  user: User;
  access_token: string;
  refresh_token: string;
}

/**
 * Tipo para códigos de error
 */
export const AuthErrorCode = {
  InvalidCredentials: "INVALID_CREDENTIALS",
  UserNotFound: "USER_NOT_FOUND",
  EmailAlreadyExists: "EMAIL_ALREADY_EXISTS",
  InvalidToken: "INVALID_TOKEN",
  TokenExpired: "TOKEN_EXPIRED",
  RefreshTokenExpired: "REFRESH_TOKEN_EXPIRED",
  UnauthorizedAccess: "UNAUTHORIZED_ACCESS",
  ServerError: "SERVER_ERROR",
  NetworkError: "NETWORK_ERROR",
} as const;
