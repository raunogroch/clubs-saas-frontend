import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { InputForm, Modal } from "../components";
import type { ClubModalProps } from "../core/interfaces/Clubs";
import { sportOptions, statusOptions } from "../features/clubs/clubFormOptions";
import {
  emptyForm,
  mapClubToForm,
  type ClubFormInputs,
} from "../features/clubs/clubFormMapper";
import { useClubSubmit } from "../features/clubs/useClubSubmit";

export const ClubModal = ({ open, onClose, data, onSaved }: ClubModalProps) => {
  const { submit, isSaving, error } = useClubSubmit(data, onSaved, onClose);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
  } = useForm<ClubFormInputs>({
    mode: "onBlur",
    defaultValues: emptyForm,
  });

  useEffect(() => {
    if (open) {
      reset(mapClubToForm(data));
      clearErrors();
    }
  }, [open, data, reset, clearErrors]);

  const isEdit = Boolean(data?.id);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      await submit(formData);
      reset(emptyForm);
    } catch (error) {
      console.error("Error al guardar club:", error);
    }
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Actualizar club" : "Crear club"}
      description={
        isEdit
          ? "Modifica los datos del club seleccionado"
          : "Completa los datos básicos del club"
      }
      size="lg"
    >
      <form onSubmit={onSubmit}>
        {error && (
          <div className="alert alert-danger" role="alert">
            {typeof error === "string" ? error : "No se pudo guardar el club"}
          </div>
        )}

        <div className="row">
          <div className="col-md-6">
            <InputForm<ClubFormInputs>
              title="Nombre"
              name="name"
              register={register}
              errors={errors}
              required="El nombre es obligatorio"
              disabled={isSaving}
            />

            <InputForm<ClubFormInputs>
              title="Imagen"
              name="image"
              register={register}
              errors={errors}
              disabled={isSaving}
            />

            <InputForm<ClubFormInputs>
              title="Deporte"
              name="sport"
              register={register}
              errors={errors}
              type="select"
              options={sportOptions}
              required="Selecciona un deporte"
              disabled={isSaving}
            />

            <InputForm<ClubFormInputs>
              title="Teléfono"
              name="phone"
              register={register}
              errors={errors}
              required="El teléfono es obligatorio"
              disabled={isSaving}
            />

            <InputForm<ClubFormInputs>
              title="Dirección"
              name="address"
              register={register}
              errors={errors}
              required="La dirección es obligatoria"
              disabled={isSaving}
            />
          </div>

          <div className="col-md-6">
            <InputForm<ClubFormInputs>
              title="Ciudad"
              name="city"
              register={register}
              errors={errors}
              required="La ciudad es obligatoria"
              disabled={isSaving}
            />

            <InputForm<ClubFormInputs>
              title="País"
              name="country"
              register={register}
              errors={errors}
              required="El país es obligatorio"
              disabled={isSaving}
            />

            <InputForm<ClubFormInputs>
              title="Assignment ID"
              name="assignmentId"
              register={register}
              errors={errors}
              required="El assignmentId es obligatorio"
              disabled={isSaving}
            />

            <InputForm<ClubFormInputs>
              title="Estado"
              name="status"
              register={register}
              errors={errors}
              type="select"
              options={statusOptions}
              required="El estado es obligatorio"
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="modal-footer">
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
            {isSaving ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
