import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "../auth/ProtectedRoute";
import { GuestRoute } from "../auth/GuestRoute";

import { DashboardLayout } from "../layouts/DashboardLayout";
import {
  AssignmentPage,
  DashboardPage,
  LoginPage,
  NotFoundPage,
} from "../pages";

export const router = createBrowserRouter([
  // PUBLICAS
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },

  // PRIVADAS
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "assignments",
            element: <AssignmentPage />,
          },
        ],
      },
    ],
  },

  // 404
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
