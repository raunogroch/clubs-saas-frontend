import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { NavHeaderSearch } from "./NavHeaderSearch";
import { Button } from "./Button";
import { useAuthManager } from "../features/auth/authHooks";
import { ButtonForm } from "./ButtonForm";

export const NavHeader = () => {
  const navigate = useNavigate();
  const { logout } = useAuthManager();

  // Estado para controlar si el navbar está minimizado
  const [isMinimized, setIsMinimized] = useState(() => {
    return localStorage.getItem("navbar_minimized") === "true";
  });

  // Sincronizar estado con el DOM
  useEffect(() => {
    const body = document.body;
    if (isMinimized) {
      body.classList.add("mini-navbar");
    } else {
      body.classList.remove("mini-navbar");
    }
    // Persistir la preferencia
    localStorage.setItem("navbar_minimized", isMinimized.toString());
  }, [isMinimized]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <div className="row border-bottom">
      <nav
        className="navbar navbar-static-top  "
        role="navigation"
        style={{ marginBottom: "0" }}
      >
        <div className="navbar-header">
          <ButtonForm
            className="navbar-minimalize minimalize-styl-2 btn btn-primary"
            type="button"
            onClick={handleMinimize}
          >
            <i className="fa fa-bars"></i>
          </ButtonForm>
          <NavHeaderSearch />
        </div>
        <ul className="nav navbar-top-links navbar-right">
          <li>
            <span className="m-r-sm text-muted welcome-message">
              Bienvenido a la Plataforma ClubSphere
            </span>
          </li>
          <li>
            <Button
              text="Log out"
              icon={{ icon: "fa fa-sign-out" }}
              onClick={handleLogout}
            />
          </li>
        </ul>
      </nav>
    </div>
  );
};
