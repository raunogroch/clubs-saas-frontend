import { createBrowserRouter } from "react-router-dom";

import {
  ProtectedRoute,
  GuestRoute,
} from "../features/auth/components/ProtectedRoute";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { NotFoundPage } from "../pages/NotFoundPage";

/**
 * Definición de rutas
 *
 * Estructura:
 * - Rutas públicas: GuestRoute (login, register, landing)
 * - Rutas privadas: ProtectedRoute (dashboard, profile, etc.)
 * - Rutas 404: NotFoundPage
 *
 * Notas importantes:
 * - GuestRoute redirige a /dashboard si el usuario ya está autenticado
 * - ProtectedRoute redirige a /login si el usuario NO está autenticado
 * - Redux Persist restaura la sesión automáticamente al iniciar
 */

export const router = createBrowserRouter([
  // ==================== RUTAS PÚBLICAS ====================
  // Solo accesibles si NO estás autenticado
  {
    element: <GuestRoute><div /></GuestRoute>,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },

  // ==================== RUTAS PRIVADAS ====================
  // Solo accesibles si estás autenticado
  {
    element: <ProtectedRoute><div /></ProtectedRoute>,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          // Añade más rutas privadas aquí
          // {
          //   path: "profile",
          //   element: <ProfilePage />,
          // },
          // {
          //   path: "clubs",
          //   element: <ClubsPage />,
          // },
        ],
      },
    ],
  },

  // ==================== RUTA 404 ====================
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
