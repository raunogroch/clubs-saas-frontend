/**
 * <MenuMultiOption
 *   route="/dashboard"
 *   icon="home"
 *   name="Dashboard"
 *   subItems={[
 *     { label: "Inicio", route: "/dashboard" },
 *     { label: "Reportes", route: "/dashboard/reports" }
 *   ]}
 * />
 */

import { Link } from "react-router";

interface SubItem {
  label: string;
  route: string;
}

type LabelType = "primary" | "success" | "info" | "warning" | "danger";

interface LabelProps {
  text: string;
  type: LabelType;
}

interface MenuMultiOptionProps {
  route: string;
  icon: string;
  name: string;
  label?: LabelProps;
  subItems: SubItem[];
}

export const MenuMultiOption = ({
  route,
  icon,
  name,
  subItems,
  label,
}: MenuMultiOptionProps) => {
  return (
    <li>
      <Link to={route}>
        <i className={`fa fa-${icon}`}></i>

        <span className="nav-label">{name}</span>

        {label && (
          <span className={`label label-${label.type} float-right`}>
            {label.text}
          </span>
        )}
      </Link>

      <ul className="nav nav-second-level collapse">
        {subItems.map((item) => (
          <li key={item.route}>
            <Link to={item.route}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </li>
  );
};
