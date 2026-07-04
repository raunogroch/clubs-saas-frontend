import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Modal } from "../components/Modal";
import { FormRow } from "../components/FormRow";
import {
  useCreateUser,
  useUpdateUser,
  useLazyGetUsersQuery,
} from "../features/users";
import { useCreateEnrollment } from "../features/groups";
import { Roles } from "../common/enums";
import type { Gender } from "../common/enums";
import type {
  CreateUserDto,
  UpdateUserDto,
  Membership,
  User,
} from "../core/interfaces";
import { useDebounce } from "../hooks/useDebounce";

interface AthleteEnrollmentModalProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
  groupId?: string;
  assignmentId?: string;
  clubId?: string;
  athlete?: User | null;
}

interface AthleteEnrollmentFormValues {
  name: string;
  lastname: string;
  dni: string;
  username: string;
  gender: string;
  birthDate: string;
  phone: string;
  address: string;
}

const emptyForm: AthleteEnrollmentFormValues = {
  name: "",
  lastname: "",
  dni: "",
  username: "",
  gender: "",
  birthDate: "",
  phone: "",
  address: "",
};

const mapAthleteToForm = (
  athlete?: User | null,
): AthleteEnrollmentFormValues => {
  if (!athlete) {
    return emptyForm;
  }

  return {
    name: athlete.name ?? "",
    lastname: athlete.lastname ?? "",
    dni: athlete.dni ?? "",
    username: athlete.username ?? "",
    gender: athlete.gender ?? "",
    birthDate: athlete.birthDate
      ? new Date(athlete.birthDate).toISOString().split("T")[0]
      : "",
    phone: athlete.phone ?? "",
    address: athlete.address ?? "",
  };
};

const buildSuggestedUsername = (name: string, lastname: string) => {
  const normalizedName = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const normalizedLastname = lastname
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const firstName = normalizedName.split(/\s+/).filter(Boolean)[0] ?? "";
  const firstLastname =
    normalizedLastname.split(/\s+/).filter(Boolean)[0] ?? "";

  if (!firstName || !firstLastname) {
    return "";
  }

  return `${firstName}.${firstLastname}`;
};

export const AthleteEnrollmentModal = ({
  open,
  onClose,
  onSaved,
  groupId,
  assignmentId,
  clubId,
  athlete,
}: AthleteEnrollmentModalProps) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isUsernameManuallyEdited, setIsUsernameManuallyEdited] =
    useState(false);
  const [usernameAvailability, setUsernameAvailability] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [usernameAvailabilityMessage, setUsernameAvailabilityMessage] =
    useState<string | null>(null);

  const {
    createUser,
    isLoading: isCreatingUser,
    error: createUserError,
  } = useCreateUser();
  const {
    updateUser,
    isLoading: isUpdatingUser,
    error: updateUserError,
  } = useUpdateUser();
  const {
    createEnrollment,
    isLoading: isCreatingEnrollment,
    error: createEnrollmentError,
  } = useCreateEnrollment();
  const [triggerGetUsers] = useLazyGetUsersQuery();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AthleteEnrollmentFormValues>({
    defaultValues: emptyForm,
  });
  const watchedName = useWatch({ control, name: "name" }) as string | undefined;
  const watchedLastname = useWatch({ control, name: "lastname" }) as
    | string
    | undefined;
  const watchedUsername = useWatch({ control, name: "username" }) as
    | string
    | undefined;
  const debouncedUsername = useDebounce(watchedUsername?.trim() ?? "", 400);
  const isEditMode = Boolean(athlete?.id);

  useEffect(() => {
    if (!open) return;

    reset(mapAthleteToForm(athlete));
    // Deferir updates de estado para evitar setState síncrono en el effect
    setTimeout(() => {
      setFormError(null);
      setFormSuccess(null);
      setIsUsernameManuallyEdited(Boolean(athlete?.id));
      setUsernameAvailability("idle");
      setUsernameAvailabilityMessage(null);
    }, 0);
  }, [open, athlete, reset]);

  useEffect(() => {
    if (isUsernameManuallyEdited) {
      return;
    }

    const suggestedUsername = buildSuggestedUsername(
      watchedName ?? "",
      watchedLastname ?? "",
    );

    if (!suggestedUsername) {
      return;
    }

    if (watchedUsername !== suggestedUsername) {
      setValue("username", suggestedUsername, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [
    isUsernameManuallyEdited,
    watchedName,
    watchedLastname,
    watchedUsername,
    setValue,
  ]);

  useEffect(() => {
    const candidate = debouncedUsername.trim();

    if (!candidate) {
      // Deferir para evitar setState síncrono en el effect
      setTimeout(() => {
        setUsernameAvailability("idle");
        setUsernameAvailabilityMessage(null);
      }, 0);
      return;
    }

    let ignore = false;

    const checkAvailability = async () => {
      setUsernameAvailability("checking");
      setUsernameAvailabilityMessage("Verificando disponibilidad...");

      try {
        const response = await triggerGetUsers({
          search: candidate,
          page: 1,
          limit: 10,
        }).unwrap();

        if (ignore) {
          return;
        }

        const isTaken = response?.data?.some(
          (user) =>
            user.id !== athlete?.id &&
            user.username?.trim().toLowerCase() === candidate.toLowerCase(),
        );

        setUsernameAvailability(isTaken ? "taken" : "available");
        setUsernameAvailabilityMessage(
          isTaken
            ? "El nombre de usuario ya está en uso."
            : "El nombre de usuario está disponible.",
        );
      } catch {
        if (!ignore) {
          setUsernameAvailability("idle");
          setUsernameAvailabilityMessage(null);
        }
      }
    };

    checkAvailability();

    return () => {
      ignore = true;
    };
  }, [athlete?.id, debouncedUsername, triggerGetUsers]);

  const onSubmit = handleSubmit(async (formData) => {
    setFormError(null);
    setFormSuccess(null);

    if (!assignmentId) {
      setFormError("No se pudo identificar la asignación del grupo.");
      return;
    }

    if (!isEditMode && !groupId) {
      setFormError("No se pudo identificar el grupo seleccionado.");
      return;
    }

    if (!isEditMode && !clubId) {
      setFormError("No se pudo identificar el club del grupo.");
      return;
    }

    try {
      const normalizedName = formData.name.trim();
      const normalizedLastname = formData.lastname.trim();
      const normalizedDni = formData.dni.trim();
      const normalizedUsername = formData.username.trim();

      if (normalizedUsername && usernameAvailability === "taken") {
        setFormError("El nombre de usuario no está disponible.");
        return;
      }
      const normalizedPhone = formData.phone?.trim() || undefined;
      const normalizedAddress = formData.address?.trim() || undefined;
      const normalizedBirthDate = formData.birthDate
        ? new Date(formData.birthDate)
        : undefined;

      const commonProfilePayload = {
        name: normalizedName,
        lastname: normalizedLastname,
        dni: normalizedDni,
        username: normalizedUsername,
        status: "ACTIVE" as const,
        ...(formData.gender ? { gender: formData.gender as Gender } : {}),
        ...(normalizedBirthDate ? { birthDate: normalizedBirthDate } : {}),
        ...(normalizedPhone ? { phone: normalizedPhone } : {}),
        ...(normalizedAddress ? { address: normalizedAddress } : {}),
      };

      const initialMembership = {
        role: Roles.ATHLETE,
        assignmentId,
        status: "ACTIVE",
      };

      let resolvedUser: User | undefined;

      if (isEditMode && athlete?.id) {
        const existingMemberships = athlete.memberships ?? [];
        const hasAthleteMembership = existingMemberships.some(
          (membership: Membership) =>
            membership.role === Roles.ATHLETE &&
            membership.assignmentId === assignmentId,
        );

        const nextMemberships = hasAthleteMembership
          ? existingMemberships
          : [...existingMemberships, initialMembership as Membership];

        const updatePayload: UpdateUserDto = {
          id: athlete.id,
          ...commonProfilePayload,
          memberships: nextMemberships,
        };

        await updateUser(updatePayload);
        resolvedUser = {
          ...athlete,
          ...commonProfilePayload,
          id: athlete.id,
          memberships: nextMemberships,
        };
      } else {
        const usersResponse = await triggerGetUsers({
          role: Roles.ATHLETE,
          assignmentId,
          page: 1,
          limit: 20,
          search: normalizedUsername || normalizedDni,
        }).unwrap();

        const existingUser = usersResponse?.data?.find((user) => {
          const matchesUsername =
            user.username?.trim().toLowerCase() ===
            normalizedUsername.toLowerCase();
          const matchesDni = user.dni?.trim() === normalizedDni;
          return matchesUsername || matchesDni;
        });

        resolvedUser = existingUser;

        if (!resolvedUser) {
          const createPayload: CreateUserDto = {
            ...commonProfilePayload,
            password: normalizedDni,
            memberships: [initialMembership],
          };

          const createdUser = await createUser(createPayload);

          if (!createdUser?.id) {
            throw new Error("No se pudo crear el usuario atleta.");
          }

          resolvedUser = createdUser as typeof createdUser & { id: string };
        } else {
          const hasAthleteMembership = resolvedUser.memberships?.some(
            (membership: Membership) =>
              membership.role === Roles.ATHLETE &&
              membership.assignmentId === assignmentId,
          );

          if (!hasAthleteMembership) {
            const nextMemberships = [
              ...(resolvedUser.memberships ?? []),
              initialMembership as Membership,
            ];

            const updatePayload: UpdateUserDto = {
              id: resolvedUser.id,
              ...commonProfilePayload,
              memberships: nextMemberships,
            };

            await updateUser(updatePayload);
          } else {
            const updatePayload: UpdateUserDto = {
              id: resolvedUser.id,
              ...commonProfilePayload,
              memberships: resolvedUser.memberships ?? [],
            };

            await updateUser(updatePayload);
          }
        }
      }

      if (!resolvedUser?.id) {
        throw new Error("No se pudo resolver el usuario atleta.");
      }

      if (!isEditMode) {
        await createEnrollment(groupId!, {
          id: groupId!,
          enrollments: [
            {
              assignmentId,
              clubId: clubId!,
              groupId: groupId!,
              athleteId: resolvedUser.id,
              status: "PENDING",
              notes: "Inscripción inicial",
              enrollmentDate: new Date().toISOString(),
              joinedAt: null,
              leftAt: null,
              available: true,
            },
          ],
        });
      }

      setFormSuccess(
        isEditMode
          ? "Atleta actualizado correctamente."
          : "Atleta creado e inscrito correctamente.",
      );
      onSaved?.();
      reset(emptyForm);
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo completar la inscripción.";
      setFormError(message);
    }
  });

  const isSaving =
    isCreatingUser || isCreatingEnrollment || isUpdatingUser || isSubmitting;
  const errorMessage =
    formError ||
    createUserError ||
    createEnrollmentError ||
    updateUserError ||
    null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditMode ? "Actualizar atleta" : "Registrar atleta"}
      description={
        isEditMode
          ? "Actualiza los datos del atleta y su membresía para la asignación actual."
          : "Se creará el usuario con rol atleta y se registrará su inscripción en el grupo."
      }
      size="lg"
    >
      <form onSubmit={onSubmit}>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        {formSuccess && (
          <div className="alert alert-success" role="alert">
            {formSuccess}
          </div>
        )}

        <div className="row">
          <div className="col-md-6">
            <FormRow
              label="Nombre"
              className="mb-3"
              error={errors.name?.message}
            >
              <input
                className="form-control"
                {...register("name", { required: "El nombre es obligatorio" })}
                disabled={isSaving}
              />
            </FormRow>
          </div>

          <div className="col-md-6">
            <FormRow
              label="Apellido"
              className="mb-3"
              error={errors.lastname?.message}
            >
              <input
                className="form-control"
                {...register("lastname", {
                  required: "El apellido es obligatorio",
                })}
                disabled={isSaving}
              />
            </FormRow>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <FormRow
              label="Carnet"
              className="mb-3"
              error={errors.dni?.message}
            >
              <input
                className="form-control"
                {...register("dni", { required: "El carnet es obligatorio" })}
                disabled={isSaving}
              />
            </FormRow>
          </div>

          <div className="col-md-6">
            <FormRow
              label="Usuario"
              className="mb-3"
              error={errors.username?.message}
            >
              <div className="position-relative">
                <input
                  className="form-control pe-5"
                  {...register("username", {
                    required: "El usuario es obligatorio",
                  })}
                  disabled={isSaving}
                  onChange={(event) => {
                    register("username").onChange(event);
                    setIsUsernameManuallyEdited(true);
                  }}
                />
                {usernameAvailability === "available" && (
                  <span
                    className="position-absolute top-50 end-0 translate-middle-y me-3 text-success"
                    style={{ right: "10px" }}
                    aria-label="Usuario disponible"
                    title="Usuario disponible"
                  >
                    <i className="fa fa-check-circle" />
                  </span>
                )}
              </div>
              {usernameAvailability === "taken" &&
                usernameAvailabilityMessage && (
                  <small className="text-danger d-block mt-1">
                    {usernameAvailabilityMessage}
                  </small>
                )}
            </FormRow>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Género</label>
            <select
              className="form-control"
              {...register("gender")}
              disabled={isSaving}
            >
              <option value="">No especificado</option>
              <option value="MALE">Masculino</option>
              <option value="FEMALE">Femenino</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Fecha de nacimiento</label>
            <input
              type="date"
              className="form-control"
              {...register("birthDate")}
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Teléfono</label>
            <input
              className="form-control"
              {...register("phone")}
              disabled={isSaving}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Dirección</label>
            <input
              className="form-control"
              {...register("address")}
              disabled={isSaving}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button
            type="button"
            className="btn btn-sm btn-rounded btn-secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-sm btn-rounded btn-primary"
            disabled={isSaving}
          >
            <i className="fa fa-save" />
            &nbsp;
            {isSaving ? (
              <>
                <i className="fa fa-spinner fa-spin" /> Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
