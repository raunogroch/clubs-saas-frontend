import { useState, useEffect, useMemo } from "react";
import { Modal } from "../components/Modal";
import { useUpdateGroupMutation } from "../features/groups/groupApi";
import { useSchedulesManager } from "../features/groups/useSchedulesManager";
import type { WeekDay } from "../core/interfaces/Groups";
import { weekDayLabels } from "../common/translations";
import { WEEK_DAYS } from "../common/constants";
import { MESSAGES } from "../common/messages";

interface SchedulesModalProps {
  groupId: string;
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

/**
 * Modal para gestionar horarios de un grupo
 * Responsabilidad única: Renderizar UI de gestión de horarios
 *
 * SOLID:
 * - S: Solo responsable de UI (lógica delegada a useSchedulesManager)
 * - D: Depende de abstracciones (custom hook + mutación RTK)
 */
export const SchedulesModal = ({
  groupId,
  open,
  onClose,
  onSaved,
}: SchedulesModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateGroup] = useUpdateGroupMutation();

  const {
    schedulesList,
    pendingSchedules,
    deletedScheduleIds,
    editingSchedules,
    validationError,
    successMessage,
    isLoading,
    handleAddScheduleRow,
    handleRemoveExisting,
    handleRemovePending,
    handleUpdatePending,
    handleUpdateExisting,
    validateSchedules,
    buildFinalSchedules,
    hasChanges,
    clearState,
    resetState,
    setValidationError,
    setSuccessMessage,
    refetch,
  } = useSchedulesManager(groupId);

  // Resetear estado cuando se abre el modal
  useEffect(() => {
    if (open && groupId) {
      resetState();
    }
  }, [open, groupId, resetState]);

  // Opciones de días para dropdown
  const weekDayOptions = useMemo(
    () =>
      WEEK_DAYS.map((day) => ({
        value: day,
        label: weekDayLabels[day as keyof typeof weekDayLabels] || day,
      })),
    [],
  );

  /**
   * Guardar todos los horarios con validación
   */
  const handleSaveAll = async () => {
    setValidationError(null);
    setSuccessMessage(null);

    try {
      // Validar que hay cambios
      if (!hasChanges()) {
        setValidationError(MESSAGES.VALIDATION.NO_CHANGES_TO_SAVE);
        return;
      }

      const allSchedules = buildFinalSchedules();

      // Validar que todos los horarios tengan valores válidos
      const validationError = validateSchedules(allSchedules);
      if (validationError) {
        setValidationError(validationError);
        return;
      }

      // Guardar todos los horarios
      setIsSubmitting(true);
      await updateGroup({
        id: groupId,
        schedules: allSchedules,
      }).unwrap();

      setSuccessMessage(MESSAGES.SUCCESS.SCHEDULES_SAVED);
      clearState();

      // Refetch para asegurar que los horarios se actualizan en la tabla
      await refetch();

      // Cerrar modal inmediatamente después del éxito
      onSaved?.();
      onClose();
    } catch (error) {
      setValidationError(
        error instanceof Error
          ? error.message
          : MESSAGES.ERROR.SCHEDULE_UPDATE_ERROR,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoadingTotal = isLoading || isSubmitting;
  const visibleSchedules = schedulesList.filter(
    (s) => !deletedScheduleIds.includes(s.id),
  );
  const hasAnySchedules =
    visibleSchedules.length > 0 || pendingSchedules.length > 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Gestionar Horarios del Grupo"
      size="lg"
    >
      <div className="schedules-modal-content">
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

        {/* Botón para agregar horario */}
        <div className="mb-3 float-right">
          <button
            type="button"
            className="btn btn-sm btn-rounded btn-success"
            onClick={handleAddScheduleRow}
            disabled={isLoadingTotal}
          >
            <i className="fa fa-plus"></i> Agregar Horario
          </button>
        </div>

        {/* Tabla unificada de horarios */}
        <div className="table-responsive mb-4">
          {!hasAnySchedules ? (
            <p className="text-muted text-center py-3">
              No hay horarios. Haz clic en "Agregar Horario" para comenzar.
            </p>
          ) : (
            <table className="table table-sm table-hover">
              <thead>
                <tr>
                  <th>Día</th>
                  <th>Hora Inicio</th>
                  <th>Hora Fin</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Horarios existentes - filtrar los marcados como eliminados */}
                {visibleSchedules.map((schedule) => {
                  const isEditing = editingSchedules[schedule.id];
                  const editedData = isEditing || schedule;

                  return (
                    <tr key={schedule.id}>
                      <td>
                        <select
                          className="form-control text-center"
                          value={isEditing ? editedData.day : schedule.day}
                          onChange={(e) =>
                            handleUpdateExisting(
                              schedule.id,
                              "day",
                              e.target.value as WeekDay,
                            )
                          }
                        >
                          {weekDayOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="time"
                          className="form-control form-control-sm"
                          required
                          value={
                            isEditing
                              ? editedData.startTime || ""
                              : schedule.startTime || ""
                          }
                          onChange={(e) =>
                            handleUpdateExisting(
                              schedule.id,
                              "startTime",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="time"
                          className="form-control form-control-sm"
                          required
                          value={
                            isEditing
                              ? editedData.endTime || ""
                              : schedule.endTime || ""
                          }
                          onChange={(e) =>
                            handleUpdateExisting(
                              schedule.id,
                              "endTime",
                              e.target.value,
                            )
                          }
                        />
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm btn-rounded btn-danger"
                          onClick={() =>
                            handleRemoveExisting(schedule.id || "")
                          }
                          disabled={isLoadingTotal || !schedule.id}
                          title={
                            !schedule.id
                              ? MESSAGES.ERROR.INVALID_ID
                              : MESSAGES.CONFIRMATION.DELETE_SCHEDULE
                          }
                        >
                          <i className="fa fa-trash"></i> &nbsp;Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {/* Horarios nuevos */}
                {pendingSchedules.map((schedule) => (
                  <tr key={schedule.tempId} className="table-light">
                    <td>
                      <select
                        className="form-control text-center"
                        value={schedule.day}
                        onChange={(e) =>
                          handleUpdatePending(
                            schedule.tempId,
                            "day",
                            e.target.value as WeekDay,
                          )
                        }
                      >
                        {weekDayOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="time"
                        className="form-control form-control-sm"
                        required
                        value={schedule.startTime || ""}
                        onChange={(e) =>
                          handleUpdatePending(
                            schedule.tempId,
                            "startTime",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        className="form-control form-control-sm"
                        required
                        value={schedule.endTime || ""}
                        onChange={(e) =>
                          handleUpdatePending(
                            schedule.tempId,
                            "endTime",
                            e.target.value,
                          )
                        }
                      />
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-sm btn-rounded btn-warning"
                        onClick={() => handleRemovePending(schedule.tempId)}
                        title={MESSAGES.CONFIRMATION.DELETE_SCHEDULE}
                      >
                        <i className="fa fa-trash"></i> &nbsp;Eliminar
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
            className="btn btn-secondary btn-rounded"
            onClick={onClose}
            disabled={isLoadingTotal}
          >
            <i className="fa fa-times"></i> Cancelar
          </button>

          <button
            type="button"
            className="btn btn-primary btn-rounded"
            onClick={handleSaveAll}
            disabled={isLoadingTotal || !hasChanges()}
          >
            {isLoadingTotal ? (
              <>
                <i className="fa fa-spinner fa-spin"></i> Guardando...
              </>
            ) : (
              <>
                <i className="fa fa-save"></i>&nbsp;Guardar
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
