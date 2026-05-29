import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import { router } from "./router/router";

import { AuthProvider } from "./auth/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
