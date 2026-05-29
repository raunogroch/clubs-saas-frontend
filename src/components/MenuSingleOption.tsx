import { Link } from "react-router";

interface MenuSingleOptionProps {
  route: string;
  icon: string;
  name: string;
  active?: boolean;
}

export const MenuSingleOption = ({
  route,
  icon,
  name,
  active = false,
}: MenuSingleOptionProps) => {
  return (
    <>
      <li className={active ? "active" : ""}>
        <Link to={route}>
          <i className={`fa fa-${icon}`}></i>
          <span className="nav-label">{name}</span>
        </Link>
      </li>
    </>
  );
};
