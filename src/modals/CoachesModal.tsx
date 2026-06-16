import { useEffect, useMemo } from "react";
import { Modal } from "../components/Modal";
import { useUpdateGroupMutation } from "../features/groups/groupApi";
import { useCoachesManager } from "../features/groups/useCoachesManager";
import { coachRoleLabels } from "../common/translations";
import { MESSAGES } from "../common/messages";

interface CoachesModalProps {
  groupId: string;
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

/**
 * Modal para gestionar coaches de un grupo
 * Responsabilidad única: Renderizar UI de gestión de coaches
 *
 * SOLID:
 * - S: Solo responsable de UI (lógica delegada a useCoachesManager)
 * - D: Depende de abstracciones (custom hook + mutación RTK)
 */
export const CoachesModal = ({
  groupId,
  open,
  onClose,
  onSaved,
}: CoachesModalProps) => {
  const [updateGroup] = useUpdateGroupMutation();

  const {
    visibleCoaches,
    validationError,
    successMessage,
    isLoading,
    isFormSubmitting,
    register,
    handleSubmit,
    errors,
    handleRemoveCoach,
    validateCoachForm,
    clearState,
    resetState,
    setValidationError,
    setSuccessMessage,
    refetch,
    COACH_ROLES,
  } = useCoachesManager(groupId);

  // Resetear estado cuando se abre el modal
  useEffect(() => {
    if (open && groupId) {
      resetState();
    }
  }, [open, groupId, resetState]);

  // Opciones de roles para dropdown
  const coachRoleOptions = useMemo(
    () =>
      COACH_ROLES.map((role) => ({
        value: role,
        label: coachRoleLabels[role as keyof typeof coachRoleLabels] || role,
      })),
    [],
  );

  /**
   * Manejar envío del formulario
   */
  const onSubmit = handleSubmit(async (data) => {
    setValidationError(null);
    setSuccessMessage(null);

    try {
      // Validar formulario
      const validationError = validateCoachForm(data);
      if (validationError) {
        setValidationError(validationError);
        return;
      }

      // Obtener lista actual de coachIds
      const currentCoachIds = visibleCoaches
        .map((coach) => coach.coachId || coach.id)
        .filter(Boolean) as string[];

      // Agregar nuevo coach
      currentCoachIds.push(data.coachId.trim());

      // Actualizar grupo con la nueva lista de coaches
      await updateGroup({
        id: groupId,
        coaches: currentCoachIds,
      }).unwrap();

      setSuccessMessage(MESSAGES.SUCCESS.COACH_ADDED);
      clearState();

      // Refetch para actualizar la lista
      await refetch();

      // Cerrar modal inmediatamente
      onSaved?.();
      onClose();
    } catch (error) {
      setValidationError(
        error instanceof Error
          ? error.message
          : MESSAGES.ERROR.COACH_UPDATE_ERROR,
      );
    }
  });

  const isLoadingTotal = isLoading || isFormSubmitting;
  const hasCoaches = visibleCoaches.length > 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Gestionar Coaches del Grupo"
      size="lg"
    >
      <div className="coaches-modal-content">
        {/* Mensajes de error/éxito */}
        {validationError && (
          <div className="alert alert-danger" role="alert">
            {validationError}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {/* Formulario para agregar coach */}
        <div className="coach-form-section mb-4">
          <h5>Agregar Nuevo Coach</h5>
          <form onSubmit={onSubmit} className="mb-3">
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">ID del Coach</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ID único del coach"
                  {...register("coachId")}
                  disabled={isLoadingTotal}
                />
                {errors.coachId && (
                  <span className="text-danger">{errors.coachId.message}</span>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Rol del Coach</label>
                <select
                  {...register("role")}
                  className="form-select"
                  disabled={isLoadingTotal}
                >
                  {coachRoleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-rounded btn-sm btn-primary mt-3"
              disabled={isLoadingTotal}
            >
              {isFormSubmitting ? (
                <>
                  <i className="fa fa-spinner fa-spin"></i> Guardando...
                </>
              ) : (
                <>
                  <i className="fa fa-plus"></i> Agregar Coach
                </>
              )}
            </button>
          </form>
        </div>

        {/* Lista de coaches */}
        <div className="coaches-list-section">
          <h5>Coaches Registrados</h5>
          {!hasCoaches ? (
            <p className="text-muted">No hay coaches registrados aún</p>
          ) : (
            <table className="table table-sm table-hover">
              <thead>
                <tr>
                  <th>ID del Coach</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibleCoaches.map((coach) => (
                  <tr key={coach.id}>
                    <td>{coach.coachId || coach.id}</td>
                    <td>
                      {coachRoleLabels[
                        coach.role as keyof typeof coachRoleLabels
                      ] || coach.role}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-rounded btn-sm btn-danger"
                        onClick={() => handleRemoveCoach(coach.id || "")}
                        disabled={isLoadingTotal || !coach.id}
                        title={
                          !coach.id
                            ? MESSAGES.ERROR.INVALID_ID
                            : MESSAGES.CONFIRMATION.DELETE_COACH
                        }
                      >
                        <i className="fa fa-trash"></i> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Botones de acción */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-rounded btn-sm btn-secondary"
            onClick={onClose}
            disabled={isLoadingTotal}
          >
            <i className="fa fa-times"></i> Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};
