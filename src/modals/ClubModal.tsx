import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputForm, Modal } from "../components";
import { useAssignmentPersistence } from "../core/hooks";
import type { ClubModalProps } from "../core/interfaces/Clubs";
import { useAuthManager } from "../features/auth/useAuthManager";
import { sportOptions } from "../features/clubs/clubFormOptions";
import {
  emptyForm,
  mapClubToForm,
  type ClubFormInputs,
} from "../features/clubs/clubFormMapper";
import { useClubSubmit } from "../features/clubs/useClubSubmit";

export const ClubModal = ({ open, onClose, data, onSaved }: ClubModalProps) => {
  const { submit, isSaving, error } = useClubSubmit(data, onSaved, onClose);
  const { assignmentId: persistedAssignmentId, setAssignmentId } =
    useAssignmentPersistence();
  const { activeAssignmentId } = useAuthManager();

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [autoLocation, setAutoLocation] = useState(false); // 👈 clave
  const [manualLocationEnabled, setManualLocationEnabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
    setValue,
  } = useForm<ClubFormInputs>({
    mode: "onBlur",
    defaultValues: emptyForm,
  });

  const isEdit = Boolean(data?.id);

  const defaultAssignmentId =
    data?.assignmentId || persistedAssignmentId || activeAssignmentId || "";

  useEffect(() => {
    if (!open) return;

    const nextValues = mapClubToForm(data);

    if (!isEdit && defaultAssignmentId && !nextValues.assignmentId) {
      nextValues.assignmentId = defaultAssignmentId;
    }

    reset(nextValues);
    clearErrors();
  }, [open, data, reset, clearErrors, isEdit, defaultAssignmentId]);

  useEffect(() => {
    if (!open || isEdit) return;

    setLoadingLocation(true);
    setAutoLocation(false);
    setManualLocationEnabled(false);

    if (!navigator.geolocation) {
      setLoadingLocation(false);
      setManualLocationEnabled(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );

          const data = await res.json();

          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.municipality ||
            "";

          const country = data.address?.country || "";

          setValue("city", city);
          setValue("country", country);

          setAutoLocation(true); // 👈 detectado OK
        } catch (err) {
          console.error(err);
          setManualLocationEnabled(true);
        } finally {
          setLoadingLocation(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setManualLocationEnabled(true); // 👈 fallback manual
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }, [open, isEdit, setValue]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const resolvedAssignmentId =
        formData.assignmentId.trim() || defaultAssignmentId;

      if (resolvedAssignmentId) {
        setAssignmentId(resolvedAssignmentId);
      }

      await submit({ ...formData, assignmentId: resolvedAssignmentId });
      reset(emptyForm);
    } catch (error) {
      console.error("Error al guardar club:", error);
    }
  });

  const locationLocked = autoLocation && !manualLocationEnabled;

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
          <div className="alert alert-danger">
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
              title="Oficina"
              name="address"
              register={register}
              errors={errors}
              required="La dirección es obligatoria"
              disabled={isSaving}
            />

            <InputForm<ClubFormInputs>
              title="Telefono"
              name="phone"
              register={register}
              errors={errors}
              required="El teléfono es obligatorio"
              disabled={isSaving}
            />
          </div>

          <div className="col-md-6">
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
              title="Ciudad"
              name="city"
              register={register}
              errors={errors}
              required="La ciudad es obligatoria"
              disabled={isSaving || locationLocked}
            />

            <InputForm<ClubFormInputs>
              title="País"
              name="country"
              register={register}
              errors={errors}
              required="El país es obligatorio"
              disabled={isSaving || locationLocked}
            />

            {loadingLocation && (
              <small className="text-muted">Detectando ubicación...</small>
            )}

            {!loadingLocation && manualLocationEnabled && (
              <button
                type="button"
                className="btn btn-sm btn-outline-primary mt-2"
                onClick={() => setManualLocationEnabled(false)}
              >
                Ingresar ubicación manualmente
              </button>
            )}
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
            {isSaving ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
