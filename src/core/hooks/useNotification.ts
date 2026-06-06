/**
 * core/hooks/useNotification.ts
 *
 * Hook para mostrar notificaciones (toasts)
 *
 * Principios SOLID:
 * - SRP: Una responsabilidad - notificaciones
 * - ISP: Interfaz específica segregada
 *
 * Uso:
 * ```typescript
 * const { success, error, warning, info } = useNotification();
 *
 * try {
 *   await createUser(data);
 *   success('Usuario creado correctamente');
 * } catch (err) {
 *   error('Error al crear usuario');
 * }
 * ```
 */

export interface UseNotificationReturn {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

/**
 * Hook para mostrar notificaciones Toast
 *
 * Nota: Este es un stub. En implementación real, usarías:
 * - Toast library (toast-notification, react-toastify, etc.)
 * - O estado Redux para notificaciones globales
 *
 * @returns {UseNotificationReturn}
 */
export const useNotification = (): UseNotificationReturn => {
  const success = (message: string, _duration = 3000) => {
    // TODO: Implementar con librería de toast o Redux
    console.log("[SUCCESS]", message);
  };

  const error = (message: string, _duration = 3000) => {
    // TODO: Implementar con librería de toast o Redux
    console.error("[ERROR]", message);
  };

  const warning = (message: string, _duration = 3000) => {
    // TODO: Implementar con librería de toast o Redux
    console.warn("[WARNING]", message);
  };

  const info = (message: string, _duration = 3000) => {
    // TODO: Implementar con librería de toast o Redux
    console.info("[INFO]", message);
  };

  return {
    success,
    error,
    warning,
    info,
  };
};
