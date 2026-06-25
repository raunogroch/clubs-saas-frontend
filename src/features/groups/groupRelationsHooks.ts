import { useCallback } from "react";
import type {
  CreateEnrollmentDto,
  GroupEnrollmentPayload,
  UpdateEnrollmentDto,
} from "../../core/interfaces/Groups";
import { useGetGroupQuery } from "./groupApi";
import {
  useRemoveGroupCoachMutation,
  useDeleteGroupScheduleMutation,
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
} from "./groupRelationsApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Traduce errores de RTK Query a mensajes en español
 */
const getErrorMessage = (error: unknown): string | null => {
  if (!error) return null;

  if (typeof error === "object" && "status" in error) {
    const fetchError = error as FetchBaseQueryError;
    switch (fetchError.status) {
      case 404:
        return "El recurso no fue encontrado";
      case 400:
        return "Datos inválidos. Verifica los campos requeridos";
      case 401:
      case 403:
        return "No tienes permisos para realizar esta acción";
      case 500:
        return "Error del servidor. Intenta más tarde";
      default:
        return null;
    }
  }

  return null;
};

// ============ GROUP COACHES HOOKS ============

/**
 * Hook para obtener coaches de un grupo
 * Responsabilidad única: obtener y formatear coaches del grupo completo
 */
export const useGroupCoaches = (groupId?: string) => {
  const {
    data: group,
    isLoading,
    error,
    refetch,
  } = useGetGroupQuery(groupId || "", { skip: !groupId });

  return {
    coaches: group?.coaches ?? [],
    isLoading,
    error: getErrorMessage(error) || (error ? "Error cargando coaches" : null),
    refetch,
    isEmpty: !isLoading && (group?.coaches ?? []).length === 0,
  };
};

/**
 * Hook para eliminar un coach de un grupo
 * Responsabilidad única: eliminar coach
 */
export const useRemoveGroupCoach = () => {
  const [removeCoachMutation, { isLoading, error }] =
    useRemoveGroupCoachMutation();

  const removeCoach = useCallback(
    async (groupId: string, coachId: string) => {
      return await removeCoachMutation({ groupId, coachId }).unwrap();
    },
    [removeCoachMutation],
  );

  return {
    removeCoach,
    isLoading,
    error: getErrorMessage(error) || (error ? "Error eliminando coach" : null),
  };
};

// ============ GROUP SCHEDULES HOOKS ============

/**
 * Hook para obtener horarios de un grupo
 * Responsabilidad única: obtener y formatear horarios del grupo completo
 */
export const useGroupSchedules = (groupId?: string) => {
  const {
    data: group,
    isLoading,
    error,
    refetch,
  } = useGetGroupQuery(groupId || "", { skip: !groupId });

  return {
    schedules: group?.schedules ?? [],
    isLoading,
    error: getErrorMessage(error) || (error ? "Error cargando horarios" : null),
    refetch,
    isEmpty: !isLoading && (group?.schedules ?? []).length === 0,
  };
};

/**
 * Hook para eliminar un horario de un grupo
 * Responsabilidad única: eliminar horario
 */
export const useDeleteGroupSchedule = () => {
  const [deleteScheduleMutation, { isLoading, error }] =
    useDeleteGroupScheduleMutation();

  const deleteSchedule = useCallback(
    async (groupId: string, scheduleId: string) => {
      return await deleteScheduleMutation({ groupId, scheduleId }).unwrap();
    },
    [deleteScheduleMutation],
  );

  return {
    deleteSchedule,
    isLoading,
    error:
      getErrorMessage(error) || (error ? "Error eliminando horario" : null),
  };
};

// ============ GROUP ENROLLMENTS HOOKS ============

/**
 * Hook para obtener inscripciones de atletas en un grupo
 * Responsabilidad única: obtener y formatear inscripciones del grupo completo
 */
export const useGroupEnrollments = (groupId?: string) => {
  const {
    data: group,
    isLoading,
    error,
    refetch,
  } = useGetGroupQuery(groupId || "", { skip: !groupId });

  return {
    enrollments: group?.enrollments ?? [],
    isLoading,
    error:
      getErrorMessage(error) || (error ? "Error cargando inscripciones" : null),
    refetch,
    isEmpty: !isLoading && (group?.enrollments ?? []).length === 0,
  };
};

/**
 * Hook para inscribir un atleta en un grupo
 * Responsabilidad única: crear inscripción
 */
export const useCreateEnrollment = () => {
  const [createEnrollmentMutation, { isLoading, error }] =
    useCreateEnrollmentMutation();

  const createEnrollment = useCallback(
    async (
      groupId: string,
      data: GroupEnrollmentPayload | CreateEnrollmentDto,
    ) => {
      return await createEnrollmentMutation({ groupId, data }).unwrap();
    },
    [createEnrollmentMutation],
  );

  return {
    createEnrollment,
    isLoading,
    error:
      getErrorMessage(error) || (error ? "Error inscribiendo atleta" : null),
  };
};

/**
 * Hook para actualizar una inscripción de atleta
 * Responsabilidad única: actualizar inscripción
 */
export const useUpdateEnrollment = () => {
  const [updateEnrollmentMutation, { isLoading, error }] =
    useUpdateEnrollmentMutation();

  const updateEnrollment = useCallback(
    async (
      groupId: string,
      enrollmentId: string,
      data: UpdateEnrollmentDto,
    ) => {
      return await updateEnrollmentMutation({
        groupId,
        enrollmentId,
        data,
      }).unwrap();
    },
    [updateEnrollmentMutation],
  );

  return {
    updateEnrollment,
    isLoading,
    error:
      getErrorMessage(error) ||
      (error ? "Error actualizando inscripción" : null),
  };
};

/**
 * Hook para eliminar una inscripción de atleta
 * Responsabilidad única: eliminar inscripción
 */
export const useDeleteEnrollment = () => {
  const [deleteEnrollmentMutation, { isLoading, error }] =
    useDeleteEnrollmentMutation();

  const deleteEnrollment = useCallback(
    async (groupId: string, enrollmentId: string) => {
      return await deleteEnrollmentMutation({ groupId, enrollmentId }).unwrap();
    },
    [deleteEnrollmentMutation],
  );

  return {
    deleteEnrollment,
    isLoading,
    error:
      getErrorMessage(error) || (error ? "Error eliminando inscripción" : null),
  };
};
