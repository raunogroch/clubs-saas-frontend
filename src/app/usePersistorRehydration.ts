/**
 * app/usePersistorRehydration.ts
 *
 * Hook para detectar cuando redux-persist completa la rehydratación
 * Proporciona una forma robusta de saber cuándo el estado ha sido restaurado
 *
 * Uso:
 * const isRehydrated = usePersistorRehydration();
 */

import { useEffect, useState } from "react";
import { persistor } from "./store";

/**
 * Hook que detecta cuando redux-persist ha completado la rehydratación
 * Retorna true cuando el estado ha sido completamente restaurado
 */
export const usePersistorRehydration = (): boolean => {
  const [isRehydrated, setIsRehydrated] = useState(false);

  useEffect(() => {
    /**
     * Función que se ejecuta cuando el persistor se actualiza
     * Usamos getState() para verificar si la rehydratación está completa
     */
    const handleRehydrate = () => {
      // El persistor.getState() devuelve el estado de persistencia
      // Cuando rehydrated es true, significa que se completó la rehydratación
      const persistState = (
        persistor as {
          getState?: () => { rehydrated?: boolean };
        }
      ).getState?.();

      if (persistState?.rehydrated !== false) {
        // Si no está explícitamente en "false" de rehydratación,
        // significa que ya se completó
        setIsRehydrated(true);
      }
    };

    // Suscribirse a cambios del persistor
    const unsubscribe = persistor.subscribe(handleRehydrate);

    // También ejecutar inmediatamente por si ya está rehydratado
    handleRehydrate();

    return unsubscribe;
  }, []);

  return isRehydrated;
};
