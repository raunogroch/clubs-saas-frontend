/**
 * auth/GuestRoute.tsx
 *
 * Ruta para usuarios NO autenticados (login, registro)
 *
 * Si el usuario YA está autenticado, redirige a dashboard
 *
 * Principios SOLID aplicados:
 * - LSP: Usa la misma interfaz de autenticación que ProtectedRoute (Redux)
 * - Simétrico con ProtectedRoute
 */

import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";

export const GuestRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // Si está autenticado, redirige a dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
