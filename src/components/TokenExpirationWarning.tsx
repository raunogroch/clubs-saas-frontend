/**
 * components/TokenExpirationWarning.tsx
 *
 * Componente que muestra una advertencia cuando el token está próximo a expirar
 * Permite al usuario renovar sesión o logout
 */

import { useMemo } from "react";
import { useTokenExpiration } from "../hooks/useTokenValidation";
import { useAppDispatch } from "../hooks/reduxHooks";
import { logout } from "../features/auth/authSlice";

export const TokenExpirationWarning = () => {
  const { expiresIn, isExpired } = useTokenExpiration();
  const dispatch = useAppDispatch();

  // Mostrar advertencia cuando faltan menos de 5 minutos
  const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutos en ms
  const showWarning = Boolean(
    expiresIn && expiresIn > 0 && !isExpired && expiresIn < WARNING_THRESHOLD,
  );

  const timeRemaining = useMemo(() => {
    if (!expiresIn || expiresIn <= 0) return "0m 0s";

    const minutes = Math.floor(expiresIn / 1000 / 60);
    const seconds = Math.floor((expiresIn / 1000) % 60);
    return `${minutes}m ${seconds}s`;
  }, [expiresIn]);

  if (!showWarning) return null;

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div
      className="alert alert-warning alert-dismissible fade show token-warning-container"
      role="alert"
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
          className="btn btn-sm btn-rounded btn-warning token-warning-button"
          onClick={() => {
            // Aquí podrías agregar lógica para renovar el token
          }}
        >
          Entendido
        </button>
        <button
          className="btn btn-sm btn-rounded btn-outline-danger"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};
