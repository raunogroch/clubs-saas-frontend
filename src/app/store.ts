/**
 * app/store.ts
 *
 * Configuración centralizada de Redux Store
 *
 * Principios SOLID:
 * - SRP: Una responsabilidad - configurar el store
 * - Middleware centralizado
 * - Persistencia automática con redux-persist
 * - Validación de token automática
 */

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "./storage";
import authReducer from "../features/auth/authSlice";
import authApi from "../features/auth/authApi";
import assignmentApi from "../features/assignments/assignmentApi";
import userApi from "../features/users/userApi";
import clubApi from "../features/clubs/clubApi";
import persistenceReducer from "./persistenceSlice";
import authMiddleware from "./middleware/authMiddleware";

// === PERSISTENCIA REDUX ===
// Configuración de redux-persist
// IMPORTANTE: El whitelist debe aplicarse al reducer global, no a slices individuales
const persistConfig = {
  key: "root", // redux-persist lo guardará como "persist:root" automáticamente
  storage,
  whitelist: ["auth"], // Solo persistir el slice de auth
  throttle: 1000, // Debounce de 1s
};

// === REDUCERS ===
// Crear un reducer global ANTES de aplicar persistReducer
const rootReducer = combineReducers({
  persistence: persistenceReducer,
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [assignmentApi.reducerPath]: assignmentApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [clubApi.reducerPath]: clubApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

// Aplicar persistReducer al reducer global
// Ahora el whitelist funciona correctamente: solo persistirá el slice "auth"
const persistedRootReducer = persistReducer<RootState>(
  persistConfig,
  rootReducer,
);

// === STORE ===
export const store = configureStore({
  reducer: persistedRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist usa acciones que no son serializables
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    })
      .concat(
        authApi.middleware,
        assignmentApi.middleware,
        userApi.middleware,
        clubApi.middleware,
      )
      .concat(authMiddleware),
});

// === PERSISTOR ===
export const persistor = persistStore(store);

// === TIPOS ===
// Tipos TypeScript para usar en componentes
export type AppDispatch = typeof store.dispatch;
