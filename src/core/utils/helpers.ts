/**
 * core/utils/helpers.ts
 *
 * Funciones helpers y utilidades genéricas
 * Funciones puras sin efectos secundarios
 */

/**
 * Valida si un string es email válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si un string tiene contraseña fuerte
 * - Mínimo 8 caracteres
 * - Al menos una mayúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */
export const isStrongPassword = (password: string): boolean => {
  const strongRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongRegex.test(password);
};

/**
 * Trunca un string a longitud máxima y agrega "..."
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
};

/**
 * Capitaliza la primera letra de un string
 */
export const capitalize = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Formatea fecha a string legible (es-ES)
 */
export const formatDate = (date: string | Date, locale = "es-ES"): string => {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(locale);
  } catch {
    return "";
  }
};

/**
 * Formatea fecha y hora (es-ES)
 */
export const formatDateTime = (
  date: string | Date,
  locale = "es-ES",
): string => {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString(locale);
  } catch {
    return "";
  }
};

/**
 * Compara dos arrays por contenido (no por referencia)
 */
export const arraysEqual = <T>(a: T[], b: T[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
};

/**
 * Elimina duplicados de un array
 */
export const uniqueArray = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

/**
 * Agrupa array por propiedad
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      (result[groupKey] = result[groupKey] || []).push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
};

/**
 * Crea delay promise (útil para testing)
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Merge objects de forma segura
 */
export const mergeObjects = <T extends object>(
  target: T,
  source: Partial<T>,
): T => {
  return { ...target, ...source };
};

/**
 * Valida si un objeto está vacío
 */
export const isEmpty = (obj: Record<string, unknown>): boolean => {
  return Object.keys(obj).length === 0;
};
