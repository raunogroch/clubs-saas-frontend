import { useEffect } from "react";
import { Modal } from "../components/Modal";
import { useCreateEnrollmentMutation } from "../features/groups/groupRelationsApi";
import { useEnrollmentsManager } from "../features/groups/useEnrollmentsManager";
import { MESSAGES } from "../common/messages";

interface EnrollmentsModalProps {
  groupId: string;
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

/**
 * Modal para gestionar inscripciones de atletas en un grupo
 * Responsabilidad única: Renderizar UI de gestión de enrollments
 *
 * SOLID:
 * - S: Solo responsable de UI (lógica delegada a useEnrollmentsManager)
 * - D: Depende de abstracciones (custom hook + mutación RTK)
 */
export const EnrollmentsModal = ({
  groupId,
  open,
  onClose,
  onSaved,
}: EnrollmentsModalProps) => {
  const [createEnrollment] = useCreateEnrollmentMutation();

  const {
    visibleEnrollments,
    validationError,
    successMessage,
    isLoading,
    isFormSubmitting,
    register,
    handleSubmit,
    errors,
    handleRemoveEnrollment,
    validateEnrollmentForm,
    getStatusLabel,
    getStatusBadgeClass,
    clearState,
    resetState,
    setValidationError,
    setSuccessMessage,
    refetch,
    ENROLLMENT_STATUS_LIST,
  } = useEnrollmentsManager(groupId);

  // Resetear estado cuando se abre el modal
  useEffect(() => {
    if (open && groupId) {
      resetState();
    }
  }, [open, groupId, resetState]);

  /**
   * Manejar envío del formulario
   */
  const onSubmit = handleSubmit(async (data) => {
    setValidationError(null);
    setSuccessMessage(null);

    try {
      // Validar formulario
      const validationError = validateEnrollmentForm(data);
      if (validationError) {
        setValidationError(validationError);
        return;
      }

      // Crear inscripción
      await createEnrollment({
        groupId,
        data: {
          athleteId: data.athleteId.trim(),
          status: data.status,
        },
      }).unwrap();

      setSuccessMessage(MESSAGES.SUCCESS.ATHLETE_ENROLLED);
      clearState();

      // Refetch para actualizar la lista
      await refetch();

      // Cerrar modal inmediatamente
      onSaved?.();
      onClose();
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : MESSAGES.ERROR.ENROLLMENT_ERROR,
      );
    }
  });

  const isLoadingTotal = isLoading || isFormSubmitting;
  const hasEnrollments = visibleEnrollments.length > 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Gestionar Atletas del Grupo"
      size="lg"
    >
      <div className="enrollments-modal-content">
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

        {/* Formulario para inscribir atleta */}
        <div className="enrollment-form-section mb-4">
          <h5>Inscribir Nuevo Atleta</h5>
          <form onSubmit={onSubmit} className="mb-3">
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">ID del Atleta</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ID único del atleta"
                  {...register("athleteId")}
                  disabled={isLoadingTotal}
                />
                {errors.athleteId && (
                  <span className="text-danger">
                    {errors.athleteId.message}
                  </span>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Estado</label>
                <select
                  {...register("status")}
                  className="form-select"
                  disabled={isLoadingTotal}
                >
                  {ENROLLMENT_STATUS_LIST.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-sm btn-primary mt-3"
              disabled={isLoadingTotal}
            >
              {isFormSubmitting ? (
                <>
                  <i className="fa fa-spinner fa-spin"></i> Inscribiendo...
                </>
              ) : (
                <>
                  <i className="fa fa-plus"></i> Inscribir Atleta
                </>
              )}
            </button>
          </form>
        </div>

        {/* Lista de atletas */}
        <div className="enrollments-list-section">
          <h5>Atletas Inscritos</h5>
          {!hasEnrollments ? (
            <p className="text-muted">No hay atletas inscritos aún</p>
          ) : (
            <table className="table table-sm table-hover">
              <thead>
                <tr>
                  <th>ID del Atleta</th>
                  <th>Estado</th>
                  <th>Fecha de Inscripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibleEnrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td>{enrollment.athleteId}</td>
                    <td>
                      <span className={getStatusBadgeClass(enrollment.status)}>
                        {getStatusLabel(enrollment.status)}
                      </span>
                    </td>
                    <td>
                      {enrollment.joinedAt
                        ? new Date(enrollment.joinedAt).toLocaleDateString(
                            "es-ES",
                          )
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          handleRemoveEnrollment(enrollment.id || "")
                        }
                        disabled={isLoadingTotal || !enrollment.id}
                        title={
                          !enrollment.id
                            ? MESSAGES.ERROR.INVALID_ID
                            : MESSAGES.CONFIRMATION.DELETE_ATHLETE
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
            className="btn btn-secondary"
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
