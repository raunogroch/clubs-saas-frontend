import { useCallback } from "react";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { useAssignmentPersistence } from "../../core/hooks";
import { setActiveAssignment } from "./authSlice";

/**
 * Hook para manejar cambios de assignment
 *
 * Actualiza:
 * 1. localStorage via useAssignmentPersistence
 * 2. Redux via dispatch(setActiveAssignment)
 *
 * Principios SOLID:
 * - SRP: Una responsabilidad - manejar selección de assignment
 * - DIP: Depende de abstracciones (dispatch, setActiveAssignment)
 */
export const useAssignmentSelection = () => {
  const dispatch = useAppDispatch();
  const { setAssignmentId } = useAssignmentPersistence();

  const selectAssignment = useCallback(
    (assignmentId: string) => {
      const normalizedId = assignmentId?.trim() ?? "";

      // Actualizar localStorage
      if (normalizedId) {
        setAssignmentId(normalizedId);
      } else {
        // También limpiar localStorage si se pasa vacío
        try {
          const STORAGE_KEY = "activeAssignmentId";
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Silently handle storage error
        }
      }

      // Actualizar Redux - siempre dispatch para mantener sincronizado
      dispatch(setActiveAssignment(normalizedId));
    },
    [setAssignmentId, dispatch],
  );

  return { selectAssignment };
};
