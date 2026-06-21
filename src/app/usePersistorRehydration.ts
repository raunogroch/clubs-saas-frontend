/**
 * app/usePersistorRehydration.ts
 *
 * Hook para detectar cuando redux-persist completa la rehydratación
 * Proporciona una forma robusta de saber cuándo el estado ha sido restaurado
 *
 * Uso:
 * const isRehydrated = usePersistorRehydration();
 *
 * IMPORTANTE: Este hook requiere que el middleware rehydrationMiddleware
 * esté agregado al store para funcionar correctamente.
 */

export { useRehydrationStatus as usePersistorRehydration } from "./middleware/rehydrationMiddleware";
