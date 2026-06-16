import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputForm, Modal } from "../components";
import { useAssignmentPersistence } from "../core/hooks";
import type { GroupModalProps } from "../core/interfaces/Groups";
import { useAppSelector } from "../hooks/reduxHooks";
import {
  emptyForm,
  mapGroupToForm,
  type GroupFormInputs,
} from "../features/groups/groupFormMapper";
import { useGroupSubmit } from "../features/groups/useGroupSubmit";

interface GroupsModalProps extends GroupModalProps {}

export const GroupsModal = ({
  open,
  onClose,
  data,
  onSaved,
  defaultClubId,
}: GroupsModalProps) => {
  const {
    submit,
    isSaving,
    error: submitError,
  } = useGroupSubmit(data, onSaved, onClose);
  const { assignmentId: persistedAssignmentId, setAssignmentId } =
    useAssignmentPersistence();
  const user = useAppSelector((state) => state.auth.user);
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
  } = useForm<GroupFormInputs>({
    mode: "onBlur",
    defaultValues: emptyForm,
  });

  const isEdit = Boolean(data?.id);
  const defaultAssignmentId =
    data?.assignmentId ||
    persistedAssignmentId ||
    user?.assignments?.[0]?.assignmentId ||
    "";

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextValues = mapGroupToForm(data);

    if (!isEdit && defaultClubId && !nextValues.clubId) {
      nextValues.clubId = defaultClubId;
    }

    if (!isEdit && defaultAssignmentId && !nextValues.assignmentId) {
      nextValues.assignmentId = defaultAssignmentId;
    }

    reset(nextValues);
    clearErrors();
    setValidationError(null);
  }, [
    open,
    data,
    reset,
    clearErrors,
    isEdit,
    defaultAssignmentId,
    defaultClubId,
  ]);

  const onSubmit = handleSubmit(async (formData) => {
    setValidationError(null);

    try {
      const resolvedAssignmentId =
        formData.assignmentId.trim() || defaultAssignmentId;

      if (resolvedAssignmentId) {
        setAssignmentId(resolvedAssignmentId);
      }

      await submit({ ...formData, assignmentId: resolvedAssignmentId });
      reset(emptyForm);
    } catch (error) {
      if (error instanceof Error && error.message) {
        setValidationError(error.message);
      } else {
        setValidationError("Ocurrió un error al guardar el grupo");
      }
      console.error("Error al guardar grupo:", error);
    }
  });

  const modalTitle = isEdit ? "Actualizar grupo" : "Crear grupo";
  const modalDescription = isEdit
    ? "Modifica los datos del grupo seleccionado"
    : "Completa los datos básicos del grupo";

  const displayError = validationError || submitError;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modalTitle}
      description={modalDescription}
      size="lg"
    >
      <form onSubmit={onSubmit}>
        {displayError && (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {displayError}
          </div>
        )}

        <div className="row">
          <div className="col-md-6">
            <InputForm<GroupFormInputs>
              placeholder="Nombre del grupo"
              name="name"
              register={register}
              errors={errors}
              required="El nombre es obligatorio"
              disabled={isSaving}
            />

            <InputForm<GroupFormInputs>
              placeholder="Dirección"
              name="address"
              register={register}
              errors={errors}
              disabled={isSaving}
            />
          </div>

          <div className="col-md-6">
            <InputForm<GroupFormInputs>
              placeholder="Máximo de atletas"
              name="maxAthletes"
              register={register}
              errors={errors}
              type="number"
              disabled={isSaving}
            />

            <InputForm<GroupFormInputs>
              placeholder="Edad mínima"
              name="minAge"
              register={register}
              errors={errors}
              type="number"
              disabled={isSaving}
            />

            <InputForm<GroupFormInputs>
              placeholder="Edad máxima"
              name="maxAge"
              register={register}
              errors={errors}
              type="number"
              disabled={isSaving}
            />
          </div>

          <div className="col-12">
            <InputForm<GroupFormInputs>
              placeholder="Descripción"
              name="description"
              register={register}
              errors={errors}
              type="textarea"
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-sm btn-rounded btn-white"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-sm btn-rounded btn-primary"
            disabled={isSaving || isSubmitting}
          >
            <i className="fa fa-save"></i>&nbsp;
            {isSaving ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
