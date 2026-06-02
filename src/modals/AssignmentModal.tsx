import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { InputForm, Modal } from "../components";
import {
  useCreateAssignment,
  useUpdateAssignment,
} from "../features/assignments/assignmentHooks";
import type { Assignment } from "../features/assignments/assignmentApi";

type Inputs = {
  name: string;
};

interface AssignmentModalProps {
  identifier: string;
  data?: Assignment;
  onSaved?: () => void;
}

export const AssignmentModal = (props: AssignmentModalProps) => {
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

  const isEdit = Boolean(props.data?.id);
  const isSaving = isCreating || isUpdating;
  const error = createError || updateError;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    defaultValues: {
      name: props.data?.name ?? "",
    },
  });

  useEffect(() => {
    reset({ name: props.data?.name ?? "" });
  }, [props.data, reset]);

  const hideModal = () => {
    const $ = (window as any).jQuery || (window as any).$;
    if ($) {
      $(`#${props.identifier}`).modal("hide");
      return;
    }

    const modal = document.getElementById(props.identifier);
    if (modal) {
      modal.classList.remove("in");
      modal.style.display = "none";
    }
    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.remove();
    }
    document.body.classList.remove("modal-open");
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (isEdit && props.data?.id) {
        await updateAssignment({ id: props.data.id, ...data });
      } else {
        await createAssignment(data);
      }

      reset();
      hideModal();
      props.onSaved?.();
    } catch (err) {
      console.error("Error al guardar asignación:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Modal
        title={isEdit ? "Actualizar asignacion" : "Crear asignacion"}
        identifier={props.identifier}
        buttonName={isSaving ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
      >
        {error && (
          <div className="alert alert-danger" role="alert">
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
      </Modal>
    </form>
  );
};
