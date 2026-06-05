import { useEffect } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { InputForm, Modal } from "../components";
import { useCreateUser, useUpdateUser } from "../features/users/userHooks";
import type { User } from "../features/users/userApi";
import {
  genderLabels,
  statusLabels,
  rolesLabels,
} from "../common/translations";
import { Roles } from "../common/enums";

type Inputs = {
  name: string;
  lastname: string;
  dni: string;
  username: string;
  roles: Array<{ id: string; role: Roles }>;
  gender?: string;
  birthDate?: string;
  phone?: string;
  address?: string;
  status?: string;
};

interface UserModalProps {
  identifier: string;
  data?: User;
  onSaved?: () => void;
}

export const UserModal = (props: UserModalProps) => {
  const {
    createUser,
    isLoading: isCreating,
    error: createError,
  } = useCreateUser();
  const {
    updateUser,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateUser();

  const isEdit = Boolean(props.data?.id);
  const isSaving = isCreating || isUpdating;
  const error = createError || updateError;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<Inputs>({
    defaultValues: {
      name: props.data?.name ?? "",
      lastname: props.data?.lastname ?? "",
      dni: props.data?.dni ?? "",
      username: props.data?.username ?? "",
      roles:
        props.data?.roles?.map((roleObj: any) => ({
          id: roleObj.id,
          role: roleObj.role,
        })) ?? [],
      gender: props.data?.gender ?? "",
      birthDate: props.data?.birthDate
        ? new Date(props.data.birthDate).toISOString().split("T")[0]
        : "",
      phone: props.data?.phone ?? "",
      address: props.data?.address ?? "",
      status: props.data?.status ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "roles",
  });

  useEffect(() => {
    reset({
      name: props.data?.name ?? "",
      lastname: props.data?.lastname ?? "",
      dni: props.data?.dni ?? "",
      username: props.data?.username ?? "",
      roles:
        props.data?.roles?.map((roleObj: any) => ({
          id: roleObj.id,
          role: roleObj.role,
        })) ?? [],
      gender: props.data?.gender ?? "",
      birthDate: props.data?.birthDate
        ? new Date(props.data.birthDate).toISOString().split("T")[0]
        : "",
      phone: props.data?.phone ?? "",
      address: props.data?.address ?? "",
      status: props.data?.status ?? "",
    });
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
      const rolesArray = data.roles
        .map((r) => r.role)
        .filter((r) => r && String(r).trim().length > 0);

      const userData: any = {
        name: data.name,
        lastname: data.lastname,
        dni: data.dni,
        username: data.username,
        roles: rolesArray,
      };

      // Agregar campos opcionales si existen
      if (data.gender) userData.gender = data.gender;
      if (data.birthDate) userData.birthDate = new Date(data.birthDate);
      if (data.phone) userData.phone = data.phone;
      if (data.address) userData.address = data.address;
      if (data.status) userData.status = data.status;

      if (isEdit && props.data?.id) {
        await updateUser({ id: props.data.id, ...userData });
      } else {
        // Cuando se crea un nuevo usuario, usar el DNI como contraseña
        await createUser({ ...userData, password: data.dni });
      }

      reset();
      hideModal();
      props.onSaved?.();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Modal
        title={isEdit ? "Actualizar usuario" : "Crear usuario"}
        description={
          isEdit
            ? "Modifica los campos que deseas actualizar y haz clic en 'Actualizar'."
            : "Completa los campos para crear un nuevo usuario. El DNI se usará como contraseña inicial."
        }
        identifier={props.identifier}
        buttonName={isSaving ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
        size="lg"
      >
        {error && (
          <div className="alert alert-danger" role="alert">
            {typeof error === "string" ? error : "Error al guardar usuario"}
          </div>
        )}

        <div className="row">
          {/* Columna Izquierda - Información Personal */}
          <div className="col-md-6">
            <InputForm
              title="Nombre"
              name="name"
              register={register}
              errors={errors}
              required="El nombre es obligatorio"
              disabled={isSaving}
            />

            <InputForm
              title="Apellido"
              name="lastname"
              register={register}
              errors={errors}
              required="El apellido es obligatorio"
              disabled={isSaving}
            />

            <InputForm
              title="Carnet"
              name="dni"
              register={register}
              errors={errors}
              required="El DNI es obligatorio"
              disabled={isSaving}
            />

            <InputForm
              title="Usuario"
              name="username"
              register={register}
              errors={errors}
              required="El usuario es obligatorio"
              disabled={isSaving}
            />

            <InputForm
              title="Género"
              name="gender"
              register={register}
              errors={errors}
              type="select"
              required="El género es obligatorio"
              options={Object.entries(genderLabels).map(([value, label]) => ({
                value,
                label,
              }))}
              disabled={isSaving}
            />
          </div>

          {/* Columna Derecha - Información Adicional */}
          <div className="col-md-6">
            <InputForm
              title="Nacimiento"
              name="birthDate"
              register={register}
              errors={errors}
              type="date"
              required="La fecha de nacimiento es obligatoria"
              disabled={isSaving}
            />

            <InputForm
              title="Teléfono"
              name="phone"
              register={register}
              errors={errors}
              required="El teléfono es obligatorio"
              disabled={isSaving}
            />

            <InputForm
              title="Dirección"
              name="address"
              register={register}
              errors={errors}
              required="La dirección es obligatoria"
              disabled={isSaving}
            />

            <InputForm
              title="Estado"
              name="status"
              register={register}
              errors={errors}
              type="select"
              required="El estado es obligatorio"
              options={Object.entries(statusLabels).map(([value, label]) => ({
                value,
                label,
              }))}
              disabled={isSaving}
            />
            <div className="form-group row mt-3">
              <label className="col-sm-2 col-form-label">Roles</label>
              <div className="col-sm-10">
                {fields.map((field, index) => (
                  <div key={field.id} className="input-group mb-2">
                    <select
                      className="form-control"
                      {...register(`roles.${index}.role` as const, {
                        required: "El rol es obligatorio",
                      })}
                      disabled={isSaving}
                    >
                      <option value="">Seleccionar rol...</option>
                      {Object.entries(Roles).map(([value]) => (
                        <option key={value} value={value}>
                          {rolesLabels[value as Roles]}
                        </option>
                      ))}
                    </select>
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => remove(index)}
                        disabled={isSaving}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={() =>
                    append({ id: String(fields.length), role: "" as any })
                  }
                  disabled={isSaving}
                >
                  <i className="fa fa-plus" aria-hidden="true"></i> agregar rol
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </form>
  );
};
