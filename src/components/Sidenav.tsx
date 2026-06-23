import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { MenuProfile, MenuSingleOption } from ".";
import { useAuthManager } from "../features/auth/useAuthManager";
import { useActiveRole } from "../core/context/useActiveRole";
import { useGetRolesFromMemberships } from "../core/hooks/useGetRolesFromMemberships";
import { getMenuByRole } from "../features/navigation";
import { hasAdminActiveAssignment } from "../core/auth/adminAccess";

export const Sidenav = () => {
  const { pathname } = useLocation();
  const { user, activeAssignmentId } = useAuthManager();
  const { activeRole } = useActiveRole();

  const rolesFromMemberships = useGetRolesFromMemberships(user?.memberships);

  const displayRoles =
    rolesFromMemberships.length > 0
      ? rolesFromMemberships.map((r) => ({ role: r }))
      : [];

  const hasAssignment = hasAdminActiveAssignment(
    activeRole,
    activeAssignmentId,
  );

  const hideMenu = activeRole === "ADMIN" && !hasAssignment;

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
              name={
                user?.name
                  ? `${user.name} ${user.lastname || ""}`.trim()
                  : "Usuario"
              }
              roles={displayRoles}
            />
          </li>

          {!hideMenu &&
            menuItems.map((item) => (
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
