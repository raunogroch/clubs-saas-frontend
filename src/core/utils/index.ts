/**
 * core/utils/index.ts
 *
 * Exporta todas las utilidades centralizadas
 */

export {
  handleApiError,
  getErrorCodeFromStatus,
  getUserFriendlyErrorMessage,
  getValidationErrorMessages,
} from "./error-handlers";

export {
  isValidEmail,
  isStrongPassword,
  truncate,
  capitalize,
  formatDate,
  formatDateTime,
  arraysEqual,
  uniqueArray,
  groupBy,
  delay,
  mergeObjects,
  isEmpty,
} from "./helpers";

export {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
  clearLocalStorage,
} from "./localStorage";
