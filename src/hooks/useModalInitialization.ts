import { useEffect, useCallback } from "react";
import { useOwnerSearch } from "../core/hooks/useOwnerSearch";
import type { AssignmentModalProps } from "../core/interfaces";

export const useModalInitialization = (
  open: boolean,
  data: AssignmentModalProps["data"],
) => {
  const ownerSearch = useOwnerSearch();
  const { initializeOwners, loadSelectedUsers, owners } = ownerSearch;

  // Inicializa propietarios solo cuando se abre el modal o cambian los datos
  useEffect(() => {
    if (open) {
      initializeOwners(data);
    }
  }, [open, data, initializeOwners]);

  // Carga usuarios seleccionados cuando cambian los IDs de propietarios
  useEffect(() => {
    if (owners.length > 0) {
      loadSelectedUsers();
    }
  }, [owners, loadSelectedUsers]);

  const handleClose = useCallback(() => {
    initializeOwners();
  }, [initializeOwners]);

  return {
    ownerSearch,
    handleClose,
  };
};
