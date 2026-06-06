/**
 * app/storage.ts
 *
 * Storage personalizado para redux-persist
 * Maneja casos donde localStorage no está disponible
 */

import type { Storage } from "redux-persist";

/**
 * Storage en memoria (fallback cuando localStorage no está disponible)
 * Se usa si localStorage no está definido (SSR, tests, etc.)
 */
const inMemoryStorage: Record<string, string> = {};

/**
 * Storage seguro que detecta si localStorage está disponible
 * Si no está disponible, usa un almacenamiento en memoria
 * Implementa la interfaz de Storage de redux-persist
 */
const storage: Storage = {
  getItem: (key: string) => {
    try {
      // Si localStorage está disponible, úsalo
      if (typeof window !== "undefined" && window?.localStorage) {
        const value = window.localStorage.getItem(key);
        return Promise.resolve(value);
      }
      // Fallback a almacenamiento en memoria
      return Promise.resolve(inMemoryStorage[key] || null);
    } catch (error) {
      console.warn(`Error al leer del storage para key "${key}":`, error);
      // Fallback a almacenamiento en memoria si hay error
      return Promise.resolve(inMemoryStorage[key] || null);
    }
  },

  setItem: (key: string, value: string) => {
    try {
      // Si localStorage está disponible, úsalo
      if (typeof window !== "undefined" && window?.localStorage) {
        window.localStorage.setItem(key, value);
      }
      // Siempre mantén sincronizado el almacenamiento en memoria
      inMemoryStorage[key] = value;
      return Promise.resolve();
    } catch (error) {
      console.warn(`Error al guardar en storage la key "${key}":`, error);
      // Fallback a almacenamiento en memoria si hay error
      inMemoryStorage[key] = value;
      return Promise.resolve();
    }
  },

  removeItem: (key: string) => {
    try {
      // Si localStorage está disponible, úsalo
      if (typeof window !== "undefined" && window?.localStorage) {
        window.localStorage.removeItem(key);
      }
      // Siempre mantén sincronizado el almacenamiento en memoria
      delete inMemoryStorage[key];
      return Promise.resolve();
    } catch (error) {
      console.warn(`Error al eliminar del storage la key "${key}":`, error);
      // Fallback a almacenamiento en memoria si hay error
      delete inMemoryStorage[key];
      return Promise.resolve();
    }
  },

  clear: () => {
    try {
      // Si localStorage está disponible, úsalo
      if (typeof window !== "undefined" && window?.localStorage) {
        window.localStorage.clear();
      }
      // Siempre limpiar el almacenamiento en memoria
      Object.keys(inMemoryStorage).forEach((key) => {
        delete inMemoryStorage[key];
      });
      return Promise.resolve();
    } catch (error) {
      console.warn("Error al limpiar storage:", error);
      // Fallback a almacenamiento en memoria
      Object.keys(inMemoryStorage).forEach((key) => {
        delete inMemoryStorage[key];
      });
      return Promise.resolve();
    }
  },
};

export default storage;
