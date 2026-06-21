/**
 * app/middleware/rehydrationMiddleware.ts
 *
 * Middleware para detectar cuando redux-persist completó la rehydratación
 * y mantener un estado global observable
 *
 * Uso:
 * const isRehydrated = useRehydrationStatus();
 */

import React from "react";
import type { Middleware } from "@reduxjs/toolkit";

// Variable global para mantener estado de rehydratación
// Se usa en el hook useRehydrationStatus
let rehydrationComplete = false;

// Listeners para notificar cambios
const listeners: Set<() => void> = new Set();

/**
 * Middleware que detecta cuando redux-persist completa la rehydratación
 * Se ejecuta DESPUÉS de cada acción y puede filtrar por tipo
 */
export const rehydrationMiddleware: Middleware =
  (_store) => (next) => (action: unknown) => {
    const result = next(action);

    // Redux-persist dispara la acción 'persist/REHYDRATE' cuando termina
    // de restaurar el estado desde localStorage/storage
    if ((action as any).type === "persist/REHYDRATE") {
      rehydrationComplete = true;
      // Notificar a todos los listeners (hooks)
      listeners.forEach((listener) => listener());
    }

    return result;
  };

/**
 * Hook para suscribirse a cambios de rehydratación
 * Retorna true cuando redux-persist ha completado la rehydratación
 */
export const useRehydrationStatus = (): boolean => {
  const [isRehydrated, setIsRehydrated] = React.useState(rehydrationComplete);

  React.useEffect(() => {
    // Si ya está rehydratado, no hacer nada más
    if (rehydrationComplete) {
      setIsRehydrated(true);
      return;
    }

    // Agregar listener
    const handleRehydrate = () => {
      setIsRehydrated(true);
    };

    listeners.add(handleRehydrate);

    return () => {
      listeners.delete(handleRehydrate);
    };
  }, []);

  return isRehydrated;
};
