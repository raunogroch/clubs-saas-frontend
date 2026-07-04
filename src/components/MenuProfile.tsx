import { Link, useNavigate } from "react-router";
import { DropdownMenu } from "./DropdownMenu";
import { useAuthManager } from "../features/auth";
import { useActiveRole } from "../core/context/useActiveRole";
import { getRoleLabel } from "../common/translations";
import type { MenuProfileProps } from "../core/interfaces";

export const MenuProfile = (props: MenuProfileProps) => {
  const navigate = useNavigate();
  const { logout } = useAuthManager();
  const { activeRole } = useActiveRole();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dropdown profile-element">
      <img alt="image" className="rounded-circle" src={props.imageUrl} />
      <Link data-toggle="dropdown" className="dropdown-toggle" to="#">
        <span className="block m-t-xs font-bold">{props.name}</span>
        <span className="text-muted text-xs block">
          {getRoleLabel(activeRole)}
          <b className="caret"></b>
        </span>
      </Link>
      <DropdownMenu
        options={[
          { label: "Profile", route: "/profile" },
          { label: "Contacts", route: "/contacts" },
          { label: "Mailbox", route: "/mailbox" },
          { label: "Logout", onClick: handleLogout, divider: true },
        ]}
      />
    </div>
  );
};
