/**
 * components/SplashScreen.tsx
 *
 * Pantalla de carga que se muestra mientras redux-persist rehydrata
 * Evita que el usuario vea parpadeos o redirecciones incorrectas
 */

export const SplashScreen = () => {
  return (
    <div className="splash-screen-container">
      <div className="splash-screen-content">
        <div className="splash-screen-spinner" />
        <p className="splash-screen-text">Cargando...</p>
      </div>
    </div>
  );
};
