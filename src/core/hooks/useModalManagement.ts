import { useCallback, useState } from "react";

export const useModalManagement = <T>() => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | undefined>();
  const [isCreating, setIsCreating] = useState(false);

  const handleOpen = useCallback((item?: T) => {
    setSelectedItem(item);
    setIsCreating(!item);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSelectedItem(undefined);
    setIsCreating(false);
  }, []);

  const handleCreate = useCallback(() => {
    handleOpen(undefined);
  }, [handleOpen]);

  const handleEdit = useCallback(
    (item: T) => {
      handleOpen(item);
    },
    [handleOpen],
  );

  return {
    isOpen,
    selectedItem,
    isCreating,
    handleOpen,
    handleClose,
    handleCreate,
    handleEdit,
  };
};
