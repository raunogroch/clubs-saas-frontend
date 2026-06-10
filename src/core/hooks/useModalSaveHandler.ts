import { useCallback } from "react";
import { useNotification } from "./useNotification";

interface UseModalSaveHandlerParams {
  isCreating: boolean;
  selectedItem: { name?: string } | undefined;
  refetch: () => Promise<unknown>;
  onModalClose: () => void;
}

export const useModalSaveHandler = ({
  isCreating,
  selectedItem,
  refetch,
  onModalClose,
}: UseModalSaveHandlerParams) => {
  const { success } = useNotification();

  return useCallback(async () => {
    await refetch();
    const itemName = selectedItem?.name || "";
    const action = isCreating ? "registrado" : "actualizado";
    const message = itemName
      ? `${itemName} ${action} exitosamente`
      : `Cambios guardados exitosamente`;

    success(message);
    onModalClose();
  }, [refetch, onModalClose, success, isCreating, selectedItem?.name]);
};
