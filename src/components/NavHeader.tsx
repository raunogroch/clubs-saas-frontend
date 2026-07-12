import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { NavHeaderSearch } from "./NavHeaderSearch";
import { Button } from "./Button";
import { useAuthManager } from "../features/auth";
import { ButtonForm } from "./ButtonForm";
import { useSearch } from "../core/context/useSearch";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../core/utils/localStorage";
import { RolesDropdown } from "./RolesDropdown";

export const NavHeader = () => {
  const navigate = useNavigate();
  const { logout } = useAuthManager();
  const { isSearchEnabled } = useSearch();

  // Estado para controlar si el navbar está minimizado
  const [isMinimized, setIsMinimized] = useState(() => {
    return getLocalStorageItem("navbar_minimized") === "true";
  });

  // Sincronizar estado con el DOM
  useEffect(() => {
    const body = document.body;
    if (isMinimized) {
      body.classList.add("mini-navbar");
    } else {
      body.classList.remove("mini-navbar");
    }
    setLocalStorageItem("navbar_minimized", isMinimized.toString());
  }, [isMinimized]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  return (
    <div className="row ">
      <nav
        className="navbar navbar-static-top nav-header-navbar"
        role="navigation"
      >
        <div className="navbar-header">
          <ButtonForm
            className="navbar-minimalize minimalize-styl-2 btn btn-primary"
            type="button"
            onClick={handleMinimize}
          >
            <i className="fa fa-bars"></i>
          </ButtonForm>
          {isSearchEnabled && <NavHeaderSearch />}
        </div>
        <div className="nav-header-center">
          <RolesDropdown />
        </div>
        <ul className="nav navbar-top-links navbar-right">
          <li>
            <span className="m-r-sm text-muted welcome-message">
              Bienvenido a la Plataforma ClubSphere
            </span>
          </li>
          <li>
            <Button
              text="Cerrar Sesión"
              icon={{ icon: "fa fa-sign-out" }}
              onClick={handleLogout}
            />
          </li>
        </ul>
      </nav>
    </div>
  );
};
