/**
 * core/utils/localStorage.ts
 *
 * Utilidad segura para acceder a localStorage
 * Maneja casos donde localStorage no está disponible (SSR, tests, etc.)
 */

/**
 * Storage en memoria (fallback cuando localStorage no está disponible)
 */
const inMemory: Record<string, string> = {};

/**
 * Obtiene un valor del storage de manera segura
 * @param key - Clave a obtener
 * @returns Valor o null si no existe
 */
export const getLocalStorageItem = (key: string): string | null => {
  try {
    if (typeof window !== "undefined" && window?.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch (error) {
    console.warn(`Error al leer localStorage["${key}"]:`, error);
  }
  return inMemory[key] || null;
};

/**
 * Guarda un valor en storage de manera segura
 * @param key - Clave a guardar
 * @param value - Valor a guardar
 */
export const setLocalStorageItem = (key: string, value: string): void => {
  try {
    if (typeof window !== "undefined" && window?.localStorage) {
      window.localStorage.setItem(key, value);
    }
    inMemory[key] = value;
  } catch (error) {
    console.warn(`Error al guardar en localStorage["${key}"]:`, error);
    inMemory[key] = value;
  }
};

/**
 * Elimina un valor del storage de manera segura
 * @param key - Clave a eliminar
 */
export const removeLocalStorageItem = (key: string): void => {
  try {
    if (typeof window !== "undefined" && window?.localStorage) {
      window.localStorage.removeItem(key);
    }
    delete inMemory[key];
  } catch (error) {
    console.warn(`Error al eliminar localStorage["${key}"]:`, error);
    delete inMemory[key];
  }
};

/**
 * Limpia todo el storage de manera segura
 */
export const clearLocalStorage = (): void => {
  try {
    if (typeof window !== "undefined" && window?.localStorage) {
      window.localStorage.clear();
    }
    Object.keys(inMemory).forEach((key) => {
      delete inMemory[key];
    });
  } catch (error) {
    console.warn("Error al limpiar localStorage:", error);
    Object.keys(inMemory).forEach((key) => {
      delete inMemory[key];
    });
  }
};
