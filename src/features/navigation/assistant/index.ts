import type { MenuItem } from "../../../core/interfaces";

export const assistantMenu: MenuItem[] = [
  {
    id: "dashboard",
    route: "/dashboard",
    icon: "th-large",
    name: "Dashboard",
  },
  {
    id: "athletes",
    route: "/athletes",
    icon: "fa fa-running",
    name: "Atletas",
  },
  {
    id: "assignments",
    route: "/assignments",
    icon: "fa fa-tasks",
    name: "Asignaciones",
  },
];
