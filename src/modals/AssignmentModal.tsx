import { useEffect, useCallback } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { InputForm, Modal } from "../components";
import {
  useCreateAssignment,
  useUpdateAssignment,
} from "../features/assignments/assignmentHooks";
import type { AssignmentModalProps } from "../core/interfaces";

type Inputs = {
  name: string;
};

export const AssignmentModal = ({
  open,
  onClose,
  data,
  onSaved,
}: AssignmentModalProps) => {
  const {
    createAssignment,
    isLoading: isCreating,
    error: createError,
  } = useCreateAssignment();
  const {
    updateAssignment,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateAssignment();

  const isEdit = Boolean(data?.id);
  const isSaving = isCreating || isUpdating;
  const error = createError || updateError;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
  } = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({ name: data?.name ?? "" });
      clearErrors();
    }
  }, [open, data, reset, clearErrors]);

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async (formData) => {
      try {
        if (isEdit && data?.id) {
          await updateAssignment({ id: data.id, ...formData });
        } else {
          await createAssignment(formData);
        }

        reset();
        onSaved?.();
        onClose();
      } catch (err) {
        console.error("Error al guardar asignación:", err);
      }
    },
    [
      isEdit,
      data?.id,
      updateAssignment,
      createAssignment,
      onSaved,
      onClose,
      reset,
    ],
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Actualizar asignación" : "Crear asignación"}
      description={
        isEdit
          ? "Modifica los datos de la asignación"
          : "Crea una nueva asignación"
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="alert alert-danger alert-dismissible" role="alert">
            <button
              type="button"
              className="close"
              onClick={() => clearErrors()}
              aria-label="Cerrar"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <strong>Error:</strong>{" "}
            {typeof error === "string" ? error : "Error al guardar asignación"}
          </div>
        )}

        <InputForm
          title="Nombre"
          name="name"
          register={register}
          errors={errors}
          required="El nombre es obligatorio"
          disabled={isSaving}
        />

        <div className="modal-footer mt-4">
          <button
            type="button"
            className="btn btn-white"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSaving || isSubmitting}
          >
            {isSaving ? (
              <>
                <span className="fa fa-spinner fa-spin me-2" />
                Guardando...
              </>
            ) : isEdit ? (
              "Actualizar"
            ) : (
              "Crear"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
