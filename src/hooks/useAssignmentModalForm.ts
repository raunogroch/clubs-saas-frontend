import { useEffect, useCallback } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import type { AssignmentModalProps } from "../core/interfaces";

type Inputs = {
  name: string;
  owners: string[];
};

interface UseAssignmentModalFormReturn {
  form: UseFormReturn<Inputs>;
  onClearErrors: () => void;
}

/**
 * Hook que gestiona el estado del formulario del modal de asignaciones
 * Consolida: inicialización, reset y manejo de errores
 */
export const useAssignmentModalForm = (
  open: boolean,
  data: AssignmentModalProps["data"],
): UseAssignmentModalFormReturn => {
  const form = useForm<Inputs>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      owners: [],
    },
  });

  const { reset, clearErrors } = form;

  // Reinicia el formulario solo cuando se abre/cierra el modal o cambia el ID
  useEffect(() => {
    if (open) {
      reset({
        name: data?.name ?? "",
        owners: data?.owners ?? [],
      });
      clearErrors();
    }
  }, [open, data?.id, data?.name, data?.owners, reset, clearErrors]);

  const onClearErrors = useCallback(() => {
    clearErrors();
  }, [clearErrors]);

  return {
    form,
    onClearErrors,
  };
};
