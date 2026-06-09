import type { MenuItem } from "../../../core/interfaces";

export const superAdminMenu: MenuItem[] = [
  {
    id: "dashboard",
    route: "/dashboard",
    icon: "th-large",
    name: "Dashboard",
  },
  {
    id: "admins",
    route: "/admins",
    icon: "users",
    name: "Administradores",
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
  {
    id: "reports",
    route: "/reports",
    icon: "fa fa-chart-bar",
    name: "Reportes",
  },
];
