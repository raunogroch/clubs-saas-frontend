import { Roles } from "../../common/enums";

export const useValidateRolesConsistency = (rolesArray: Roles[]) => {
  const validRoles = Object.values(Roles);

  // Filtrar valores undefined/null
  const validatedArray = rolesArray.filter(
    (role): role is Roles => role !== undefined && role !== null,
  );

  const invalidRoles = validatedArray.filter(
    (role) => !validRoles.includes(role),
  );

  if (invalidRoles.length > 0) {
    console.warn(
      "[useValidateRolesConsistency] ⚠️ Roles inválidos encontrados:",
      invalidRoles,
      "Roles válidos:",
      validRoles,
    );
  }

  return {
    isValid: invalidRoles.length === 0 && validatedArray.length > 0,
    invalidRoles,
    validRoles,
    filteredRoles: validatedArray,
  };
};
