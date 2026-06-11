import { useCallback } from "react";
import type {
  Club,
  ClubSport,
  ClubStatus,
  CreateClubDto,
  UpdateClubDto,
} from "../../core/interfaces/Clubs";
import { useCreateClub, useUpdateClub } from "./clubHooks";
import type { ClubFormInputs } from "./clubFormMapper";

export const useClubSubmit = (
  data: Club | undefined,
  onSaved?: () => void,
  onClose?: () => void,
) => {
  const {
    createClub,
    isLoading: isCreating,
    error: createError,
  } = useCreateClub();
  const {
    updateClub,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateClub();

  const isEdit = Boolean(data?.id);
  const isSaving = isCreating || isUpdating;
  const error = createError || updateError;

  const submit = useCallback(
    async (formData: ClubFormInputs) => {
      const payload: CreateClubDto = {
        name: formData.name.trim(),
        image: formData.image.trim() || undefined,
        sport: formData.sport as ClubSport,
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        country: formData.country.trim(),
        assignmentId: formData.assignmentId.trim(),
        status: formData.status as ClubStatus,
        available: true,
      };

      if (isEdit && data?.id) {
        await updateClub({ id: data.id, ...payload } as UpdateClubDto);
      } else {
        await createClub(payload);
      }

      onSaved?.();
      onClose?.();
    },
    [createClub, data, isEdit, onClose, onSaved, updateClub],
  );

  return {
    submit,
    isSaving,
    error,
  };
};
