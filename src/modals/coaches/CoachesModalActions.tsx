import { ButtonForm } from "../../components";

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
    <div className="modal-footer">
      <ButtonForm
        className="btn btn-sm btn-rounded btn-secondary"
        onClick={onCancel}
        disabled={isSaving}
      >
        Cancelar
      </ButtonForm>

      <ButtonForm
        className="btn btn-sm btn-rounded btn-primary"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <i className="fa fa-spinner fa-spin" />
            &nbsp;Guardando...
          </>
        ) : (
          "Guardar"
        )}
      </ButtonForm>
    </div>
  );
};
