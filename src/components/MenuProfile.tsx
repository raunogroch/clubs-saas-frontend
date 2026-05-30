import { Link } from "react-router";
import { DropdownMenu } from "./DropdownMenu";
import { Roles } from "../common";

interface MenuProfileProps {
  imageUrl: string;
  name: string;
  roles: string[];
}

export const MenuProfile = (props: MenuProfileProps) => {
  return (
    <div className="dropdown profile-element">
      <img alt="image" className="rounded-circle" src={props.imageUrl} />
      <Link data-toggle="dropdown" className="dropdown-toggle" to="#">
        <span className="block m-t-xs font-bold">{props.name}</span>
        <span className="text-muted text-xs block">
          {props.roles
            .map((role) => Roles[role as keyof typeof Roles])
            .join(", ")}
          <b className="caret"></b>
        </span>
      </Link>
      <DropdownMenu
        options={[
          { label: "Profile", route: "/profile" },
          { label: "Contacts", route: "/contacts" },
          { label: "Mailbox", route: "/mailbox" },
          { label: "Logout", route: "/logout", divider: true },
        ]}
      />
    </div>
  );
};
