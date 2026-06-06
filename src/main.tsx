import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { router } from "./router/router";
import { store, persistor } from "./app/store";
import { AppInitializer } from "./app/AppInitializer";
import { SplashScreen } from "./components/SplashScreen";
import { setRehydrated } from "./app/persistenceSlice";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate
      loading={<SplashScreen />}
      persistor={persistor}
      onBeforeLift={() => {
        // Disparar setRehydrated ANTES de renderizar RouterProvider
        // Esto evita que ProtectedRoute vea isRehydrated=false
        store.dispatch(setRehydrated());
      }}
    >
      <AppInitializer>
        <RouterProvider router={router} />
      </AppInitializer>
    </PersistGate>
  </Provider>,
);
