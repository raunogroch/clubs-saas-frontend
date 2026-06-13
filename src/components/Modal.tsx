import { useEffect, useCallback } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "lg" | "xl";
}

/**
 * Componente Modal reutilizable
 *
 * Características:
 * - Cierre con Escape key
 * - Cierre con click en backdrop
 * - Tipado estricto
 * - Sin manejo manual del DOM (no jQuery)
 */
export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  size,
}: ModalProps) => {
  // Mantener una referencia estable del cierre del modal
  const memoizedOnClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        memoizedOnClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.classList.add("modal-open");

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.classList.remove("modal-open");
    };
  }, [open, memoizedOnClose]);

  if (!open) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={memoizedOnClose}
        role="presentation"
      />

      {/* Modal */}
      <div
        className="modal inmodal fade show modal-shown"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className={`modal-dialog ${size ? `modal-${size}` : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content animated flipInY">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={memoizedOnClose}
                aria-label="Cerrar"
              >
                <span aria-hidden="true">&times;</span>
              </button>

              <h4 className="modal-title" id="modal-title">
                {title}
              </h4>

              {description && (
                <small className="d-block text-muted mt-1">{description}</small>
              )}
            </div>

            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};
