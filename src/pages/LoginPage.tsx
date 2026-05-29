import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { useEffect } from "react";
import { ButtonForm } from "../components";

export const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = () => {
    login();

    navigate("/dashboard");
  };

  useEffect(() => {
    document.body.classList.add("gray-bg");

    return () => {
      document.body.classList.remove("gray-bg");
    };
  }, []);

  // return (
  //   <div>
  //     <h1>Login</h1>

  //     <button onClick={handleLogin}>Entrar</button>
  //   </div>
  // );

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
            <form className="m-t" role="form">
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Correo electrónico"
                  required={true}
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  required={true}
                />
              </div>

              <ButtonForm
                onClick={handleLogin}
                className="btn btn-primary block full-width m-b"
              >
                Iniciar sesión
              </ButtonForm>

              <a href="#">
                <small>¿Olvidaste tu contraseña?</small>
              </a>

              <p className="text-muted text-center">
                <small>¿No tienes una cuenta?</small>
              </p>

              <a
                className="btn btn-sm btn-white btn-block"
                href="register.html"
              >
                Crear una cuenta
              </a>
            </form>

            <p className="m-t">
              <small>
                ClubSphere SaaS+ &copy; 2026 | Plataforma de gestión para clubes
                deportivos
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
