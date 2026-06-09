import type { User } from ".";
import type { Roles } from "../../common";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  expiresIn?: number; // en segundos
  refreshToken?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
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
