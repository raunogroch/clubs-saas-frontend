import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { MenuProfile, MenuSingleOption } from ".";
import { useAuthManager } from "../features/auth/authHooks";
import { useActiveRole } from "../core/context/useActiveRole";
import type { UserRole } from "../features/users";
import { getMenuByRole } from "../features/navigation";

export const Sidenav = () => {
  const { pathname } = useLocation();
  const { user } = useAuthManager();
  const { activeRole } = useActiveRole();

  const displayName = user?.name
    ? `${user.name} ${user.lastname || ""}`.trim()
    : "Usuario";

  const displayRoles: UserRole[] = user?.roles || [];

  // Obtener el menú específico para el rol activo
  const menuItems = useMemo(
    () => (activeRole ? getMenuByRole(activeRole) : []),
    [activeRole],
  );

  return (
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

          {menuItems.map((item) => (
            <MenuSingleOption
              key={item.id}
              route={item.route}
              icon={item.icon}
              name={item.name}
              active={pathname === item.route}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
};
