import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useGroupEnrollments } from "./groupRelationsHooks";
import { ENROLLMENT_STATUSES } from "../../common/constants";
import { MESSAGES } from "../../common/messages";

/**
 * Hook para gestionar la lógica de inscripciones de un grupo
 * Responsabilidad única: Manejar estado y operaciones de inscripciones
 *
 * SOLID:
 * - S: Una sola responsabilidad (gestión de inscripciones)
 * - D: Depende de abstracciones (useGroupEnrollments, react-hook-form)
 */
export const useEnrollmentsManager = (groupId?: string) => {
  const {
    enrollments: fetchedEnrollments,
    isLoading: enrollmentsLoading,
    refetch,
  } = useGroupEnrollments(groupId);

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
      athleteId: "",
      status: ENROLLMENT_STATUSES.ACTIVE,
    },
  });

  // Estado local para inscripciones marcadas para eliminación
  const [deletedEnrollmentIds, setDeletedEnrollmentIds] = useState<string[]>(
    [],
  );

  const enrollmentsList = fetchedEnrollments || [];
  const isLoading = enrollmentsLoading;

  /**
   * Remover un atleta del grupo
   */
  const handleRemoveEnrollment = useCallback((enrollmentId: string) => {
    if (!enrollmentId) {
      setValidationError(MESSAGES.ERROR.INVALID_ID);
      return;
    }
    if (confirm(MESSAGES.CONFIRMATION.DELETE_ATHLETE)) {
      setDeletedEnrollmentIds((prev) => [...prev, enrollmentId]);
    }
  }, []);

  /**
   * Filtrar inscripciones eliminadas
   */
  const visibleEnrollments = enrollmentsList.filter(
    (e) => !deletedEnrollmentIds.includes(e.id || ""),
  );

  /**
   * Validar que el formulario sea válido
   */
  const validateEnrollmentForm = useCallback(
    (data: { athleteId: string; status: string }): string | null => {
      if (!data.athleteId?.trim()) {
        return MESSAGES.VALIDATION.ATHLETE_ID_REQUIRED;
      }
      if (!data.status?.trim()) {
        return MESSAGES.VALIDATION.STATUS_REQUIRED;
      }
      // Verificar que no esté ya inscrito
      if (visibleEnrollments.some((e) => e.athleteId === data.athleteId)) {
        return MESSAGES.VALIDATION.ATHLETE_ALREADY_ENROLLED;
      }
      return null;
    },
    [visibleEnrollments],
  );

  /**
   * Obtener label del estado
   */
  const getStatusLabel = useCallback((status: string): string => {
    const labels: Record<string, string> = {
      ACTIVE: "Activo",
      PENDING: "Pendiente",
      SUSPENDED: "Suspendido",
      WITHDRAWN: "Retirado",
      COMPLETED: "Completado",
    };
    return labels[status] || status;
  }, []);

  /**
   * Obtener clase CSS del estado
   */
  const getStatusBadgeClass = useCallback((status: string): string => {
    const classes: Record<string, string> = {
      ACTIVE: "badge bg-success",
      PENDING: "badge bg-warning text-dark",
      SUSPENDED: "badge bg-danger",
      WITHDRAWN: "badge bg-secondary",
      COMPLETED: "badge bg-info",
    };
    return classes[status] || "badge bg-light text-dark";
  }, []);

  /**
   * Limpiar estado
   */
  const clearState = useCallback(() => {
    reset();
    setDeletedEnrollmentIds([]);
    setValidationError(null);
    setSuccessMessage(null);
  }, [reset]);

  /**
   * Resetear estado cuando se abre el modal
   */
  const resetState = useCallback(() => {
    clearState();
    refetch();
  }, [clearState, refetch]);

  return {
    // Estado
    enrollmentsList,
    visibleEnrollments,
    deletedEnrollmentIds,
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
    handleRemoveEnrollment,
    validateEnrollmentForm,

    // Utilidades
    getStatusLabel,
    getStatusBadgeClass,
    clearState,
    resetState,

    // Métodos para establecer estado
    setValidationError,
    setSuccessMessage,
    setDeletedEnrollmentIds,
    refetch,

    // Constantes
    ENROLLMENT_STATUSES,
    ENROLLMENT_STATUS_LIST: Object.values(ENROLLMENT_STATUSES),
  };
};
