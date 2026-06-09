import type { MenuItem } from "../../../core/interfaces";

export const athleteMenu: MenuItem[] = [
  {
    id: "dashboard",
    route: "/dashboard",
    icon: "th-large",
    name: "Dashboard",
  },
  {
    id: "my-assignments",
    route: "/my-assignments",
    icon: "fa fa-tasks",
    name: "Mis Asignaciones",
  },
  {
    id: "my-progress",
    route: "/my-progress",
    icon: "fa fa-chart-line",
    name: "Mi Progreso",
  },
];
