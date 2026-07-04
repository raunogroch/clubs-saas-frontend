import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { logout } from "../../features/auth";
import storage from "../storage";
import { log, warn, error } from "../logger";

export const authMiddleware: Middleware = (store) => (next) => (action) => {
  if (typeof action === "object" && action !== null && "type" in action) {
    const actionType = (action as { type: string }).type;
    if (actionType === logout.type) {
      log("Logout detectado. Limpiando localStorage completamente...");
      storage.clear();
    }
  }

  // Detectar si es una acción rechazada de RTK Query
  if (isRejectedWithValue(action)) {
    const payload = action.payload as FetchBaseQueryError;

    if (payload.status === 401) {
      warn(
        "Token rechazado por servidor (401). Disparando logout automático...",
      );

      setTimeout(() => {
        store.dispatch(logout());
      }, 0);
    }

    if (payload.status === 403) {
      error("Usuario sin permisos para esta acción (403)");
    }
  }

  return next(action);
};

export default authMiddleware;
