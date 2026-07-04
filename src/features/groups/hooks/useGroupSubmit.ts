import { useCallback } from "react";
import type {
  Group,
  GroupStatus,
  CreateGroupDto,
  UpdateGroupDto,
} from "../../../core/interfaces/Groups";
import { useCreateGroup, useUpdateGroup } from "./groupHooks";
import type { GroupFormInputs } from "../ui/groupFormMapper";

/**
 * Valida que los campos requeridos tengan valor
 * Viola Single Responsibility si no se extrae
 */
const validateGroupForm = (formData: GroupFormInputs): string | null => {
  if (!formData.name?.trim()) {
    return "El nombre es obligatorio";
  }
  if (!formData.clubId?.trim()) {
    return "El club es obligatorio";
  }
  if (!formData.assignmentId?.trim()) {
    return "La asignación es obligatoria";
  }
  if (formData.minAge && formData.maxAge) {
    const minAge = parseInt(formData.minAge, 10);
    const maxAge = parseInt(formData.maxAge, 10);
    if (minAge > maxAge) {
      return "La edad mínima no puede ser mayor que la edad máxima";
    }
  }
  if (formData.maxAthletes) {
    const maxAthletes = parseInt(formData.maxAthletes, 10);
    if (maxAthletes < 1) {
      return "El máximo de atletas debe ser mayor que 0";
    }
  }
  return null;
};

export const useGroupSubmit = (
  data: Group | undefined,
  onSaved?: () => void,
  onClose?: () => void,
) => {
  const {
    createGroup,
    isLoading: isCreating,
    error: createError,
  } = useCreateGroup();
  const {
    updateGroup,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateGroup();

  const isEdit = Boolean(data?.id);
  const isSaving = isCreating || isUpdating;
  const error = createError || updateError;

  const submit = useCallback(
    async (formData: GroupFormInputs) => {
      // Validar datos antes de enviar
      const validationError = validateGroupForm(formData);
      if (validationError) {
        throw new Error(validationError);
      }

      const payload: CreateGroupDto = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        clubId: formData.clubId.trim(),
        assignmentId: formData.assignmentId.trim(),
        address: formData.address.trim() || null,
        maxAthletes: formData.maxAthletes
          ? parseInt(formData.maxAthletes, 10)
          : null,
        minAge: formData.minAge ? parseInt(formData.minAge, 10) : null,
        maxAge: formData.maxAge ? parseInt(formData.maxAge, 10) : null,
        status: formData.status as GroupStatus,
      };

      if (isEdit && data?.id) {
        await updateGroup({ id: data.id, ...payload } as UpdateGroupDto);
      } else {
        await createGroup(payload);
      }

      if (onSaved) {
        onSaved();
      }

      if (onClose) {
        onClose();
      }
    },
    [isEdit, data, createGroup, updateGroup, onSaved, onClose],
  );

  return { submit, isSaving, error };
};
