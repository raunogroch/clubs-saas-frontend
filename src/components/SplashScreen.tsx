/**
 * components/SplashScreen.tsx
 *
 * Pantalla de carga que se muestra mientras redux-persist rehydrata
 * Evita que el usuario vea parpadeos o redirecciones incorrectas
 */

export const SplashScreen = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #007bff",
            borderTop: "4px solid #f3f3f3",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px",
          }}
        />
        <p style={{ color: "#666", margin: "0", fontSize: "14px" }}>
          Cargando...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};
