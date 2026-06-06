/**
 * core/hooks/index.ts
 *
 * Exporta todos los hooks centralizados
 * Punto de entrada para hooks de la aplicación
 */

export { useAuth } from "./useAuth";
export type { UseAuthReturn } from "./useAuth";

// NOTE: Los siguientes hooks son stubs sin implementación y no se utilizan en el código actual.
// Se mantienen para compatibilidad futura pero NO deben importarse hasta que estén implementados.
// export { usePermissions } from "./usePermissions";
// export type { UsePermissionsReturn } from "./usePermissions";
// export { useNotification } from "./useNotification";
// export type { UseNotificationReturn } from "./useNotification";
