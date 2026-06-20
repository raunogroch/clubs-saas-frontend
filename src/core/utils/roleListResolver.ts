import { getRoleLabel, Roles } from "../../common";

/**
 * Resuelve la lista de roles que un usuario puede ver/gestionar
 * basándose en su rol activo
 *
 * Principio SOLID aplicado:
 * - SRP: Una única responsabilidad - resolver qué roles son visibles
 * - DIP: Función pura, sin dependencias externas
 */
export const resolveRoleList = (
  userRole: Roles,
  propRoleList?: Roles[] | "*",
): Roles[] => {
  // Si se proporciona explícitamente, usar ese
  if (propRoleList && propRoleList !== "*") {
    return propRoleList;
  }

  // Determinar dinámicamente según el rol del usuario
  switch (userRole) {
    case Roles.SUPER_ADMIN:
      return [Roles.ADMIN];

    case Roles.ADMIN:
      return [Roles.ASSISTANT, Roles.COACH, Roles.PARENT, Roles.ATHLETE];

    default:
      return Object.keys(getRoleLabel) as Roles[];
  }
};
