interface ModalFooterProps {
  onCancel?: () => void;
  cancelLabel?: string;
  primaryLabel?: string;
  primaryType?: "button" | "submit" | "reset";
  disabled?: boolean;
  isLoading?: boolean;
  primaryOnClick?: () => void;
}

export const ModalFooter = ({
  onCancel,
  cancelLabel = "Cancelar",
  primaryLabel = "Guardar",
  primaryType = "submit",
  disabled = false,
  isLoading = false,
  primaryOnClick,
}: ModalFooterProps) => {
  return (
    <div className="modal-footer">
      <button
        type="button"
        className="btn btn-sm btn-rounded btn-white"
        onClick={onCancel}
        disabled={disabled}
      >
        {cancelLabel}
      </button>

      <button
        type={primaryType}
        className="btn btn-sm btn-rounded btn-primary"
        disabled={disabled}
        onClick={primaryOnClick}
      >
        {isLoading ? "Guardando..." : primaryLabel}
      </button>
    </div>
  );
};

export default ModalFooter;
