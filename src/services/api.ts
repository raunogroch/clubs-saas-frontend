import axios from "axios";
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { store } from "../app/store";
import { authActions } from "../features/auth/store/authSlice";

/**
 * API Base URL - Define según tu entorno
 * Usa variable de entorno en producción
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Token Storage Keys
 */
const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Interfaz para respuesta de refresh token
 */
interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

/**
 * Interfaz para error API
 */
interface ApiErrorResponse {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

/**
 * Crear instancia de Axios
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor - Añade token JWT a cada request
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Maneja errores y refresh token
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 Unauthorized - Intenta refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya está refrescando, añade a queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post<RefreshTokenResponse>(
          `${API_BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const { access_token, refresh_token } = response.data;

        localStorage.setItem(TOKEN_KEY, access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);

        apiClient.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        processQueue(null, access_token);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);

        // Dispatch logout action cuando refresh falla
        store.dispatch(authActions.logout());

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 403 Forbidden - Usuario no tiene permisos
    if (error.response?.status === 403) {
      const errorData = error.response.data as ApiErrorResponse;
      console.error("Forbidden:", errorData.message);
    }

    // Otros errores
    return Promise.reject(error);
  }
);

/**
 * Funciones auxiliares para token management
 */
export const tokenService = {
  /**
   * Obtener token de acceso
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Obtener refresh token
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Guardar tokens
   */
  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  /**
   * Limpiar tokens
   */
  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  /**
   * Verificar si existe token
   */
  hasToken: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

export default apiClient;
