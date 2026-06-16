import { useState, useCallback } from "react";
import type { CreateGroupScheduleDto } from "../../core/interfaces/Groups";
import { useGroupSchedules } from "./groupRelationsHooks";
import { MESSAGES } from "../../common/messages";

/**
 * Extensión de DTO para schedules pendientes con ID temporal
 */
export interface PendingSchedule extends CreateGroupScheduleDto {
  tempId: string;
}

/**
 * Hook para gestionar toda la lógica de horarios de un grupo
 * Responsabilidad única: Manejar estado y operaciones de horarios
 *
 * SOLID:
 * - S: Una sola responsabilidad (gestión de horarios)
 * - D: Depende de abstracciones (useGroupSchedules)
 */
export const useSchedulesManager = (groupId?: string) => {
  const {
    schedules: fetchedSchedules,
    isLoading: schedulesLoading,
    refetch,
  } = useGroupSchedules(groupId);

  // Estado para cambios locales (antes de guardar)
  const [pendingSchedules, setPendingSchedules] = useState<PendingSchedule[]>(
    [],
  );
  const [deletedScheduleIds, setDeletedScheduleIds] = useState<string[]>([]);
  const [editingSchedules, setEditingSchedules] = useState<
    Record<string, PendingSchedule>
  >({});

  // Estado para mensajes
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const schedulesList = fetchedSchedules || [];

  /**
   * Agregar nueva fila de horario
   * Copia valores de la última fila o usa defaults
   */
  const handleAddScheduleRow = useCallback(() => {
    const lastSchedule = pendingSchedules[pendingSchedules.length - 1];
    const newSchedule: PendingSchedule = {
      day: lastSchedule?.day || "MONDAY",
      startTime: lastSchedule?.startTime || "08:00",
      endTime: lastSchedule?.endTime || "10:00",
      tempId: Date.now().toString(),
    };

    setPendingSchedules((prev) => [...prev, newSchedule]);
  }, [pendingSchedules]);

  /**
   * Eliminar horario existente (marcar para eliminación local)
   */
  const handleRemoveExisting = useCallback((scheduleId: string) => {
    if (!scheduleId) {
      setValidationError(MESSAGES.ERROR.INVALID_ID);
      return;
    }
    if (confirm(MESSAGES.CONFIRMATION.DELETE_SCHEDULE)) {
      setDeletedScheduleIds((prev) => [...prev, scheduleId]);
      // Remover de editingSchedules si estaba siendo editado
      setEditingSchedules((prev) => {
        const newSchedules = { ...prev };
        delete newSchedules[scheduleId];
        return newSchedules;
      });
    }
  }, []);

  /**
   * Eliminar horario pendiente (nuevos no guardados)
   */
  const handleRemovePending = useCallback((tempId: string) => {
    setPendingSchedules((prev) => prev.filter((s) => s.tempId !== tempId));
  }, []);

  /**
   * Actualizar campo de horario pendiente
   */
  const handleUpdatePending = useCallback(
    (tempId: string, field: keyof PendingSchedule, value: string) => {
      setPendingSchedules((prev) =>
        prev.map((s) => (s.tempId === tempId ? { ...s, [field]: value } : s)),
      );
    },
    [],
  );

  /**
   * Actualizar campo de horario existente
   * Preserva otros campos en un solo setState
   */
  const handleUpdateExisting = useCallback(
    (scheduleId: string, field: keyof PendingSchedule, value: string) => {
      const existing = schedulesList.find((s) => s.id === scheduleId);
      if (!existing) return;

      // Obtener datos base: si existe en edición, usar esos, sino usar originales
      const baseData = editingSchedules[scheduleId] || {
        tempId: scheduleId,
        day: existing.day,
        startTime: existing.startTime,
        endTime: existing.endTime,
      };

      // Actualizar en un solo setState
      setEditingSchedules((prev) => ({
        ...prev,
        [scheduleId]: {
          ...baseData,
          [field]: value,
        },
      }));
    },
    [schedulesList, editingSchedules],
  );

  /**
   * Validar que todos los horarios tengan valores válidos
   */
  const validateSchedules = useCallback(
    (schedules: CreateGroupScheduleDto[]): string | null => {
      for (let i = 0; i < schedules.length; i++) {
        const schedule = schedules[i];
        const day = String(schedule.day || "").trim();
        const startTime = String(schedule.startTime || "").trim();
        const endTime = String(schedule.endTime || "").trim();

        if (!day) return MESSAGES.VALIDATION.SCHEDULE_DAY_REQUIRED(i);
        if (!startTime)
          return MESSAGES.VALIDATION.SCHEDULE_START_TIME_REQUIRED(i);
        if (!endTime) return MESSAGES.VALIDATION.SCHEDULE_END_TIME_REQUIRED(i);
      }
      return null;
    },
    [],
  );

  /**
   * Construir lista final de horarios normalizados
   */
  const buildFinalSchedules = useCallback(() => {
    // Horarios existentes (filtrar eliminados, actualizar editados)
    const existingSchedules = schedulesList
      .filter((s) => !deletedScheduleIds.includes(s.id))
      .map((s) => {
        if (editingSchedules[s.id]) {
          const { tempId, ...edited } = editingSchedules[s.id];
          return {
            day: edited.day,
            startTime: edited.startTime,
            endTime: edited.endTime,
          };
        }
        return {
          day: s.day,
          startTime: s.startTime,
          endTime: s.endTime,
        };
      });

    // Nuevos horarios (sin id)
    const newSchedules = pendingSchedules.map(({ tempId, ...schedule }) => ({
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    }));

    return [...existingSchedules, ...newSchedules];
  }, [schedulesList, deletedScheduleIds, editingSchedules, pendingSchedules]);

  /**
   * Verificar si hay cambios pendientes
   */
  const hasChanges = useCallback(() => {
    return (
      pendingSchedules.length > 0 ||
      deletedScheduleIds.length > 0 ||
      Object.keys(editingSchedules).length > 0
    );
  }, [pendingSchedules.length, deletedScheduleIds.length, editingSchedules]);

  /**
   * Limpiar estado después de guardar
   */
  const clearState = useCallback(() => {
    setPendingSchedules([]);
    setDeletedScheduleIds([]);
    setEditingSchedules({});
    setValidationError(null);
    setSuccessMessage(null);
  }, []);

  /**
   * Resetear estado cuando se abre el modal
   */
  const resetState = useCallback(() => {
    setPendingSchedules([]);
    setDeletedScheduleIds([]);
    setEditingSchedules({});
    setValidationError(null);
    setSuccessMessage(null);
    refetch();
  }, [refetch]);

  return {
    // Estado
    schedulesList,
    pendingSchedules,
    deletedScheduleIds,
    editingSchedules,
    validationError,
    successMessage,
    isLoading: schedulesLoading,

    // Handlers
    handleAddScheduleRow,
    handleRemoveExisting,
    handleRemovePending,
    handleUpdatePending,
    handleUpdateExisting,

    // Utilidades
    validateSchedules,
    buildFinalSchedules,
    hasChanges,
    clearState,
    resetState,

    // Métodos para establecer estado
    setValidationError,
    setSuccessMessage,
    refetch,
  };
};
