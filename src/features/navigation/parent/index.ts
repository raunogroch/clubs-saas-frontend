import type { MenuItem } from "../../../core/interfaces";

export const parentMenu: MenuItem[] = [
  {
    id: "dashboard",
    route: "/dashboard",
    icon: "th-large",
    name: "Dashboard",
  },
  {
    id: "my-children",
    route: "/my-children",
    icon: "fa fa-child",
    name: "Mis Hijos",
  },
  {
    id: "assignments",
    route: "/assignments",
    icon: "fa fa-tasks",
    name: "Asignaciones",
  },
];
