/**
 * core/types/index.ts
 *
 * Exporta todos los tipos centralizados
 * Re-exporta desde core/interfaces para compatibilidad
 */

// Re-export desde interfaces centralizadas
export type {
  User,
  UserRole,
  Membership,
  UserAssignments,
  CreateUserDto,
  UpdateUserDto,
  UserListResponse,
} from "../interfaces";

export type {
  ApiResponse,
  PaginationMeta,
  PaginatedResponse,
  ApiErrorResponse,
  PaginationParams,
} from "../interfaces";

export type {
  LoginCredentials,
  LoginResponse,
  AuthState,
  AuthContextType,
} from "../interfaces";

export { ErrorCode, AppErrorClass } from "./Error";
export type { AppError as IAppError } from "./Error";
export type { UserFormInputs } from "./UsersForm";
