import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";
import { selectIsRehydrated } from "../app/persistenceSlice";
import { SplashScreen } from "../components/SplashScreen";

export const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isRehydrated = useAppSelector(selectIsRehydrated);

  // 1. Mientras no esté rehydratado, mostrar loading
  if (!isRehydrated) {
    return <SplashScreen />;
  }

  // 2. Si está rehydratado pero no autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
