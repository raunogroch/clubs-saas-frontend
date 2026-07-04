import { ModalFooter } from "../../components";

interface CoachesModalActionsProps {
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

/**
 * CoachesModalActions Component
 *
 * Responsabilidad única: Renderizar botones de acciones del modal
 * SRP: Solo botones Cancel y Save
 * DIP: Recibe callbacks como props
 */
export const CoachesModalActions = ({
  onCancel,
  onSave,
  isSaving = false,
}: CoachesModalActionsProps) => {
  return (
    <ModalFooter
      onCancel={onCancel}
      cancelLabel="Cancelar"
      primaryLabel={isSaving ? "Guardando..." : "Guardar"}
      primaryType="button"
      disabled={isSaving}
      isLoading={isSaving}
      primaryOnClick={onSave}
    />
  );
};
