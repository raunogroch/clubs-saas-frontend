import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useGroupCoaches } from "./groupRelationsHooks";
import { COACH_ROLES } from "../../../common/constants";
import { MESSAGES } from "../../../common/messages";

/**
 * Hook para gestionar la lógica de coaches de un grupo
 * Responsabilidad única: Manejar estado y operaciones de coaches
 * Reutilizable por CoachesModal y GroupCoachesTab
 *
 * SOLID:
 * - S: Una sola responsabilidad (gestión de coaches)
 * - O: Fácil de extender sin modificar el hook
 * - D: Depende de abstracciones (useGroupCoaches, react-hook-form)
 */
export const useCoachesManager = (groupId?: string) => {
  const {
    coaches: fetchedCoaches,
    isLoading: coachesLoading,
    refetch,
  } = useGroupCoaches(groupId);

  // Estado para mensajes
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm({
    defaultValues: {
      coachId: "",
      role: COACH_ROLES[0],
    },
  });

  // Estado local para coaches marcados para eliminación
  const [deletedCoachIds, setDeletedCoachIds] = useState<string[]>([]);

  const coachesList = fetchedCoaches || [];
  const isLoading = coachesLoading;

  /**
   * Remover un coach del grupo
   */
  const handleRemoveCoach = useCallback((coachId: string) => {
    if (!coachId) {
      setValidationError(MESSAGES.ERROR.INVALID_ID);
      return;
    }
    if (confirm(MESSAGES.CONFIRMATION.DELETE_COACH)) {
      setDeletedCoachIds((prev) => [...prev, coachId]);
    }
  }, []);

  /**
   * Filtrar coaches eliminados
   */
  const visibleCoaches = coachesList.filter(
    (c) => !deletedCoachIds.includes(c.id || ""),
  );

  /**
   * Validar que el coachId sea válido
   */
  const validateCoachForm = useCallback(
    (data: { coachId: string; role: string }): string | null => {
      if (!data.coachId?.trim()) {
        return MESSAGES.VALIDATION.COACH_ID_REQUIRED;
      }
      if (!data.role?.trim()) {
        return MESSAGES.VALIDATION.COACH_ROLE_REQUIRED;
      }
      // Verificar que no esté ya asignado
      if (visibleCoaches.some((c) => c.coachId === data.coachId)) {
        return MESSAGES.VALIDATION.COACH_ALREADY_ASSIGNED;
      }
      return null;
    },
    [visibleCoaches],
  );

  /**
   * Limpiar estado
   */
  const clearState = useCallback(() => {
    reset();
    setDeletedCoachIds([]);
    setValidationError(null);
    setSuccessMessage(null);
  }, [reset]);

  /**
   * Resetear estado cuando se abre el modal/tab
   */
  const resetState = useCallback(() => {
    clearState();
    refetch();
  }, [clearState, refetch]);

  return {
    // Estado
    coachesList,
    visibleCoaches,
    deletedCoachIds,
    validationError,
    successMessage,
    isLoading,
    isFormSubmitting,

    // Form
    register,
    handleSubmit,
    errors,
    formErrors: errors,

    // Handlers
    handleRemoveCoach,
    validateCoachForm,

    // Utilidades
    clearState,
    resetState,

    // Métodos para establecer estado
    setValidationError,
    setSuccessMessage,
    setDeletedCoachIds,
    refetch,

    // Constantes
    COACH_ROLES,
  };
};
