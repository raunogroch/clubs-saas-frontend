import {
  ClubStatus,
  CoachRole,
  EnrollmentStatus,
  Gender,
  Roles,
  Sport,
  Status,
  WeekDay,
} from "./enums";

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

export const weekDayLabels: Record<WeekDay, string> = {
  [WeekDay.MONDAY]: "Lunes",
  [WeekDay.TUESDAY]: "Martes",
  [WeekDay.WEDNESDAY]: "Miércoles",
  [WeekDay.THURSDAY]: "Jueves",
  [WeekDay.FRIDAY]: "Viernes",
  [WeekDay.SATURDAY]: "Sábado",
  [WeekDay.SUNDAY]: "Domingo",
};

export const coachRoleLabels: Record<CoachRole, string> = {
  [CoachRole.HEAD_COACH]: "Entrenador Principal",
  [CoachRole.ASSISTANT_COACH]: "Entrenador Asistente",
  [CoachRole.FITNESS_COACH]: "Entrenador de Fitness",
  [CoachRole.GOALKEEPER_COACH]: "Entrenador de Porteros",
  [CoachRole.TECHNICAL_ASSISTANT]: "Asistente Técnico",
};

export const enrollmentStatusLabels: Record<EnrollmentStatus, string> = {
  [EnrollmentStatus.ACTIVE]: "Activo",
  [EnrollmentStatus.PENDING]: "Pendiente",
  [EnrollmentStatus.SUSPENDED]: "Suspendido",
  [EnrollmentStatus.WITHDRAWN]: "Retirado",
  [EnrollmentStatus.COMPLETED]: "Completado",
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

export const getWeekDayLabel = (day?: WeekDay): string => {
  return day ? weekDayLabels[day] : "N/A";
};

export const getCoachRoleLabel = (role?: CoachRole): string => {
  return role ? coachRoleLabels[role] : "N/A";
};

export const getEnrollmentStatusLabel = (status?: EnrollmentStatus): string => {
  return status ? enrollmentStatusLabels[status] : "N/A";
};
