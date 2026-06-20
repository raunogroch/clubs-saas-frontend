import type { MenuItem } from "../../../core/interfaces";

export const superAdminMenu: MenuItem[] = [
  {
    id: "dashboard",
    route: "/dashboard",
    icon: "th-large",
    name: "Dashboard",
  },
  {
    id: "assignments",
    route: "/assignments",
    icon: "fa fa-tasks",
    name: "Asignaciones",
  },
  {
    id: "users",
    route: "/users",
    icon: "users",
    name: "Usuarios",
  },
];
