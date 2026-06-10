import { ClubStatus, Gender, Roles, Sport, Status } from "./enums";

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

export const sportLabels: Record<Sport, string> = {
  [Sport.FOOTBALL]: "Fútbol",
  [Sport.FUTSAL]: "Futsal",
  [Sport.BASKETBALL]: "Baloncesto",
  [Sport.VOLLEYBALL]: "Voleibol",
  [Sport.SWIMMING]: "Natación",
  [Sport.TENNIS]: "Tenis",
  [Sport.ATHLETICS]: "Atletismo",
  [Sport.RUGBY]: "Rugby",
  [Sport.BOXING]: "Boxeo",
  [Sport.WRESTLING]: "Lucha",
  [Sport.HOCKEY]: "Hockey",
  [Sport.BASEBALL]: "Béisbol",
  [Sport.GOLF]: "Golf",
  [Sport.CYCLING]: "Ciclismo",
  [Sport.MARTIAL_ARTS]: "Artes Marciales",
  [Sport.AMERICAN_FOOTBALL]: "Fútbol Americano",
};

export const statusClubLabels: Record<ClubStatus, string> = {
  [ClubStatus.ACTIVE]: "Activo",
  [ClubStatus.INACTIVE]: "Inactivo",
  [ClubStatus.SUSPENDED]: "Suspendido",
};

export const getGenderLabel = (gender?: Gender): string => {
  return gender ? genderLabels[gender] : "N/A";
};

export const getRoleLabel = (role?: Roles): string => {
  return role ? rolesLabels[role] : "Sin rol";
};

export const getStatusLabel = (status?: Status): string => {
  return status ? statusLabels[status] : "N/A";
};

export const getSportLabel = (sport?: Sport): string => {
  return sport ? sportLabels[sport] : "N/A";
};

export const getClubStatusLabel = (status?: ClubStatus): string => {
  return status ? statusClubLabels[status] : "N/A";
};
