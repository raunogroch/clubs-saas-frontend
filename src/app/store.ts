// app/store.ts

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import authApi from "../features/auth/authApi";
import assignmentApi from "../features/assignments/assignmentApi";
import userApi from "../features/users/userApi";

/**
 * Configuración centralizada de Redux Store
 *
 * Incluye:
 * - Reducers: gestión del estado local (auth)
 * - APIs: endpoints y caché de datos (authApi, assignmentApi)
 * - Middleware: interceptores para peticiones API
 */

// === REDUCERS ===
// Almacén de estado local de la aplicación
const reducers = {
  // Estado de autenticación (login, usuario actual, token)
  auth: authReducer,
  // Cache de datos de autenticación desde el servidor
  [authApi.reducerPath]: authApi.reducer,
  // Cache de datos de asignaciones desde el servidor
  [assignmentApi.reducerPath]: assignmentApi.reducer,
  // Cache de datos de usuarios desde el servidor
  [userApi.reducerPath]: userApi.reducer,
};

// === MIDDLEWARE ===
// Funciones que interceptan y procesan las acciones
const getMiddleware = (getDefaultMiddleware: any) => {
  return getDefaultMiddleware().concat(
    // Middleware para manejar peticiones de autenticación
    authApi.middleware,
    // Middleware para manejar peticiones de asignaciones
    assignmentApi.middleware,
    // Middleware para manejar peticiones de usuarios
    userApi.middleware,
  );
};

// === STORE ===
// Creación de la tienda de Redux
export const store = configureStore({
  reducer: reducers,
  middleware: getMiddleware,
});

// === TIPOS ===
// Tipos TypeScript para usar en componentes
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
