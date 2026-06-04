import { Gender, Roles, Status } from "./enums";

export const genderLabels: Record<Gender, string> = {
  [Gender.MALE]: "Masculino",
  [Gender.FEMALE]: "Femenino",
};

export const rolesLabels: Record<Roles, string> = {
  [Roles.SUPER_ADMIN]: "Super Administrador",
  [Roles.ADMIN]: "Administrador",
  [Roles.ASSISTANT]: "Asistente",
  [Roles.COACH]: "Entrenador",
  [Roles.PARENT]: "Padre/Madre",
  [Roles.ATHLETE]: "Atleta",
};

export const statusLabels: Record<Status, string> = {
  [Status.ACTIVE]: "Activo",
  [Status.INACTIVE]: "Inactivo",
  [Status.PENDING]: "Pendiente",
  [Status.SUSPENDED]: "Suspendido",
  [Status.BLOCKED]: "Bloqueado",
};

export const getGenderLabel = (gender?: Gender): string => {
  return gender ? genderLabels[gender] : "N/A";
};

export const getRoleLabel = (role: Roles): string => {
  return rolesLabels[role] || role;
};

export const getStatusLabel = (status?: Status): string => {
  return status ? statusLabels[status] : "N/A";
};
