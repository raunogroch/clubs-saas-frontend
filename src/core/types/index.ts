/**
 * core/types/index.ts
 *
 * Exporta todos los tipos centralizados
 * Punto de entrada para tipos de toda la aplicación
 */

export type {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserListResponse,
  PaginationMeta,
} from "./User";
export type {
  ApiResponse,
  PaginatedResponse,
  ApiErrorResponse,
  PaginationParams,
} from "./Api";
export type {
  AppError,
  AuthState,
  LoginCredentials,
  LoginResponse,
  AuthContextType,
} from "./Auth";
export { ErrorCode, AppErrorClass } from "./Error";
export type { AppError as IAppError } from "./Error";
