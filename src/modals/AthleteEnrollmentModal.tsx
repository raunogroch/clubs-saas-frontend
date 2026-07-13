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
  const [dniLookupStatus, setDniLookupStatus] = useState<
    "idle" | "checking" | "found" | "not-found"
  >("idle");
  const [existingAthleteLookup, setExistingAthleteLookup] =
    useState<User | null>(null);

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
  const watchedDni = useWatch({ control, name: "dni" }) as string | undefined;
  const watchedUsername = useWatch({ control, name: "username" }) as
    | string
    | undefined;
  const isEditMode = Boolean(athlete?.id);
  const [hasPerformedLookup, setHasPerformedLookup] = useState(false);
  const shouldShowProfileFields =
    isEditMode ||
    dniLookupStatus === "found" ||
    dniLookupStatus === "not-found" ||
    hasPerformedLookup;
  const applyExistingAthleteToForm = (user?: User | null) => {
    if (!user) {
      return;
    }

    setIsUsernameManuallyEdited(true);
    setValue("name", user.name ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("lastname", user.lastname ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("dni", user.dni ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("username", user.username ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("gender", user.gender ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(
      "birthDate",
      user.birthDate
        ? new Date(user.birthDate).toISOString().split("T")[0]
        : "",
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
    setValue("phone", user.phone ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("address", user.address ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  useEffect(() => {
    if (!open) return;

    reset(mapAthleteToForm(athlete));
    // Deferir updates de estado para evitar setState síncrono en el effect
    setTimeout(() => {
      setFormError(null);
      setFormSuccess(null);
      setIsUsernameManuallyEdited(Boolean(athlete?.id));
      setDniLookupStatus("idle");
      setExistingAthleteLookup(null);
      setHasPerformedLookup(false);
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

      const buildMembershipsForAssignment = (user?: User | null) => {
        const existingMemberships = (user?.memberships ?? []).map(
          (membership: Membership) => {
            const nextMembership = { ...membership } as Membership & {
              id?: string;
            };
            delete nextMembership.id;
            return nextMembership;
          },
        );
        const hasAthleteMembership = existingMemberships.some(
          (membership: Membership) =>
            membership.role === Roles.ATHLETE &&
            membership.assignmentId === assignmentId,
        );

        if (hasAthleteMembership) {
          return existingMemberships;
        }

        return [...existingMemberships, initialMembership as Membership];
      };

      let resolvedUser: User | undefined;

      if (isEditMode && athlete?.id) {
        const updatePayload: UpdateUserDto = {
          id: athlete.id,
          ...commonProfilePayload,
          memberships: buildMembershipsForAssignment(athlete),
        };

        await updateUser(updatePayload);
        resolvedUser = {
          ...athlete,
          ...commonProfilePayload,
          id: athlete.id,
          memberships: buildMembershipsForAssignment(athlete),
        };
      } else {
        const usersResponse = await triggerGetUsers({
          page: 1,
          limit: 20,
          search: normalizedUsername || normalizedDni,
        }).unwrap();

        const existingUser =
          existingAthleteLookup ??
          usersResponse?.data?.find((user) => {
            const matchesUsername =
              user.username?.trim().toLowerCase() ===
              normalizedUsername.toLowerCase();
            const matchesDni =
              user.dni?.trim().toLowerCase() === normalizedDni.toLowerCase();
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
          const nextMemberships = buildMembershipsForAssignment(resolvedUser);
          const updatePayload: UpdateUserDto = {
            id: resolvedUser.id,
            ...commonProfilePayload,
            memberships: nextMemberships,
          };

          await updateUser(updatePayload);
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

        {!hasPerformedLookup && (
          <FormRow
            label="DNI / Carnet"
            className="mb-3"
            error={errors.dni?.message}
          >
            <div className="input-group">
              <input
                className="form-control"
                {...register("dni", { required: "El carnet es obligatorio" })}
                placeholder="Ingrese el carnet para buscar"
                disabled={isSaving}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  const candidate = watchedDni?.trim() ?? "";

                  if (!candidate) {
                    setDniLookupStatus("idle");
                    setExistingAthleteLookup(null);
                    setHasPerformedLookup(false);
                    return;
                  }

                  setHasPerformedLookup(true);
                  setDniLookupStatus("checking");

                  void triggerGetUsers({
                    page: 1,
                    limit: 20,
                    search: candidate,
                  })
                    .unwrap()
                    .then((response) => {
                      const matchedUser = response?.data?.find((user) => {
                        const normalizedCandidate = candidate.toLowerCase();
                        const matchesDni =
                          user.dni?.trim().toLowerCase() ===
                          normalizedCandidate;
                        const matchesUsername =
                          user.username?.trim().toLowerCase() ===
                          normalizedCandidate;
                        return matchesDni || matchesUsername;
                      });

                      if (matchedUser) {
                        applyExistingAthleteToForm(matchedUser);
                        setExistingAthleteLookup(matchedUser);
                        setDniLookupStatus("found");
                      } else {
                        setExistingAthleteLookup(null);
                        setDniLookupStatus("not-found");
                        setValue("name", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("lastname", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("dni", candidate, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("username", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("gender", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("birthDate", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("phone", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("address", "", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }
                    })
                    .catch(() => {
                      setDniLookupStatus("idle");
                      setExistingAthleteLookup(null);
                      setHasPerformedLookup(false);
                    });
                }}
                disabled={isSaving || !watchedDni?.trim()}
              >
                <i className="fa fa-search" /> Buscar
              </button>
            </div>
          </FormRow>
        )}

        {shouldShowProfileFields && (
          <>
            <div className="row">
              <div className="col-md-6">
                <FormRow
                  label="Nombre"
                  className="mb-3"
                  error={errors.name?.message}
                >
                  <input
                    className="form-control"
                    {...register("name", {
                      required: "El nombre es obligatorio",
                    })}
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
                    {...register("dni", {
                      required: "El carnet es obligatorio",
                    })}
                    disabled={isSaving || hasPerformedLookup}
                  />
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
          </>
        )}

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
