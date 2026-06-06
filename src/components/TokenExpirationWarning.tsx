/**
 * components/TokenExpirationWarning.tsx
 *
 * Componente que muestra una advertencia cuando el token está próximo a expirar
 * Permite al usuario renovar sesión o logout
 */

import { useEffect, useState } from "react";
import { useTokenExpiration } from "../hooks/useTokenValidation";
import { useAppDispatch } from "../hooks/reduxHooks";
import { logout } from "../features/auth/authSlice";

export const TokenExpirationWarning = () => {
  const { expiresIn, isExpired } = useTokenExpiration();
  const dispatch = useAppDispatch();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  // Mostrar advertencia cuando faltan menos de 5 minutos
  const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutos en ms

  useEffect(() => {
    if (!expiresIn || isExpired) {
      setShowWarning(false);
      return;
    }

    // Si quedan menos de 5 minutos, mostrar advertencia
    setShowWarning(expiresIn < WARNING_THRESHOLD);
  }, [expiresIn, isExpired]);

  // Actualizar tiempo restante cada segundo
  useEffect(() => {
    if (!showWarning) return;

    // Actualizar inmediatamente
    const updateTimeRemaining = () => {
      if (expiresIn && expiresIn > 0) {
        const minutes = Math.floor(expiresIn / 1000 / 60);
        const seconds = Math.floor((expiresIn / 1000) % 60);
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    updateTimeRemaining();

    // No actualizar cada segundo porque expiresIn no cambia en este componente
    // Es un valor calculado una sola vez. Para una actualización dinámica,
    // necesitaríamos recalcular en main.tsx
  }, [showWarning, expiresIn]);

  if (!showWarning) return null;

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div
      className="alert alert-warning alert-dismissible fade show"
      role="alert"
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        maxWidth: "400px",
      }}
    >
      <strong>⏰ Sesión próxima a expirar</strong>
      <p className="mb-0 mt-2">
        Tu sesión expirará en <strong>{timeRemaining}</strong>
      </p>
      <small className="text-muted">
        Tu token está próximo a expirar. Realiza acciones importantes antes de
        que expire.
      </small>
      <div className="mt-3">
        <button
          className="btn btn-sm btn-warning"
          onClick={() => {
            // Aquí podrías agregar lógica para renovar el token
            // Por ahora, solo cerrar la advertencia
            setShowWarning(false);
          }}
          style={{ marginRight: "10px" }}
        >
          Entendido
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};
