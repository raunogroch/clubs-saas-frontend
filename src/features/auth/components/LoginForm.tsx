import type { FormEvent } from "react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { login } from "../store/authThunks";
import {
  selectLoginLoading,
  selectLoginError,
  selectIsAuthenticated,
} from "../store/authSelectors";
import { useNavigate } from "react-router-dom";
import type { LoginCredentials } from "../store/authTypes";

/**
 * Componente LoginForm
 *
 * Ejemplo completo de:
 * - Captura de formulario
 * - Dispatch de async thunk
 * - Manejo de loading y error
 * - Tipado completo con TypeScript
 * - Redirección después de login exitoso
 *
 * USO:
 * <LoginForm />
 *
 * IMPORTANTE:
 * - Error local se limpia automáticamente al cambiar inputs
 * - Loading desabilita el botón
 * - Después de login, redirecciona automáticamente
 */

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Selectores
  const isLoading = useAppSelector(selectLoginLoading);
  const error = useAppSelector(selectLoginError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Estado local del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirigir si está autenticado
  if (isAuthenticated) {
    navigate("/dashboard");
  }

  /**
   * Validar formulario localmente
   */
  const validateForm = (): boolean => {
    // Email
    if (!email) {
      setLocalError("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError("Invalid email format");
      return false;
    }

    // Password
    if (!password) {
      setLocalError("Password is required");
      return false;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return false;
    }

    setLocalError(null);
    return true;
  };

  /**
   * Manejar submit del formulario
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar antes de enviar
    if (!validateForm()) {
      return;
    }

    // Preparar credenciales
    const credentials: LoginCredentials = {
      email: email.toLowerCase().trim(),
      password,
    };

    // Dispatch del thunk
    const result = await dispatch(login(credentials));

    // Verificar si fue exitoso
    if (login.fulfilled.match(result)) {
      // Redux maneja la navegación automática
      // Pero puedes hacer redirección manual aquí si quieres
      navigate("/dashboard");
    } else {
      // Error manejado por Redux y mostrado en UI
      console.error("Login failed:", result.payload);
    }
  };

  /**
   * Limpiar error local cuando el usuario tipea
   */
  const handleEmailChange = (value: string) => {
    setEmail(value);
    setLocalError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setLocalError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          disabled={isLoading}
          placeholder="your@email.com"
          autoComplete="email"
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          disabled={isLoading}
          placeholder="••••••"
          autoComplete="current-password"
        />
      </div>

      {/* Mostrar errores */}
      {(localError || error) && (
        <div className="alert alert-danger mb-3">
          {localError || error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      <div className="mt-3 text-center">
        <p className="text-muted">
          Don't have an account?{" "}
          <a href="/register" className="text-primary">
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
};
