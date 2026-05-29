import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../hooks/redux";
import { selectIsAuthenticated, selectGetCurrentUserLoading } from "../store/authSelectors";

/**
 * Componente ProtectedRoute
 *
 * Protege rutas que requieren autenticación
 *
 * VENTAJAS sobre el enfoque anterior:
 * - Redux ya controla el estado de autenticación
 * - Loading state sincronizado
 * - Mejor separación de concerns
 * - Más fácil de testear
 *
 * USO en Router:
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   }
 * />
 */

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({
  children,
}: ProtectedRouteProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectGetCurrentUserLoading);
  const location = useLocation();

  // Mientras se verifica autenticación, mostrar loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirect a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // TODO: Verificar permisos y roles cuando sea necesario
  // const user = useAppSelector(selectUser);
  // if (requiredRole && !user?.roles.includes(requiredRole)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <>{children}</>;
};

/**
 * Componente GuestRoute
 *
 * Protege rutas que solo deben verse sin autenticación (login, register)
 * Si el usuario ya está autenticado, lo redirige al dashboard
 *
 * USO:
 * <Route
 *   path="/login"
 *   element={
 *     <GuestRoute>
 *       <LoginPage />
 *     </GuestRoute>
 *   }
 * />
 */

interface GuestRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const GuestRoute = ({
  children,
  redirectTo = "/dashboard",
}: GuestRouteProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectGetCurrentUserLoading);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Navigate to={redirectTo} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};
