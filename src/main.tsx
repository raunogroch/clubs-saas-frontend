import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider } from "react-router-dom";

import { store, persistor } from "./app/store";
import { router } from "./router/router";

/**
 * Provider Redux
 * - Provider: Proporciona el store a toda la aplicación
 * - PersistGate: Rehidrata el estado persistido antes de renderizar
 *   (loading prop muestra un componente mientras se rehidrata)
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={router} />
    </PersistGate>
  </Provider>,
);
