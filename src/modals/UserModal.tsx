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

import { genderLabels, statusLabels } from "../common/translations";
import type { Gender, Roles, Status } from "../common/enums";
import type { UserFormInputs } from "../core/types";
import type { UserModalProps } from "../core/interfaces";

// Opciones de selects - Memoizadas fuera del componente
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

/**
 * Transforma un usuario de la API al formato del formulario
 * Maneja conversiones de tipos y values vacíos
 */
const mapUserToForm = (user?: User): UserFormInputs => {
  if (!user) {
    return emptyForm;
  }

  return {
    name: user.name ?? "",
    lastname: user.lastname ?? "",
    dni: user.dni ?? "",
    username: user.username ?? "",

    // Transformar roles: UserRole[] → { role: Roles | "" }[]
    roles:
      user.roles && user.roles.length > 0
        ? user.roles.map((userRole) => ({
            role: userRole.role as Roles, // UserRole.role es siempre Roles
          }))
        : [{ role: "" }],

    gender: user.gender ?? "",

    // Manejo seguro de dates (usar ISO string sin conversión)
    birthDate: user.birthDate
      ? new Date(user.birthDate).toISOString().split("T")[0]
      : "",

    phone: user.phone ?? "",
    address: user.address ?? "",
    status: user.status ?? "",
  };
};

export const UserModal = ({ open, onClose, data, onSaved }: UserModalProps) => {
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

  const isEdit = Boolean(data?.id);
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
    mode: "onBlur", // Validar solo cuando pierde el foco
    defaultValues: emptyForm,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "roles",
  });

  /**
   * Reset del formulario cuando cambia el usuario a editar
   * Optimizado: solo resetea cuando open=true y cambia data
   */
  useEffect(() => {
    if (open) {
      reset(mapUserToForm(data));
      clearErrors(); // Limpiar errores previos
    }
  }, [open, data, reset, clearErrors]);

  /**
   * Lógica de envío del formulario
   * Incluye validaciones, transformaciones y manejo de errores
   */
  const onSubmit: SubmitHandler<UserFormInputs> = async (formData) => {
    try {
      // Validar roles (al menos uno debe estar seleccionado)
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

      if (isEdit && data?.id) {
        const updatePayload: UpdateUserDto = {
          id: data.id,
          ...basePayload,
        };
        await updateUser(updatePayload);
      } else {
        const createPayload: CreateUserDto = {
          ...basePayload,
          password: formData.dni.trim(),
        };
        await createUser(createPayload);
      }

      reset(emptyForm);
      onSaved?.();
      onClose();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Actualizar usuario" : "Crear usuario"}
      description={
        isEdit
          ? "Modifica los datos del usuario seleccionado"
          : "El DNI será utilizado como contraseña inicial"
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Error global del API */}
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
            {typeof error === "string"
              ? error
              : "No se pudo guardar el usuario"}
          </div>
        )}

        {/* Contenido del formulario en dos columnas */}

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
            />
          </div>
        </div>

        {/* Footer con botones */}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-sm  btn-rounded btn-white"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn btn-sm  btn-rounded btn-primary"
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
