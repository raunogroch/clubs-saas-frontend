import {
  adminMenu,
  assistantMenu,
  athleteMenu,
  coachMenu,
  parentMenu,
  superAdminMenu,
} from ".";
import type { Roles } from "../../common";
import type { MenuItem } from "../../core/interfaces";

export const getMenuByRole = (role: Roles): MenuItem[] => {
  const menuMap: Record<Roles, MenuItem[]> = {
    SUPER_ADMIN: superAdminMenu,
    ADMIN: adminMenu,
    ASSISTANT: assistantMenu,
    COACH: coachMenu,
    PARENT: parentMenu,
    ATHLETE: athleteMenu,
  };

  return menuMap[role] || [];
};

export const isRouteAllowedForRole = (route: string, role: Roles): boolean => {
  const menuItems = getMenuByRole(role);

  return menuItems.some((item) => {
    if (item.route === route) {
      return true;
    }

    return route.startsWith(`${item.route}/`);
  });
};

export const getAllowedRoutesForRole = (role: Roles): string[] => {
  const menuItems = getMenuByRole(role);
  return menuItems.map((item) => item.route);
};
