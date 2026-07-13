import type { SubmitHandler } from "react-hook-form";
import {
  useCreateAssignment,
  useUpdateAssignment,
} from "../features/assignments";
import type {
  AssignmentModalMode,
  AssignmentModalProps,
} from "../core/interfaces";

type Inputs = {
  name: string;
  administrators: string[];
};

import { error as logError } from "../app/logger";

interface UseAssignmentSubmitOptions {
  data?: AssignmentModalProps["data"];
  administratorIds: string[];
  mode?: AssignmentModalMode;
  onSaved?: () => void;
  onClose: () => void;
  onReset: () => void;
}

interface UseAssignmentSubmitReturn {
  onSubmit: SubmitHandler<Inputs>;
  error: string | null;
  isSaving: boolean;
}

/**
 * Hook que gestiona la lógica de submit del formulario de asignaciones
 * Consolida: creación, actualización y manejo de errores
 */
export const useAssignmentSubmit = ({
  data,
  administratorIds,
  mode = "full",
  onSaved,
  onClose,
  onReset,
}: UseAssignmentSubmitOptions): UseAssignmentSubmitReturn => {
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

  const isEdit = Boolean(data?.id);
  const isSaving = isCreating || isUpdating;
  const error = createError || updateError;

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    try {
      if (isEdit && data?.id) {
        if (mode === "name") {
          await updateAssignment({
            id: data.id,
            name: formData.name,
            administrators: data?.administrators ?? administratorIds,
          });
        } else if (mode === "administrators") {
          await updateAssignment({
            id: data.id,
            name: data?.name ?? formData.name,
            administrators: administratorIds,
          });
        } else {
          await updateAssignment({
            id: data.id,
            name: formData.name,
            administrators: administratorIds,
          });
        }
      } else {
        await createAssignment({
          name: formData.name,
          administrators: administratorIds,
        });
      }

      onReset();
      onSaved?.();
      onClose();
    } catch (err) {
      logError("Error al guardar asignación:", err);
    }
  };

  return {
    onSubmit,
    error: error as string | null,
    isSaving,
  };
};
