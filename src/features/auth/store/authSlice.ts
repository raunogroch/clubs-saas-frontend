import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  login,
  register,
  logout,
  getCurrentUser,
  refreshTokenThunk,
} from "./authThunks";
import type { AuthState } from "./authTypes";

/**
 * Estado inicial de autenticación
 *
 * IMPORTANTE:
 * - NO guardar tokens en estado Redux si los tienes en localStorage
 * - Guardar en estado para fácil acceso
 * - Guardar en localStorage para persistencia
 * - Loading separado por acción para granularidad
 * - Error separado por acción para mensajes específicos
 */
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: {
    login: false,
    register: false,
    logout: false,
    refresh: false,
    getCurrentUser: false,
  },
  error: {
    login: null,
    register: null,
    logout: null,
    refresh: null,
    getCurrentUser: null,
  },
  lastTokenRefresh: null,
};

/**
 * Auth Slice
 *
 * Un slice combina:
 * - Estado (state)
 * - Reducers (funciones para cambiar estado)
 * - Extraers reducers (para thunks)
 *
 * Naming: `authSlice`
 */
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Reducer para logout sincrónico
     * Limpia todo el estado de autenticación
     */
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error.logout = null;
    },

    /**
     * Reducer para limpiar errores
     * Útil después de mostrar un error al usuario
     */
    clearError: (state, action: PayloadAction<keyof AuthState["error"]>) => {
      state.error[action.payload] = null;
    },

    /**
     * Reducer para setear el usuario después de refresh
     * (cuando solo refrescamos datos sin tocar tokens)
     */
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
    },

    /**
     * Reducer para restaurar sesión desde storage
     * Se llama cuando la app inicia y hay tokens guardados
     */
    restoreSession: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user?: AuthState["user"];
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      if (action.payload.user) {
        state.user = action.payload.user;
      }
    },
  },

  /**
   * Extra Reducers para manejar async thunks
   *
   * Cada thunk genera 3 acciones:
   * - pending: cuando se inicia la llamada
   * - fulfilled: cuando se completa exitosamente
   * - rejected: cuando falla
   */
  extraReducers: (builder) => {
    // ==================== LOGIN ====================
    builder
      .addCase(login.pending, (state) => {
        state.loading.login = true;
        state.error.login = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading.login = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
        state.error.login = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading.login = false;
        state.isAuthenticated = false;
        state.error.login =
          action.payload?.message || "Login failed. Please try again.";
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      });

    // ==================== REGISTER ====================
    builder
      .addCase(register.pending, (state) => {
        state.loading.register = true;
        state.error.register = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading.register = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
        state.error.register = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading.register = false;
        state.isAuthenticated = false;
        state.error.register =
          action.payload?.message || "Registration failed. Please try again.";
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      });

    // ==================== LOGOUT ====================
    builder
      .addCase(logout.pending, (state) => {
        state.loading.logout = true;
        state.error.logout = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading.logout = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error.logout = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading.logout = false;
        // En logout, limpiamos todo de todas formas
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error.logout =
          action.payload?.message || "Logout failed. Please try again.";
      });

    // ==================== GET CURRENT USER ====================
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading.getCurrentUser = true;
        state.error.getCurrentUser = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading.getCurrentUser = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error.getCurrentUser = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading.getCurrentUser = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error.getCurrentUser =
          action.payload?.message || "Failed to fetch user information.";
      });

    // ==================== REFRESH TOKEN ====================
    builder
      .addCase(refreshTokenThunk.pending, (state) => {
        state.loading.refresh = true;
        state.error.refresh = null;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.loading.refresh = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.isAuthenticated = true;
        state.lastTokenRefresh = Date.now();
        state.error.refresh = null;
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.loading.refresh = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error.refresh =
          action.payload?.message || "Token refresh failed.";
      });
  },
});

/**
 * Exportar acciones
 * Se usan con dispatch(authActions.logout())
 */
export const authActions = authSlice.actions;

/**
 * Exportar reducer
 * Se registra en el store
 */
export default authSlice.reducer;
