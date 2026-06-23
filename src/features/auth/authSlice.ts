/**
 * features/auth/authSlice.ts
 *
 * Redux slice para autenticación
 *
 * Principios SOLID aplicados:
 * - SRP: Una sola responsabilidad - manejar estado de auth
 * - Tipos centralizados en core/types (no duplicados aquí)
 * - Persistencia delegada a redux-persist (no localStorage manual)
 * - DIP: Actualiza ambas estructuras (assignments y memberships) para compatibilidad
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "../../core/types";
import type { Membership } from "../../core/interfaces";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  activeAssignmentId: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Action para login exitoso
     *
     * redux-persist automáticamente persistirá este estado
     */
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    /**
     * Action para error en login
     */
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    /**
     * Action para establecer estado loading
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * Action para logout
     *
     * redux-persist automáticamente sincronizará con localStorage
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.activeAssignmentId = null;
    },

    /**
     * Action para limpiar errores
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Action para actualizar datos del usuario
     */
    updateUser: (state, action: PayloadAction<User>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    /**
     * Action para actualizar assignments del usuario autenticado
     *
     * Principios SOLID:
     * - SRP: Una responsabilidad - actualizar solo assignments
     * - DIP: Recibe array de UserAssignments (abstracción)
     *
     * @deprecated - Mantener para retrocompatibilidad, preferir updateUserMemberships
     */

    /**
     * Action para actualizar memberships del usuario autenticado
     *
     * Nueva estructura de roles con estado por rol
     *
     * Principios SOLID:
     * - SRP: Una responsabilidad - actualizar solo memberships
     * - DIP: Recibe array de Membership (abstracción)
     */
    updateUserMemberships: (state, action: PayloadAction<Membership[]>) => {
      if (state.user) {
        state.user.memberships = action.payload;
      }
    },

    /**
     * Action para establecer el assignment actualmente seleccionado
     *
     * Persiste en Redux (y automáticamente en localStorage via redux-persist)
     * Se usa cuando el usuario cambia de assignment/club
     *
     * Principios SOLID:
     * - SRP: Una responsabilidad - establecer assignment activo
     * - DIP: Depende de abstracción (string assignmentId)
     */
    setActiveAssignment: (state, action: PayloadAction<string>) => {
      state.activeAssignmentId = action.payload || null;
    },
  },
});

export const {
  loginSuccess,
  loginFailure,
  setLoading,
  logout,
  clearError,
  updateUser,
  updateUserMemberships,
  setActiveAssignment,
} = authSlice.actions;

export default authSlice.reducer;
