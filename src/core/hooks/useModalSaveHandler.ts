import { useCallback } from "react";

type AlertType = "success" | "error" | "warning" | "info";

interface UseModalSaveHandlerParams {
  isCreating: boolean;
  selectedItem: { name?: string } | undefined;
  refetch: () => Promise<any>;
  onModalClose: () => void;
  onShowAlert: (message: string, type?: AlertType) => void;
}

export const useModalSaveHandler = ({
  isCreating,
  selectedItem,
  refetch,
  onModalClose,
  onShowAlert,
}: UseModalSaveHandlerParams) => {
  return useCallback(async () => {
    await refetch();
    const itemName = selectedItem?.name || "";
    const action = isCreating ? "registrado" : "actualizado";
    const message = itemName
      ? `${itemName} ${action} exitosamente`
      : `Cambios guardados exitosamente`;

    onShowAlert(message, "success");
    onModalClose();
  }, [refetch, onModalClose, onShowAlert, isCreating, selectedItem?.name]);
};
