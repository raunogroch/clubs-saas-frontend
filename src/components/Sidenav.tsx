import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MenuProfile, MenuSingleOption } from ".";
import { useAuthManager } from "../features/auth/authHooks";

declare global {
  interface JQuery {
    metisMenu: () => JQuery;
  }
}

export const Sidenav = () => {
  const { pathname } = useLocation();
  const { user } = useAuthManager();

  useEffect(() => {
    // Reinitialize MetisMenu after React renders
    const $ = (window as any).$;
    if ($) {
      $("#side-menu").metisMenu();
    }
  }, []);

  // Mostrar nombre completo o un valor por defecto
  const displayName = user?.name
    ? `${user.name} ${user.lastname || ""}`.trim()
    : "Usuario";
  const displayRoles = user?.roles || [];

  return (
    <>
      <nav className="navbar-default navbar-static-side" role="navigation">
        <div className="sidebar-collapse">
          <ul className="nav metismenu" id="side-menu">
            <li className="nav-header">
              <MenuProfile
                imageUrl="assets/img/profile_small.jpg"
                name={displayName}
                roles={displayRoles}
              />
              <div className="logo-element">
                <img
                  src="assets/img/olympics.svg"
                  alt="logo"
                  style={{ height: "20px" }}
                />
              </div>
            </li>

            <MenuSingleOption
              route={"/dashboard"}
              icon={"th-large"}
              name={"Inicio"}
              active={pathname === "/dashboard"}
            />

            <MenuSingleOption
              route={"/assignments"}
              icon={"fa fa-tasks"}
              name={"Asignaciones"}
              active={pathname === "/assignments"}
            />

            <MenuSingleOption
              route={"/users"}
              icon={"users"}
              name={"Usuarios"}
              active={pathname === "/users"}
            />

            <MenuSingleOption
              route={"/admins"}
              icon={"users"}
              name={"Administradores"}
              active={pathname === "/admins"}
            />
          </ul>
        </div>
      </nav>
    </>
  );
};
