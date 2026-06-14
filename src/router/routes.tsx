/* eslint-disable react-refresh/only-export-components */

import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

import { ProtectedRoute } from "../auth/ProtectedRoute";
import { GuestRoute } from "../auth/GuestRoute";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { SplashScreen } from "../components/SplashScreen";

const LoginPage = lazy(() =>
  import("../pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const DashboardPage = lazy(() =>
  import("../pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const AssignmentPage = lazy(() =>
  import("../pages/AssignmentPage").then((m) => ({
    default: m.AssignmentPage,
  })),
);
const UserPage = lazy(() =>
  import("../pages/UserPage").then((m) => ({ default: m.UserPage })),
);
const ClubPage = lazy(() =>
  import("../pages/ClubPage").then((m) => ({ default: m.ClubPage })),
);
const GroupsPage = lazy(() =>
  import("../pages/GroupsPage").then((m) => ({ default: m.GroupsPage })),
);
const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
const NoAssignmentsPage = lazy(() =>
  import("../pages/NoAssignmentsPage").then((m) => ({
    default: m.NoAssignmentsPage,
  })),
);

const RouteLoader = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<SplashScreen />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: (
          <RouteLoader>
            <LoginPage />
          </RouteLoader>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "dashboard",
            element: (
              <RouteLoader>
                <DashboardPage />
              </RouteLoader>
            ),
          },
          {
            path: "no-assignments",
            element: (
              <RouteLoader>
                <NoAssignmentsPage />
              </RouteLoader>
            ),
          },
          {
            path: "assignments",
            element: (
              <RouteLoader>
                <AssignmentPage />
              </RouteLoader>
            ),
          },
          {
            path: "admins",
            element: (
              <RouteLoader>
                <UserPage role="ADMIN" />
              </RouteLoader>
            ),
          },
          {
            path: "clubs",
            element: (
              <RouteLoader>
                <ClubPage />
              </RouteLoader>
            ),
          },
          {
            path: "clubs/:clubId/groups",
            element: (
              <RouteLoader>
                <GroupsPage />
              </RouteLoader>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <RouteLoader>
        <NotFoundPage />
      </RouteLoader>
    ),
  },
]);
