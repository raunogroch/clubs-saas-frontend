import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ButtonForm } from "../components";
import { useAuthManager } from "../features/auth/useAuthManager";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated } = useAuthManager();

  // Estados del formulario
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  // Efecto para redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Efecto para estilos de la página
  useEffect(() => {
    document.body.classList.add("gray-bg");
    return () => {
      document.body.classList.remove("gray-bg");
    };
  }, []);

  // Validar formulario
  const validateForm = () => {
    setValidationError("");

    if (!username.trim()) {
      setValidationError("El usuario es requerido");
      return false;
    }

    if (!password.trim()) {
      setValidationError("La contraseña es requerida");
      return false;
    }

    if (password.length < 5) {
      setValidationError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }

    return true;
  };

  // Manejar submit del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login({ username, password });
      // La redirección ocurre en el useEffect cuando isAuthenticated cambia
    } catch {
      // El error se maneja en useAuthManager y se muestra en el estado 'error'
    }
  };

  return (
    <div className="loginColumns animated fadeInDown">
      <div className="row">
        <div className="col-md-6">
          <h2 className="font-bold">Bienvenido a ClubSphere SaaS+</h2>
          <p>
            Plataforma moderna y escalable diseñada para la gestión integral de
            clubes deportivos, academias y organizaciones atléticas.
          </p>
          <p>
            Administra deportistas, entrenadores, membresías, entrenamientos,
            torneos, pagos y asistencia desde un solo panel centralizado.
          </p>
          <p>
            Optimiza la organización de tus equipos y mejora la coordinación
            entre administradores, personal técnico y miembros del club.
          </p>
          <p>
            <small>
              Sistema SaaS basado en la nube con acceso seguro, disponibilidad
              en tiempo real y herramientas diseñadas para el crecimiento de
              instituciones deportivas modernas.
            </small>
          </p>
        </div>

        <div className="col-md-6">
          <div className="ibox-content">
            <form className="m-t" role="form" onSubmit={handleSubmit}>
              {/* Mostrar errores */}
              {(validationError || error) && (
                <div className="alert alert-danger" role="alert">
                  {validationError || error}
                </div>
              )}

              {/* Campo usuario */}
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* Campo contraseña */}
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* Botón de envío */}
              <ButtonForm
                type="submit"
                className="btn btn-rounded btn-primary block full-width m-b"
                disabled={loading}
              >
                {loading ? "Autenticando..." : "Iniciar sesión"}
              </ButtonForm>

              <a href="#">
                <small>¿Olvidaste tu contraseña?</small>
              </a>

              <p className="text-muted text-center">
                <small>¿No tienes una cuenta?</small>
              </p>

              <a
                className="btn btn-rounded btn-sm btn-white"
                href="register.html"
              >
                Crear una cuenta
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
