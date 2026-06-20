import { useEffect } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";

import { InputForm, Modal } from "../components";
import { RolesFieldArray } from "../components/RolesFieldArray";

import { useCreateUser, useUpdateUser } from "../features/users/userHooks";
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
} from "../features/users/userApi";

import {
  genderLabels,
  statusLabels,
  rolesLabels,
} from "../common/translations";
import type { Gender, Roles, Status } from "../common/enums";
import type { UserFormInputs } from "../core/types";
import type { UserModalProps } from "../core/interfaces";

// Selects
const genderOptions = Object.entries(genderLabels).map(([value, label]) => ({
  value,
  label,
}));

const statusOptions = Object.entries(statusLabels).map(([value, label]) => ({
  value,
  label,
}));

// Valores por defecto
const emptyForm: UserFormInputs = {
  name: "",
  lastname: "",
  dni: "",
  username: "",
  roles: [{ role: "" }],
  gender: "",
  birthDate: "",
  phone: "",
  address: "",
  status: "",
};

const mapUserToForm = (user?: User): UserFormInputs => {
  if (!user) return emptyForm;

  return {
    name: user.name ?? "",
    lastname: user.lastname ?? "",
    dni: user.dni ?? "",
    username: user.username ?? "",
    roles:
      user.roles?.length > 0
        ? user.roles.map((r) => ({
            role: r.role as Roles,
          }))
        : [{ role: "" }],
    gender: user.gender ?? "",
    birthDate: user.birthDate
      ? new Date(user.birthDate).toISOString().split("T")[0]
      : "",
    phone: user.phone ?? "",
    address: user.address ?? "",
    status: user.status ?? "",
  };
};

export const UserModal = (props: UserModalProps) => {
  const { roleList } = props;

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
    formState: { errors, isSubmitting },
    reset,
    control,
    setError,
    clearErrors,
  } = useForm<UserFormInputs>({
    mode: "onBlur",
    defaultValues: emptyForm,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "roles",
  });

  useEffect(() => {
    if (props.open) {
      reset(mapUserToForm(props.data));
      clearErrors();
    }
  }, [props.open, props.data, reset, clearErrors]);

  const onSubmit: SubmitHandler<UserFormInputs> = async (formData) => {
    try {
      const roles = formData.roles
        .map((r) => r.role)
        .filter((role): role is Roles => role !== "");

      if (roles.length === 0) {
        setError("roles", {
          type: "manual",
          message: "Debe seleccionar al menos un rol",
        });
        return;
      }

      const basePayload = {
        name: formData.name.trim(),
        lastname: formData.lastname.trim(),
        dni: formData.dni.trim(),
        username: formData.username.trim(),
        roles,
        ...(formData.gender && { gender: formData.gender as Gender }),
        ...(formData.status && { status: formData.status as Status }),
        ...(formData.phone && { phone: formData.phone.trim() }),
        ...(formData.address && { address: formData.address.trim() }),
        ...(formData.birthDate && {
          birthDate: new Date(formData.birthDate),
        }),
      };

      if (isEdit && props.data?.id) {
        await updateUser({
          id: props.data.id,
          ...basePayload,
        } as UpdateUserDto);
      } else {
        await createUser({
          ...basePayload,
          password: formData.dni.trim(),
        } as CreateUserDto);
      }

      reset(emptyForm);
      props.onSaved?.();
      props.onClose();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
    }
  };

  // 🔥 ROLES FILTRADOS (CORREGIDO)
  const allRoleOptions = Object.entries(rolesLabels).map(([value, label]) => ({
    value,
    label,
  }));

  const roleOptions =
    roleList === "*" || !roleList
      ? allRoleOptions
      : allRoleOptions.filter((option) =>
          roleList.includes(option.value as Roles),
        );

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      title={isEdit ? "Actualizar usuario" : "Crear usuario"}
      description={
        isEdit
          ? "Modifica los datos del usuario seleccionado"
          : "El DNI será utilizado como contraseña inicial"
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="alert alert-danger alert-dismissible">
            <button
              type="button"
              className="close"
              onClick={() => clearErrors()}
            >
              ×
            </button>
            <strong>Error:</strong>{" "}
            {typeof error === "string"
              ? error
              : "No se pudo guardar el usuario"}
          </div>
        )}

        <div className="row">
          <div className="col-md-6">
            <InputForm<UserFormInputs>
              title="Nombre"
              name="name"
              register={register}
              errors={errors}
              required="El nombre es obligatorio"
              disabled={isSaving}
            />

            <InputForm<UserFormInputs>
              title="Apellido"
              name="lastname"
              register={register}
              errors={errors}
              required="El apellido es obligatorio"
              disabled={isSaving}
            />

            <InputForm<UserFormInputs>
              title="Carnet"
              name="dni"
              register={register}
              errors={errors}
              required="El carnet es obligatorio"
              disabled={isSaving}
            />

            <InputForm<UserFormInputs>
              title="Usuario"
              name="username"
              register={register}
              errors={errors}
              required="El usuario es obligatorio"
              disabled={isSaving}
            />

            <InputForm<UserFormInputs>
              title="Género"
              name="gender"
              register={register}
              errors={errors}
              type="select"
              options={genderOptions}
              disabled={isSaving}
            />
          </div>

          <div className="col-md-6">
            <InputForm<UserFormInputs>
              title="Nacimiento"
              name="birthDate"
              register={register}
              errors={errors}
              type="date"
              disabled={isSaving}
            />

            <InputForm<UserFormInputs>
              title="Teléfono"
              name="phone"
              register={register}
              errors={errors}
              disabled={isSaving}
            />

            <InputForm<UserFormInputs>
              title="Dirección"
              name="address"
              register={register}
              errors={errors}
              disabled={isSaving}
            />

            <InputForm<UserFormInputs>
              title="Estado"
              name="status"
              register={register}
              errors={errors}
              type="select"
              options={statusOptions}
              disabled={isSaving}
            />

            <RolesFieldArray
              fields={fields}
              append={append}
              remove={remove}
              register={register}
              isSaving={isSaving}
              error={errors.roles?.message}
              roleOptions={roleOptions}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-sm btn-rounded btn-white"
            onClick={props.onClose}
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
