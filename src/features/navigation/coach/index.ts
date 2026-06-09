import type { MenuItem } from "../../../core/interfaces";

export const coachMenu: MenuItem[] = [
  {
    id: "dashboard",
    route: "/dashboard",
    icon: "th-large",
    name: "Dashboard",
  },
  {
    id: "my-athletes",
    route: "/my-athletes",
    icon: "fa fa-running",
    name: "Mis Atletas",
  },
  {
    id: "my-assignments",
    route: "/my-assignments",
    icon: "fa fa-tasks",
    name: "Mis Asignaciones",
  },
  {
    id: "my-team",
    route: "/my-team",
    icon: "fa fa-users",
    name: "Mi Equipo",
  },
];
