/**
 * Mensajes centralizados del proyecto
 * Single Source of Truth para mensajes de error, validación y éxito
 */

export const MESSAGES = {
  VALIDATION: {
    // General
    REQUIRED_FIELD: (fieldName: string) => `${fieldName} es requerido`,
    INVALID_FORMAT: (fieldName: string) =>
      `${fieldName} tiene un formato inválido`,

    // Schedules
    SCHEDULE_DAY_REQUIRED: (index: number) =>
      `Horario ${index + 1}: El día es requerido`,
    SCHEDULE_START_TIME_REQUIRED: (index: number) =>
      `Horario ${index + 1}: La hora de inicio es requerida`,
    SCHEDULE_END_TIME_REQUIRED: (index: number) =>
      `Horario ${index + 1}: La hora de fin es requerida`,
    NO_CHANGES_TO_SAVE: "No hay cambios para guardar",

    // Coaches
    COACH_ID_REQUIRED: "El ID del coach es obligatorio",
    COACH_ROLE_REQUIRED: "El rol del coach es obligatorio",
    COACH_ALREADY_ASSIGNED: "Este coach ya está asignado al grupo",

    // Enrollments
    ATHLETE_ID_REQUIRED: "El ID del atleta es obligatorio",
    ATHLETE_ALREADY_ENROLLED: "Este atleta ya está inscrito en el grupo",
    STATUS_REQUIRED: "El estado es obligatorio",

    // Groups
    GROUP_NAME_REQUIRED: "El nombre del grupo es obligatorio",
    CLUB_REQUIRED: "Debe seleccionar un club",
  },

  SUCCESS: {
    // Schedules
    SCHEDULES_SAVED: "Horarios guardados exitosamente",
    SCHEDULE_ADDED: "Horario agregado exitosamente",
    SCHEDULE_DELETED: "Horario eliminado exitosamente",

    // Coaches
    COACH_ADDED: "Coach agregado exitosamente",
    COACH_REMOVED: "Coach eliminado exitosamente",
    COACHES_SAVED: "Coaches guardados exitosamente",

    // Enrollments
    ATHLETE_ENROLLED: "Atleta inscrito exitosamente",
    ATHLETE_REMOVED: "Atleta removido exitosamente",
    ENROLLMENT_STATUS_UPDATED: "Estado de inscripción actualizado",

    // Groups
    GROUP_CREATED: "Grupo creado exitosamente",
    GROUP_UPDATED: "Grupo actualizado exitosamente",
    GROUP_DELETED: "Grupo eliminado exitosamente",
  },

  ERROR: {
    // Schedules
    SCHEDULE_DELETE_ERROR: "Error al eliminar horario",
    SCHEDULE_UPDATE_ERROR: "Error al actualizar horario",
    SCHEDULE_FETCH_ERROR: "Error al cargar horarios",

    // Coaches
    COACH_REMOVE_ERROR: "Error al eliminar coach",
    COACH_UPDATE_ERROR: "Error al actualizar coach",
    COACH_FETCH_ERROR: "Error al cargar coaches",

    // Enrollments
    ENROLLMENT_ERROR: "Error al procesar inscripción",
    ENROLLMENT_DELETE_ERROR: "Error al eliminar inscripción",
    ENROLLMENT_FETCH_ERROR: "Error al cargar inscripciones",

    // Groups
    GROUP_FETCH_ERROR: "Error al cargar grupo",
    GROUP_UPDATE_ERROR: "Error al actualizar grupo",

    // General
    INVALID_ID: "Error: El ID es inválido",
    SERVER_ERROR: "Error del servidor. Intenta más tarde",
    NETWORK_ERROR: "Error de conexión. Verifica tu conexión",
  },

  CONFIRMATION: {
    DELETE_SCHEDULE: "¿Estás seguro de que deseas eliminar este horario?",
    DELETE_COACH: "¿Estás seguro de que deseas eliminar este coach?",
    DELETE_ATHLETE: "¿Estás seguro de que deseas remover este atleta?",
    DELETE_GROUP: "¿Estás seguro de que deseas eliminar este grupo?",
  },
} as const;
