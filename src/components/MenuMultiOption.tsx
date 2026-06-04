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
import { LabelHighlight } from "./LabelHighlight";

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

        {label && <LabelHighlight text={label.text} type={label.type} />}
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
