import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/authService";
import { tokenService } from "../../../services/api";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthPayload,
  User,
} from "./authTypes";
import { AuthErrorCode } from "./authTypes";
import type { RootState } from "../../../app/store";

/**
 * Async Thunks para Autenticación
 *
 * Los Thunks son funciones que manejan lógica async
 * createAsyncThunk automáticamente crea 3 acciones: pending, fulfilled, rejected
 *
 * Naming convention: `feature/action`
 */

/**
 * Login async thunk
 * Ejemplo: dispatch(login(credentials))
 *
 * Estados automáticos:
 * - pending: loading.login = true
 * - fulfilled: usuario autenticado + tokens guardados
 * - rejected: error.login = mensaje
 */
export const login = createAsyncThunk<
  AuthPayload,
  LoginCredentials,
  {
    state: RootState;
    rejectValue: {
      code: string;
      message: string;
    };
  }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);

    // Guardar tokens en localStorage
    tokenService.setTokens(response.access_token, response.refresh_token);

    return {
      user: response.user,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    };
  } catch (error: unknown) {
    const err = error as any;

    const code = err.response?.data?.code || AuthErrorCode.ServerError;
    const message =
      err.response?.data?.message ||
      err.message ||
      "Error during login. Please try again.";
    const statusCode = err.response?.status || 400;

    console.error("[Login Error]", { code, message, statusCode });

    return rejectWithValue({
      code,
      message,
    });
  }
});

/**
 * Register async thunk
 */
export const register = createAsyncThunk<
  AuthPayload,
  RegisterCredentials,
  {
    state: RootState;
    rejectValue: {
      code: string;
      message: string;
    };
  }
>("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.register(credentials);

    tokenService.setTokens(response.access_token, response.refresh_token);

    return {
      user: response.user,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    };
  } catch (error: unknown) {
    const err = error as any;

    const code = err.response?.data?.code || AuthErrorCode.ServerError;
    const message =
      err.response?.data?.message ||
      err.message ||
      "Error during registration. Please try again.";

    console.error("[Register Error]", { code, message });

    return rejectWithValue({
      code,
      message,
    });
  }
});

/**
 * Logout async thunk
 * Nota: Este thunk puede ser synchronous si no llamas al servidor
 * Pero mejor práctica es hacerlo async para futuras llamadas
 */
export const logout = createAsyncThunk<
  void,
  void,
  {
    state: RootState;
    rejectValue: {
      code: string;
      message: string;
    };
  }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    // Llamar al servidor para invalidar sesión
    await authService.logout();

    // Limpiar tokens locales
    tokenService.clearTokens();
  } catch (error: unknown) {
    const err = error as any;

    // Incluso si falla, limpiamos los tokens locales
    tokenService.clearTokens();

    const code = err.response?.data?.code || AuthErrorCode.ServerError;
    const message =
      err.response?.data?.message || "Error during logout. Please try again.";

    console.error("[Logout Error]", { code, message });

    return rejectWithValue({
      code,
      message,
    });
  }
});

/**
 * Get current user thunk
 * Se ejecuta al inicializar la app para restaurar sesión
 */
export const getCurrentUser = createAsyncThunk<
  User,
  void,
  {
    state: RootState;
    rejectValue: {
      code: string;
      message: string;
    };
  }
>("auth/getCurrentUser", async (_, { rejectWithValue }) => {
  try {
    // Verificar que existe token
    if (!tokenService.hasToken()) {
      return rejectWithValue({
        code: AuthErrorCode.InvalidToken,
        message: "No authentication token found",
      });
    }

    const user = await authService.getCurrentUser();
    return user;
  } catch (error: unknown) {
    const err = error as any;

    // Si 401, los tokens son inválidos
    if (err.response?.status === 401) {
      tokenService.clearTokens();
    }

    const code = err.response?.data?.code || AuthErrorCode.ServerError;
    const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch user information";

    console.error("[Get Current User Error]", { code, message });

    return rejectWithValue({
      code,
      message,
    });
  }
});

/**
 * Refresh token thunk
 * Se ejecuta automáticamente cuando token está expirando
 */
export const refreshTokenThunk = createAsyncThunk<
  AuthPayload,
  void,
  {
    state: RootState;
    rejectValue: {
      code: string;
      message: string;
    };
  }
>("auth/refreshToken", async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const refreshToken = state.auth.refreshToken;

    if (!refreshToken) {
      return rejectWithValue({
        code: AuthErrorCode.RefreshTokenExpired,
        message: "No refresh token available",
      });
    }

    const response = await authService.refreshToken(refreshToken);

    tokenService.setTokens(response.access_token, response.refresh_token);

    return {
      user: response.user,
      access_token: response.access_token,
      refresh_token: response.refresh_token,
    };
  } catch (error: unknown) {
    const err = error as any;

    tokenService.clearTokens();

    const code = err.response?.data?.code || AuthErrorCode.ServerError;
    const message =
      err.response?.data?.message || "Failed to refresh token";

    console.error("[Refresh Token Error]", { code, message });

    return rejectWithValue({
      code,
      message,
    });
  }
});
