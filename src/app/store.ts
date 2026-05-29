import type { ThunkAction, Action } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../features/auth/store/authSlice";

/**
 * Configuración de Redux Persist
 * Persiste el estado en localStorage
 *
 * IMPORTANTE:
 * - Usar whitelist para persister solo lo necesario
 * - NO persister tokens en Redux si ya están en localStorage
 * - Persister usuario para evitar nueva llamada al iniciar app
 */
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Solo persister el estado de auth
  timeout: 1000,
};

// Crear reducer persistido
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

/**
 * Configurar Store
 *
 * configureStore incluye:
 * - Redux Thunk middleware (para async actions)
 * - Redux DevTools extension
 * - Validación de serialización
 * - Mejor manejo de errores
 *
 * Alternativas ANTIGUAS (NO usar):
 * - createStore (legacy)
 * - applyMiddleware (legacy)
 */
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    // Aquí irán más reducers conforme crescent las features:
    // users: usersReducer,
    // clubs: clubsReducer,
    // memberships: membershipsReducer,
    // notifications: notificationsReducer,
  },

  // Configuración de middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Desabilitar chequeo de serializabilidad para redux-persist
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/REGISTER",
        ],
      },
    }),

  // Habilitar Redux DevTools en desarrollo
  devTools: import.meta.env.DEV,
});

/**
 * Crear persistor para rehidratación
 */
export const persistor = persistStore(store);

/**
 * Tipos derivados del store
 * Se usan en toda la aplicación para tipado
 */

/**
 * RootState: El tipo del estado completo
 * Se usa en selectores
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * AppDispatch: El tipo de dispatch
 * Se usa en hooks personalizados
 */
export type AppDispatch = typeof store.dispatch;

/**
 * AppThunk: Tipo para async thunks personalizados
 * Si necesitas crear thunks más complejos
 *
 * Ejemplo:
 * export const myThunk: AppThunk = async (dispatch, getState) => {
 *   // lógica
 * }
 */
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
