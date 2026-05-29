import type { FormEvent } from "react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { register } from "../store/authThunks";
import {
  selectRegisterLoading,
  selectRegisterError,
  selectIsAuthenticated,
} from "../store/authSelectors";
import { useNavigate } from "react-router-dom";
import type { RegisterCredentials } from "../store/authTypes";

/**
 * Componente RegisterForm
 *
 * Ejemplo completo de registro con:
 * - Validación de contraseña (confirmación)
 * - Términos y condiciones
 * - Error handling
 * - Loading state
 * - Tipado completo
 */

export const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Selectores
  const isLoading = useAppSelector(selectRegisterLoading);
  const error = useAppSelector(selectRegisterError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Estado del formulario
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [localError, setLocalError] = useState<string | null>(null);

  // Redirigir si ya está autenticado
  if (isAuthenticated) {
    navigate("/dashboard");
  }

  /**
   * Validar formulario
   */
  const validateForm = (): boolean => {
    // Email
    if (!formData.email) {
      setLocalError("Email is required");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError("Invalid email format");
      return false;
    }

    // Nombres
    if (!formData.firstName?.trim()) {
      setLocalError("First name is required");
      return false;
    }

    if (!formData.lastName?.trim()) {
      setLocalError("Last name is required");
      return false;
    }

    // Contraseña
    if (!formData.password) {
      setLocalError("Password is required");
      return false;
    }

    if (formData.password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return false;
    }

    // Validar fuerza de contraseña
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    // const hasSpecialChar = /[!@#$%^&*]/.test(formData.password); // No requerido actualmente

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setLocalError(
        "Password must contain uppercase, lowercase, and number"
      );
      return false;
    }

    // Confirmar contraseña
    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return false;
    }

    // Aceptar términos
    if (!formData.acceptTerms) {
      setLocalError("You must accept the terms and conditions");
      return false;
    }

    setLocalError(null);
    return true;
  };

  /**
   * Manejar submit
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const credentials: RegisterCredentials = {
      email: formData.email.toLowerCase().trim(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      password: formData.password,
    };

    const result = await dispatch(register(credentials));

    if (register.fulfilled.match(result)) {
      navigate("/dashboard");
    } else {
      console.error("Registration failed:", result.payload);
    }
  };

  /**
   * Manejar cambios en los inputs
   */
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setLocalError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <div className="form-group mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="form-control"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          disabled={isLoading}
          placeholder="your@email.com"
          autoComplete="email"
        />
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className="form-control"
              value={formData.firstName}
              onChange={(e) =>
                handleInputChange("firstName", e.target.value)
              }
              disabled={isLoading}
              placeholder="John"
              autoComplete="given-name"
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className="form-control"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              disabled={isLoading}
              placeholder="Doe"
              autoComplete="family-name"
            />
          </div>
        </div>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="form-control"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          disabled={isLoading}
          placeholder="••••••••"
          autoComplete="new-password"
        />
        <small className="text-muted">
          Must contain uppercase, lowercase, number (min 8 chars)
        </small>
      </div>

      <div className="form-group mb-3">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className="form-control"
          value={formData.confirmPassword}
          onChange={(e) =>
            handleInputChange("confirmPassword", e.target.value)
          }
          disabled={isLoading}
          placeholder="••••••••"
          autoComplete="new-password"
        />
      </div>

      <div className="form-check mb-3">
        <input
          id="acceptTerms"
          type="checkbox"
          className="form-check-input"
          checked={formData.acceptTerms}
          onChange={(e) =>
            handleInputChange("acceptTerms", e.target.checked)
          }
          disabled={isLoading}
        />
        <label htmlFor="acceptTerms" className="form-check-label">
          I accept the terms and conditions
        </label>
      </div>

      {/* Errores */}
      {(localError || error) && (
        <div className="alert alert-danger mb-3">{localError || error}</div>
      )}

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>

      <div className="mt-3 text-center">
        <p className="text-muted">
          Already have an account?{" "}
          <a href="/login" className="text-primary">
            Sign in
          </a>
        </p>
      </div>
    </form>
  );
};
