import { apiClient } from "../../../services/api";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  User,
} from "../store/authTypes";

/**
 * Servicio de Autenticación
 * Responsable ÚNICAMENTE de hacer llamadas a la API
 *
 * IMPORTANTE:
 * - Esta capa NO debe manejar lógica de Redux
 * - Esta capa NO debe guardar estado
 * - Esta capa solo hace llamadas HTTP y retorna datos
 */

const AUTH_BASE_PATH = "/auth";

export const authService = {
  /**
   * Login del usuario
   * POST /auth/login
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      `${AUTH_BASE_PATH}/login`,
      credentials
    );
    return response.data;
  },

  /**
   * Registro de usuario
   * POST /auth/register
   */
  register: async (
    credentials: RegisterCredentials
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      `${AUTH_BASE_PATH}/register`,
      credentials
    );
    return response.data;
  },

  /**
   * Logout del usuario
   * POST /auth/logout
   */
  logout: async (): Promise<void> => {
    await apiClient.post(`${AUTH_BASE_PATH}/logout`);
  },

  /**
   * Obtener usuario actual
   * GET /auth/me
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>(`${AUTH_BASE_PATH}/me`);
    return response.data;
  },

  /**
   * Refrescar token
   * POST /auth/refresh
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      `${AUTH_BASE_PATH}/refresh`,
      { refresh_token: refreshToken }
    );
    return response.data;
  },

  /**
   * Cambiar contraseña
   * POST /auth/change-password
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await apiClient.post(`${AUTH_BASE_PATH}/change-password`, {
      current_password: currentPassword,
      new_password: newPassword,
    });
  },

  /**
   * Solicitar reset de contraseña
   * POST /auth/forgot-password
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post(`${AUTH_BASE_PATH}/forgot-password`, { email });
  },

  /**
   * Reset de contraseña con token
   * POST /auth/reset-password
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post(`${AUTH_BASE_PATH}/reset-password`, {
      token,
      new_password: newPassword,
    });
  },
};
