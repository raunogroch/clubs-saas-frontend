/**
 * app/persistenceSlice.ts
 *
 * Slice para rastrear el estado de rehydratación de redux-persist
 * Marca cuando redux-persist ha completado la rehydratación
 *
 * Principios SOLID:
 * - SRP: Una responsabilidad - rastrear estado de inicialización
 * - DIP: Componentes dependen de este slice, no de persistor directamente
 */

import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";

/**
 * Slice para rastrear si redux-persist ha completado la rehydratación
 * Se actualiza manualmente desde main.tsx usando persistor.subscribe()
 */
export const persistenceSlice = createSlice({
  name: "persistence",
  initialState: {
    rehydrated: false,
  },
  reducers: {
    /**
     * Action disparada cuando redux-persist completa la rehydratación
     */
    setRehydrated: (state) => {
      state.rehydrated = true;
    },
    /**
     * Action para resetear el estado (logout, etc.)
     */
    resetRehydration: (state) => {
      state.rehydrated = false;
    },
  },
});

export const { setRehydrated, resetRehydration } = persistenceSlice.actions;
export default persistenceSlice.reducer;

/**
 * Selector para verificar si redux-persist ha completado la rehydratación
 * Los componentes deben esperar a que esto sea true antes de renderizar rutas protegidas
 */
export const selectIsRehydrated = (state: RootState): boolean => {
  return state.persistence.rehydrated;
};
