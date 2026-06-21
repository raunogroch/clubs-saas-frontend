import type { User, Membership } from ".";
import type { Roles } from "../../common";

export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * LoginResponse puede venir de dos formas:
 * 1. user.memberships incluida en user (nueva estructura normalizada)
 * 2. memberships a nivel raíz (estructura del backend actual)
 *
 * loginResponseMapper.ts normaliza ambas formas
 */
export interface LoginResponse {
  user: User;
  token: string;
  expiresIn?: number; // en segundos
  refreshToken?: string;
  // Permitir memberships a nivel raíz (será mapeado dentro de user)
  memberships?: Membership[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  activeAssignmentId: string | null; // Assignment actualmente seleccionado
}

export interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UsePermissionsReturn {
  hasRole: (role: Roles) => boolean;
  hasAnyRole: (roles: Roles[]) => boolean;
  hasAllRoles: (roles: Roles[]) => boolean;
  isAdmin: () => boolean;
  isParent: () => boolean;
  isAthlete: () => boolean;
}
