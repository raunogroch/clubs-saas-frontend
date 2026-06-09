import type { MenuItem } from "../../../core/interfaces";

export const adminMenu: MenuItem[] = [
  {
    id: "dashboard",
    route: "/dashboard",
    icon: "th-large",
    name: "Dashboard",
  },
  {
    id: "coaches",
    route: "/coaches",
    icon: "fa fa-person",
    name: "Entrenadores",
  },
  {
    id: "athletes",
    route: "/athletes",
    icon: "fa fa-running",
    name: "Atletas",
  },
  {
    id: "parents",
    route: "/parents",
    icon: "fa fa-users",
    name: "Tutores",
  },
  {
    id: "assignments",
    route: "/assignments",
    icon: "fa fa-tasks",
    name: "Asignaciones",
  },
];
